import logging
import sys

from celery import Celery

from flask import Flask
from flask_moment import Moment

from musicleague.environment import get_redis_url
from musicleague.environment import get_secret_key
from musicleague.environment import get_server_name
from musicleague.environment import is_debug
from musicleague.environment import is_deployed
from musicleague.environment import parse_mongolab_uri

from mongoengine import connect

from settings import MONGO_DB_NAME


# Initialize Flask app
app = Flask(__name__)
moment = Moment(app)
app.secret_key = get_secret_key()
app.config['BROKER_TRANSPORT_OPTIONS'] = {
    'max_connections': 5,
    'visibility_timeout': 2678400}  # 1 month

app.config['CELERY_ACCEPT_CONTENT'] = ['json']
app.config['CELERY_BROKER_URL'] = get_redis_url()
app.config['CELERY_TASK_SERIALIZER'] = 'json'

if is_deployed():
    app.config['SERVER_NAME'] = get_server_name()

    host, port, username, password, db = parse_mongolab_uri()
    db = connect(db, host=host, port=port, username=username,
                 password=password)
    logging.basicConfig(level=logging.DEBUG if is_debug() else logging.WARNING)
else:
    db = connect(MONGO_DB_NAME)
    logging.basicConfig(level=logging.DEBUG)

app.logger.addHandler(logging.StreamHandler(sys.stdout))

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)


from musicleague import routes  # noqa