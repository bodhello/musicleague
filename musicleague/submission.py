from datetime import datetime

from musicleague.persistence.insert import insert_submission
from musicleague.persistence.models import Submission


def create_or_update_submission(tracks, submission_period, league, user):
    """ If the specified user already has a Submission for the specified
    submission_period, update it with the latest set of tracks submitted.
    If not, create one.
    """
    s = get_my_submission(user, submission_period)

    if s:
        s.created = datetime.utcnow()
        s.updated = datetime.utcnow()
        s.tracks = tracks
        s.count += 1
        insert_submission(s)
    else:
        s = create_submission(tracks, submission_period, user, league)

    return s


def create_submission(tracks, submission_period, user, league, persist=True):
    """ Create a new Submission for specified user in the specified round. """
    new_submission = Submission(user=user, tracks=tracks, created=datetime.utcnow())
    new_submission.league = league
    new_submission.submission_period = submission_period

    submission_period.submissions.append(new_submission)

    insert_submission(new_submission)

    return new_submission


def get_submission(submission_id):
    """ Return submission if submission_id found; otherwise, return None. """
    try:
        from musicleague.models import Submission as MSubmission
        return MSubmission.objects(id=submission_id).get()
    except MSubmission.DoesNotExist:
        return None


def get_my_submission(user, submission_period):
    return next(
        (s for s in submission_period.submissions
         if s.user.id == user.id), None)
