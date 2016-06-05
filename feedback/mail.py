import logging
import requests

from flask import render_template

from feedback.environment import is_deployed
from feedback.environment import get_setting
from feedback.environment.variables import MAILGUN_API_BASE_URL
from feedback.environment.variables import MAILGUN_API_KEY
from feedback.environment.variables import NOTIFICATION_SENDER


HTML_PATH = 'email/html/%s'
TXT_PATH = 'email/txt/%s'


def submission_notification(to, submission):
    _send_mail(
        to, 'Music League Submission',
        render_template(TXT_PATH % 'submitted.txt', user=submission.user),
        render_template(HTML_PATH % 'submitted.html', user=submission.user))


def _send_mail(to, subject, text, html):
    if not is_deployed():
        logging.info(text)
        return

    api_key = get_setting(MAILGUN_API_KEY)
    api_base_url = get_setting(MAILGUN_API_BASE_URL)
    request_url = '{}/messages'.format(api_base_url)
    sender = get_setting(NOTIFICATION_SENDER)
    request = requests.post(request_url,
                            auth=("api", api_key),
                            data={"from": sender,
                                  "to": to,
                                  "subject": subject,
                                  "text": text,
                                  "html": html})

    if request.status_code != 200:
        logging.warning(
            u'Mail send failed. Status: {}, Response: {}'.format(
                request.status_code, request.text))
