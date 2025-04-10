#!/usr/bin/env python3

from fractions import Fraction
from typing import Callable, List

# Seat apportionment algorithm based on https://github.com/squell/electionchecker

# Does not yet support the following features (which Abacus also does not yet support)
# - Drawing with lots: throws an exception if drawing with lots is needed to decide the final allocation
# - National apportionment for the Dutch parliament and European Parliament (has different voting threshold)

# Perform a seat apportionment, selecting D'Hondt or modified-Hamilton
# based on the number of seats, as Dutch law does for bodies.
def allocate(total_seats: int, votes: List[int], candidates: List[int]) -> List[int]:
    if total_seats >= 19:
        return allocate_per_average(total_seats, votes, candidates)
    else:
        return allocate_per_surplus(total_seats, votes, candidates)


# Perform a seat apportionment based on the given method.
# It is a **requirement** that the `criterion` algorithm will always rank a party that is
# eligible for at least one more seat above a party that doesn't.
def allocate_seats(
    total_seats: int,
    votes: List[int],
    candidates: List[int],
    criterion: Callable[[int, int], int],
    seats: List[int] | None = None
) -> List[int]:
    total_votes = sum(votes)
    
    if seats is None:
        # Initialize seats with whole seats
        seats = [min(total_seats * v // total_votes, c) for v, c in zip(votes, candidates)]

    while sum(seats) < total_seats:
        # Compute how much each party deserves an extra seat
        qualities = [criterion(v, s) if s < c else -1 for v, s, c in zip(votes, seats, candidates)]       
        max_quality = max(qualities)

        if max_quality < 0:
            # No parties deserve another seat according to the provided criterion
            return seats

        # Gather all parties that deserve an extra seat
        awarded = [i for i, q in enumerate(qualities) if q == max_quality]

        if sum(seats) + len(awarded) > total_seats:
            # Multiple parties are equally eligible, but we can not give them all a seat.
            raise Exception("Drawing with lots is needed!")

        # Award seats
        for i in awarded:
            seats[i] += 1

    # Absolute majority correction
    for i, (party_votes, party_seats, party_candidates) in enumerate(zip(votes, seats, candidates)):
        if 2 * party_votes > total_votes and not 2 * party_seats > total_seats:
            if party_seats + 1 > party_candidates:
                break # we can't give them an extra seat anyways

            if len(awarded) > 1:
                # There are multiple parties that we could remove the corrected seat from
                raise Exception("Drawing with lots is needed for absolute majority correction!")
                
            seats[awarded[0]] -= 1
            seats[i] += 1

    return seats


# Perform a seat apportionment based on the D'Hondt method.
# This system is currently used in the Netherlands for regional councils least 19 seats or more.
def allocate_per_average(total_seats: int, votes: List[int], candidates: List[int]) -> List[int]:
    return allocate_seats(total_seats, votes, candidates, lambda v, s: Fraction(v, s + 1))


# Perform a seat apportionment based on the Hamilton method, with a
# voting threshold of 75% of a whole seat, and parties receiving a maximum of one extra seat.
# If seats remain after that, apportion the remainder of seats using D'Hondt, with
# parties again only receiving a maximum of one additional seat.
# This system is currently used in the Netherlands for bodies of less than 19 seats.
def allocate_per_surplus(total_seats: int, votes: List[int], candidates: List[int]) -> List[int]:
    total_votes = sum(votes)
    quota = Fraction(total_votes, total_seats) # the "kiesdeler"

    def has_surplus(v, s):
        return v >= s * quota

    def meets_threshold(v):
        return v >= Fraction(3, 4) * quota

    # Gives max. 1 extra seat per party.
    def surplus(v, s):
        return v - s * quota if has_surplus(v, s) and meets_threshold(v) else -1

    seats = allocate_seats(total_seats, votes, candidates, surplus)
    
    if sum(seats) < total_seats:
        # Gives max. 1 more extra seat per party.
        def quotient_with_threshold(v, s):
            if has_surplus(v, (s - 1) if meets_threshold(v) else s):
                return Fraction(v, s + 1)
            else:
                return -1

        seats = allocate_seats(total_seats, votes, candidates, quotient_with_threshold, seats=seats)
    
    if sum(seats) < total_seats:
        # Continue with unrestricted averages
        # (not clearly stated in the Kieswet, but this is what the Kiesraad does in the rare case this is necessary)
        seats = allocate_seats(total_seats, votes, candidates, lambda v, s: Fraction(v, s + 1), seats=seats)

    return seats


# Test cases taken from https://github.com/kiesraad/abacus/blob/0a6b54a572f62dacf0a42fcb9960ff41ab7e91cc/backend/src/apportionment/seat_assignment.rs#L945
if __name__ == "__main__":
    def allocate_default_candidates(total_seats, votes):
        return allocate(total_seats, votes, [50 for _ in votes])
    

    def expect_exception(total_seats, votes):
        try:
            allocate_default_candidates(total_seats, votes)
        except Exception:
            return True
        else:
            return False

    # Some test cases for < 19 seats
    assert allocate_default_candidates(15, [480, 160, 160, 160, 80, 80, 80]) == [6, 2, 2, 2, 1, 1, 1]
    assert allocate_default_candidates(15, [540, 160, 160, 80, 80, 80, 60, 40]) == [7, 2, 2, 1, 1, 1, 1, 0]
    assert allocate_default_candidates(15, [808, 59, 58, 57, 56, 55, 54, 53]) == [12, 1, 1, 1, 0, 0, 0, 0]
    assert allocate_default_candidates(15, [480, 240, 240, 55, 50, 45, 45, 45]) == [7, 4, 4, 0, 0, 0, 0, 0]
    assert allocate_default_candidates(3, [8, 7, 6, 5, 4, 3, 2, 1, 1, 1]) == [1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
    assert allocate_default_candidates(10, [0, 3, 5, 6, 7, 79]) == [0, 0, 0, 0, 1, 9]
    assert expect_exception(10, [0, 0, 0, 0, 0]) # zero votes cast
    
    # These tests need absolute majority correction to succeed 
    assert allocate_default_candidates(15, [2571, 977, 567, 536, 453]) == [8, 3, 2, 1, 1]
    assert expect_exception(15, [2552, 511, 511, 511, 509, 509]) # drawing of lots
    
    assert expect_exception(15, [540, 160, 160, 80, 80, 80, 55, 45]) # drawing of lots
    assert expect_exception(15, [500, 140, 140, 140, 140, 140]) # drawing of lots

    assert allocate(15, [2000, 1600, 1200, 800, 400], [4, 4, 3, 2, 2]) == [4, 4, 3, 2, 2]
    assert allocate(17, [1116, 485, 832, 658, 601, 649, 606, 326, 1184, 716, 380], [17, 6, 11, 11, 10, 8, 13, 14, 12, 1, 6]) == [3, 1, 2, 2, 1, 2, 1, 0, 3, 1, 1]
    assert allocate(10, [0, 3, 5, 6, 7, 79], [1, 1, 1, 1, 1, 8]) == [0, 0, 0, 1, 1, 8]
    assert allocate(6, [5, 5, 50], [2, 2, 2]) == [2, 2, 2]
    assert allocate(6, [6, 4, 50], [2, 2, 2]) == [2, 2, 2]
    
    assert allocate(15, [2571, 977, 567, 536, 453], [7, 4, 2, 2, 2]) == [7, 3, 2, 2, 1]
    assert allocate(8, [32, 41, 7], [5, 3, 1]) == [4, 3, 1]
    assert allocate(8, [537, 10, 426], [2, 1, 6]) == [2, 1, 5]

    # Some test cases for >= 19 seats
    assert allocate_default_candidates(25, [576, 288, 96, 96, 96, 48]) == [12, 6, 2, 2, 2, 1]
    assert allocate_default_candidates(23, [600, 302, 98, 99, 101]) == [12, 6, 1, 2, 2]
    assert allocate_default_candidates(19, [808, 57, 56, 55, 54, 53, 52, 51, 14]) == [15, 1, 1, 1, 1, 0, 0, 0, 0]
    assert expect_exception(19, [0]) # zero votes cast
    
    # These tests need absolute majority correction to succeed 
    assert allocate_default_candidates(24, [7501, 1249, 1249, 1249, 1249, 1249, 1248, 7]) == [13, 2, 2, 2, 2, 2, 1, 0]
    assert expect_exception(24, [7501, 1249, 1249, 1249, 1249, 1248, 1248, 8]) # drawing of lots
    
    assert expect_exception(23, [500, 140, 140, 140, 140, 140]) # drawing of lots

    assert allocate(20, [2000, 2000, 1600, 1600, 800], [4, 5, 4, 4, 3]) == [4, 5, 4, 4, 3]
    assert allocate(19, [1599, 1598, 1598, 1598, 1002], [5, 5, 5, 5, 2]) == [5, 4, 4, 4, 2]
    assert allocate(24, [7501, 1249, 1249, 1249, 1249, 1249, 1248, 7], [12, 2, 2, 2, 2, 2, 2, 1]) == [12, 2, 2, 2, 2, 2, 2, 0]

    print("all tests passed!")
