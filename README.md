# Music League
[![Build Status](https://travis-ci.org/nathancoleman/feedback.svg?branch=master)](https://travis-ci.org/nathancoleman/feedback)
[![Project Status: WIP - Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](http://www.repostatus.org/badges/latest/wip.svg)](http://www.repostatus.org/#wip)

Have you ever wanted to battle it out with your friends and see who has the
best taste in music?

Music League let's you do just that! Create a league, invite your friends,
and have everyone submit their favorite songs to be
voted on by the entire group! Music League integrates with the Spotify API and will
handle the playlists, email reminders, and voting - all you have to do is
submit, listen, and vote!

## Using this Repo
Music League relies on multiple other open source projects:
- [Flask](http://flask.pocoo.org/)
- [Mongo](https://www.mongodb.org/) (via [MongoEngine](http://mongoengine.org/))
- [Spotipy](http://spotipy.readthedocs.io/en/latest/)

I recommend using [virtualenv](http://www.virtualenv.org/en/latest/) along with
[virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/) for
the smoothest experience.

You may do any of the below after cloning this repo and running ```make install```.

### Linting
```
make lint
```

### Running Unit Tests
```
make unit
```

### Running Locally
```
make run
```

### Running Continuous Integration Script
```
make ci
```
