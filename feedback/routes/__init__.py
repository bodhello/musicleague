# flake8: noqa
from flask import g
from flask import redirect
from flask import request
from flask import url_for

from feedback import app
from feedback.models import League
from feedback.models import Submission
from feedback.models import User
from feedback.routes.admin import admin
from feedback.routes.admin import admin_leagues
from feedback.routes.admin import admin_tools
from feedback.routes.admin import admin_users
from feedback.routes.admin.tools import clean_submission_periods
from feedback.routes.admin.tools import clean_submissions
from feedback.routes.auth import before_request
from feedback.routes.auth import login
from feedback.routes.auth import logout
from feedback.routes.decorators import templated
from feedback.routes.league import add_user_for_league
from feedback.routes.league import get_create_league
from feedback.routes.league import remove_league
from feedback.routes.league import view_league
from feedback.routes.spotify import create_spotify_playlist
from feedback.routes.spotify import view_playlist
from feedback.routes.submission_period import post_create_submission_period
from feedback.routes.submission_period import remove_submission_period
from feedback.routes.submission_period import save_submission_period_settings
from feedback.routes.submission_period import view_submission_period
from feedback.routes.submit import submit
from feedback.routes.user import profile
from feedback.routes.user import view_user
from feedback.routes.vote import vote
from feedback.spotify import get_spotify_oauth


HELLO_URL = '/'


@app.route(HELLO_URL)
@templated('hello.html')
def hello():
    # If user is logged in, always send to profile
    if g.user:
        return redirect(url_for('profile'))

    return {
        'user': g.user,
        'oauth_url': get_spotify_oauth().get_authorize_url(),
        'leagues': League.objects().count(),
        'submissions': Submission.objects().count(),
        'users': User.objects().count(),
        'action': request.args.get('action')
        }
