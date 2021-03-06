from datetime import datetime
from datetime import timedelta
import logging
from pytz import utc

from rq.exceptions import NoSuchJobError
from rq.job import Job

from musicleague import redis_conn
from musicleague import scheduler
from musicleague.environment import is_deployed
from musicleague.persistence.select import select_league
from musicleague.submission_period.tasks import complete_submission_period
from musicleague.submission_period.tasks import complete_submission_process
from musicleague.submission_period.tasks import notify_new_round
from musicleague.submission_period.tasks import send_submission_reminders
from musicleague.submission_period.tasks import send_vote_reminders
from musicleague.submission_period.tasks import TYPES


def schedule_round_completion(submission_period):
    if not is_deployed():
        return

    completion_time = submission_period.vote_due_date

    job_id = '%s_%s' % (submission_period.id, TYPES.COMPLETE_SUBMISSION_PERIOD)

    try:
        # If job has been previously scheduled, reschedule
        job = Job.fetch(job_id, connection=redis_conn)
        scheduler.change_execution_time(job, completion_time)
        logging.info('Round completion job updated', extra={'execute': completion_time, 'job': job.id})

    except (NoSuchJobError, ValueError):
        # If job has not been previously scheduled or is no longer in queue, enqueue
        job = scheduler.enqueue_at(
            completion_time, complete_submission_period, submission_period.id,
            job_id=job_id)

        logging.info('Round completion enqueued', extra={'execute': completion_time, 'job': job.id})


def schedule_new_round_notification(submission_period):
    if not is_deployed():
        return

    notify_time = datetime.now() + timedelta(minutes=5)

    job_id = '%s_%s' % (submission_period.id, TYPES.NOTIFY_SUBMISSION_PERIOD)

    try:
        # If job has been previously scheduled, reschedule
        job = Job.fetch(job_id, connection=redis_conn)
        scheduler.change_execution_time(job, notify_time)
        logging.info('New round notification job updated', extra={'execute': notify_time, 'job': job.id})

    except (NoSuchJobError, ValueError):
        # If job has not been previously scheduled or is no longer in queue, enqueue
        job = scheduler.enqueue_at(notify_time, notify_new_round, submission_period.id, job_id=job_id)

        logging.info('New round notification enqueued', extra={'execute': notify_time, 'job': job.id})


def schedule_playlist_creation(submission_period):
    if not is_deployed():
        return

    creation_time = submission_period.submission_due_date

    job_id = '%s_%s' % (submission_period.id, TYPES.CREATE_PLAYLIST)

    try:
        # If job has been previously scheduled, reschedule
        job = Job.fetch(job_id, connection=redis_conn)
        scheduler.change_execution_time(job, creation_time)
        logging.info('Playlist creation job updated', extra={'execute': creation_time, 'job': job.id})

    except (NoSuchJobError, ValueError):
        # If job has not been previously scheduled or is no longer in queue, enqueue
        job = scheduler.enqueue_at(
            creation_time, complete_submission_process, submission_period.id,
            job_id=job_id)

        logging.info('Playlist creation enqueued', extra={'execute': creation_time, 'job': job.id})


def schedule_submission_reminders(submission_period):
    if not is_deployed():
        return

    # TODO Select preference instead of entire league
    league = select_league(submission_period.league_id)

    diff = league.preferences.submission_reminder_time
    notify_time = submission_period.submission_due_date - timedelta(hours=diff)

    job_id = '%s_%s' % (submission_period.id, TYPES.SEND_SUBMISSION_REMINDERS)

    # If notification time would be in the past, cancel
    # any enqueued job instead of scheduling
    if notify_time < utc.localize(datetime.now()):
        logging.info('Not rescheduling submission reminder - datetime has passed',
                     extra={'execute': notify_time, 'round': submission_period.id})
        scheduler.cancel(job_id)
        return

    try:
        # If job has been previously scheduled, reschedule
        job = Job.fetch(job_id, connection=redis_conn)
        scheduler.change_execution_time(job, notify_time)
        logging.info('Submission reminder job updated', extra={'execute': notify_time, 'job': job.id})

    except (NoSuchJobError, ValueError):
        # If job jas not been previously scheduled, enqueue
        job = scheduler.enqueue_at(
            notify_time, send_submission_reminders, submission_period.id,
            job_id=job_id)

        logging.info('Submission reminder enqueued', extra={'execute': notify_time, 'job': job.id})


def schedule_vote_reminders(submission_period):
    if not is_deployed():
        return

    # TODO Select preference instead of entire league
    league = select_league(submission_period.league_id)

    diff = league.preferences.vote_reminder_time
    notify_time = submission_period.vote_due_date - timedelta(hours=diff)

    job_id = '%s_%s' % (submission_period.id, TYPES.SEND_VOTE_REMINDERS)

    # If notification time would be in the past, cancel
    # any enqueued job instead of scheduling
    if notify_time < utc.localize(datetime.now()):
        logging.info('Not rescheduling vote reminder - datetime has passed',
                     extra={'execute': notify_time, 'round': submission_period.id})
        scheduler.cancel(job_id)
        return

    try:
        # If job has been previously scheduled, reschedule
        job = Job.fetch(job_id, connection=redis_conn)
        scheduler.change_execution_time(job, notify_time)

        logging.info('Vote reminder job updated', extra={'execute': notify_time, 'job': job.id})

    except (NoSuchJobError, ValueError):
        # If job has not been previously scheduled or is no longer in queue, enqueue
        job = scheduler.enqueue_at(
            notify_time, send_vote_reminders, submission_period.id,
            job_id=job_id)

        logging.info('Vote reminder enqueued', extra={'execute': notify_time, 'job': job.id})
