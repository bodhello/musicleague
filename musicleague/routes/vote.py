from collections import OrderedDict
import httplib
import json
from os import getenv
import requests

from flask import g
from flask import redirect
from flask import request
from flask import session
from flask import url_for

from musicleague import app
from musicleague.notify import owner_user_voted_notification
from musicleague.notify import user_last_to_vote_notification
from musicleague.persistence.select import select_league
from musicleague.routes.decorators import login_required
from musicleague.routes.decorators import templated
from musicleague.submission import get_my_submission
from musicleague.submission_period.tasks import complete_submission_period
from musicleague.vote import create_or_update_vote
from musicleague.vote import get_my_vote


VOTE_URL = '/l/<league_id>/<submission_period_id>/vote/'
VOTE_URL_V2 = VOTE_URL + '2/'


@app.route(VOTE_URL, methods=['GET'])
@templated('vote/page.html')
@login_required
def view_vote(league_id, submission_period_id):
    league = select_league(league_id)
    submission_period = next((sp for sp in league.submission_periods
                              if sp.id == submission_period_id), None)
    if not league.has_user(g.user):
        return redirect(url_for('view_league', league_id=league.id))

    if (league.current_submission_period is None or
            league.current_submission_period.id != submission_period_id):
        return redirect(url_for('view_league', league_id=league.id))

    if not submission_period.accepting_votes:
        return redirect(url_for('view_league', league_id=league.id))

    my_submission = get_my_submission(g.user, submission_period)

    # If this user didn't submit for this round, don't allow them to vote
    if not my_submission:
        return redirect(url_for('view_league', league_id=league.id))

    # If this user already voted for this round, don't allow them to vote
    if get_my_vote(g.user, submission_period):
        return redirect(url_for('view_league', league_id=league.id))

    # my_vote = get_my_vote(g.user, submission_period)
    my_vote = None

    tracks = []
    if submission_period.all_tracks:
        tracks = g.spotify.tracks(submission_period.all_tracks).get('tracks')

    tracks_by_uri = OrderedDict()
    for track in tracks:
        if track:
            tracks_by_uri[track.get('uri')] = track

    # Remove user's own submitted songs from tracks shown on page
    if my_submission:
        for uri in my_submission.tracks:
            tracks_by_uri.pop(uri, None)

    return {
        'user': g.user,
        'league': league,
        'round': submission_period,
        'tracks_by_uri': tracks_by_uri,
        'my_vote': my_vote,
        'access_token': session['access_token'],
    }


@app.route(VOTE_URL_V2, methods=['POST'])
@login_required
def vote_v2(league_id, submission_period_id):

    try:
        votes = json.loads(request.form.get('votes'))
        comments = json.loads(request.form.get('comments'))

        # Remove all unnecessary zero-values
        votes = {k: v for k, v in votes.iteritems() if v}
        comments = {k: v for k, v in comments.iteritems() if v}

        uris = set(votes.keys() + comments.keys())

        auth_headers = {'Authorization': 'Bearer ' + g.access_token}
        api_domain = getenv('API_DOMAIN')

        vote_objects = [
            {
                'comment': comments.get(uri, ''),
                'spotifyUri': uri,
                'weight': votes.get(uri, 0)
            }
            for uri in uris
        ]

        requests.put('https://{}/v1/leagues/{}/rounds/{}/votes/{}'.format(
                        api_domain, league_id, submission_period_id, g.user.id),
                     headers=auth_headers, data=json.dumps({'votes': vote_objects}))

    except Exception:
        app.logger.exception(
            'Failed to process votes',
            extra={'user': g.user.id, 'league': league_id, 'round': submission_period_id})

    return redirect(url_for('view_submission_period', league_id=league_id,
                            submission_period_id=submission_period_id))


@app.route(VOTE_URL, methods=['POST'])
@login_required
def vote(league_id, submission_period_id):
    try:
        league = select_league(league_id)
        if league.version == 2:
            return redirect(
                url_for('vote_v2', league_id=league_id, submission_period_id=submission_period_id),
                code=httplib.TEMPORARY_REDIRECT)

        submission_period = next((sp for sp in league.submission_periods
                                  if sp.id == submission_period_id), None)

        if not league or not submission_period:
            return "No submission period or league", httplib.INTERNAL_SERVER_ERROR

        if not league.has_user(g.user):
            return "Not a member of this league", httplib.UNAUTHORIZED

        # If this is not the current round, redirect
        if (league.current_submission_period is None or
                league.current_submission_period.id != submission_period_id):
            return redirect(request.referrer)

        # If this round is no longer accepting votes, redirect
        if not submission_period.accepting_votes:
            return redirect(request.referrer)

        # If this user didn't submit for this round, don't allow them to vote
        if not get_my_submission(g.user, submission_period):
            return redirect(url_for('view_league', league_id=league_id))

        # If this user already voted for this round, don't allow them to vote
        if get_my_vote(g.user, submission_period):
            return redirect(url_for('view_league', league_id=league_id))

        try:
            votes = json.loads(request.form.get('votes'))
            comments = json.loads(request.form.get('comments'))
        except Exception:
            app.logger.exception("Failed to load JSON from form with votes: %s",
                                 request.form)
            return 'There was an error processing votes', 500

        # Remove all unnecessary zero-values
        votes = {k: v for k, v in votes.iteritems() if v}
        comments = {k: v for k, v in comments.iteritems() if v}

        # Process votes
        vote = create_or_update_vote(votes, comments, submission_period, league, g.user)

        # If someone besides owner is voting, notify the owner
        if not league.has_owner(g.user):
            owner_user_voted_notification(vote)

        remaining = submission_period.have_not_voted
        if not remaining:
            complete_submission_period.delay(submission_period.id)

        elif vote.count < 2 and len(remaining) == 1:
            last_user = remaining[0]
            user_last_to_vote_notification(last_user, submission_period)

        return redirect(url_for('view_submission_period', league_id=league_id,
                                submission_period_id=submission_period_id))

    except Exception:
        app.logger.exception(
            'Failed to process votes',
            extra={'user': g.user.id, 'league': league_id, 'round': submission_period_id})
