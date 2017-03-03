from collections import Counter

from itertools import groupby

from musicleague.models import RankingEntry
from musicleague.models import Scoreboard
from musicleague.scoring import EntrySortKey


def calculate_league_scoreboard(league):
    """ Calculate and store scoreboard on league. The scoreboard consists of
    a dict where keys are the rankings for each entry. The values for the
    scoreboard are lists of entries. In most cases, the list will have a
    length of 1; however, if two or more users are tied, the list will grow
    in length for a particular ranking.
    """
    league.scoreboard = Scoreboard()

    # Create a RankingEntry for each song with corresponding User
    entries = {user.id: RankingEntry(league=league, user=user)
               for user in league.users}

    # Get song entries for each entry
    for round in league.submission_periods:
        for entry_list in round.scoreboard.rankings.values():
            for entry in entry_list:
                user_id = entry.submission.user.id
                if user_id in entries:
                    entries[user_id].entries.append(entry)

    # Sort entries on each entry by number of points awarded
    for entry in entries.values():
        entry.entries = sorted(entry.entries,
                               key=lambda x: x.points,
                               reverse=True)

    # Rank entries and assign to league scoreboard with string keys
    rankings = rank_entries(entries.values())
    for rank, entries in rankings.iteritems():
        league.scoreboard._rankings[str(rank)] = entries

    league.save()
    return league


def rank_entries(entries):
    """ Given a list of RankingEntry entities, return a dict where the key
    is the ranking and the value is a list of RankingEntry entities for that
    ranking. In general, we aim for this list to have a length of 1 for each
    key since a list with length > 1 means there is a tie for the ranking.
    """
    entries = sorted(entries, key=RankingEntrySortKey, reverse=True)
    grouped_entries = groupby(entries, key=RankingEntrySortKey)
    entries = [list(group) for _, group in grouped_entries]

    # Index entries by ranking
    return {(i + 1): entries for i, entries in enumerate(entries)}


class RankingEntrySortKey(EntrySortKey):

    def _ordered_cmp(self, other):
        _cmp_order = [
            self._cmp_entry_points,
            self._cmp_entry_num_voters,
            self._cmp_entry_highest_rank
        ]

        for _cmp in _cmp_order:
            diff = _cmp(other)
            if diff != 0:
                return diff

        return 0

    def _cmp_entry_points(self, other):
        """ Compare two RankingEntry objects based on the raw number of
        points.
        """
        if self.obj.points > other.points:
            return 1
        elif self.obj.points < other.points:
            return -1
        return 0

    def _cmp_entry_num_voters(self, other):
        """ Compare two RankingEntry objects based on the number of unique
        users who voted for each.
        """
        self_voters = set(
            [v.user.id for entry in self.obj.entries for v in entry.votes])

        other_voters = set(
            [v.user.id for entry in other.entries for v in entry.votes])

        if len(self_voters) > len(other_voters):
            return 1
        elif len(self_voters) < len(other_voters):
            return -1
        return 0

    def _cmp_entry_highest_rank(self, other):
        """ Compare two RankingEntry objects based on the highest rank each
        user received.
        """
        self_rankings, other_rankings = [], []
        for round in self.obj.league.submission_periods:
            for rank, rank_entries in round.scoreboard.rankings.iteritems():
                for entry in rank_entries:
                    if entry.submission.user.id == self.obj.user.id:
                        self_rankings.append(rank)
                    elif entry.submission.user.id == other.user.id:
                        other_rankings.append(rank)

        # Get sorted lists of asymmetric rankings. We can't use set() for this
        # as duplicates should be kept intact when doing the diff.
        self_counter = Counter(self_rankings)
        self_counter.subtract(Counter(other_rankings))
        self_asym = sorted(list(self_counter.elements()), reverse=True)

        other_counter = Counter(other_rankings)
        other_counter.subtract(Counter(self_rankings))
        other_asym = sorted(list(other_counter.elements()), reverse=True)

        if next(iter(self_asym), 0) > next(iter(other_asym), 0):
            return 1
        elif next(iter(self_asym), 0) < next(iter(other_asym), 0):
            return -1

        return 0