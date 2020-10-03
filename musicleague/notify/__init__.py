
from musicleague.notify.email import owner_user_submitted_email
from musicleague.notify.email import owner_user_voted_email
from musicleague.notify.email import user_added_to_league_email
from musicleague.notify.email import user_all_voted_email
from musicleague.notify.email import user_invited_to_league_email
from musicleague.notify.email import user_last_to_submit_email
from musicleague.notify.email import user_last_to_vote_email
from musicleague.notify.email import user_new_round_email
from musicleague.notify.email import user_playlist_created_email
from musicleague.notify.email import user_submit_reminder_email
from musicleague.notify.email import user_vote_reminder_email


def owner_user_submitted_notification(submission):
    if not submission:
        return

    owner = submission.league.owner
    if not owner:
        return

    if not owner.preferences.owner_user_submitted_notifications:
        return

    owner_user_submitted_email(owner, submission)
    return True


def owner_user_voted_notification(vote):
    if not vote:
        return

    owner = vote.league.owner
    if not owner:
        return

    if not owner.preferences.owner_user_voted_notifications:
        return

    owner_user_voted_email(owner, vote)
    return True


def user_added_to_league_notification(user, league):
    if not league or not user:
        return

    if not user.preferences.user_added_to_league_notifications:
        return

    user_added_to_league_email(user, league)
    return True


def user_all_voted_notification(submission_period):
    if not submission_period or not submission_period.league.users:
        return

    user_all_voted_email(submission_period)
    return True


def user_invited_to_league_notification(invited_user, league):
    if not league or not invited_user:
        return

    user_invited_to_league_email(invited_user, league)
    return True


def user_last_to_submit_notification(user, submission_period):
    if not submission_period or not user:
        return

    user_last_to_submit_email(user, submission_period)
    return True


def user_last_to_vote_notification(user, submission_period):
    if not submission_period or not user:
        return

    user_last_to_vote_email(user, submission_period)
    return True


def user_new_round_notification(submission_period):
    if not submission_period or not submission_period.league.users:
        return

    # NOTE: Preference is checked within the calls below

    user_new_round_email(submission_period)
    return True


def user_playlist_created_notification(submission_period):
    if not submission_period or not submission_period.league.users:
        return

    # NOTE: Preference is checked within the calls below

    user_playlist_created_email(submission_period)
    return True


def user_submit_reminder_notification(user, submission_period):
    if not submission_period or not user:
        return

    if not user.preferences.user_submit_reminder_notifications:
        return

    user_submit_reminder_email(user, submission_period)
    return True


def user_vote_reminder_notification(user, submission_period):
    if not submission_period or not user:
        return

    if not user.preferences.user_vote_reminder_notifications:
        return

    user_vote_reminder_email(user, submission_period)
    return True
