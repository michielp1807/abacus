#![no_main]

use abacus::apportionment::{seat_allocation, ApportionmentError};
use abacus_fuzz::FuzzedElectionSummary;
use kiesraad_model::{Seats, Votes};
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: FuzzedElectionSummary| {
    match seat_allocation(data.seats, &data.election_summary) {
        Ok(alloc) => {
            let total_votes = u64::from(data.total_votes);
            let seats = alloc.get_total_seats();

            // absolute majority correction needed (Abacus currently doesn't do this yet)
            for (i, votes) in data.votes.iter().enumerate() {
                if 2 * u64::from(*votes) > total_votes && 2 * seats[i] <= data.seats {
                    return; // ignore
                }
            }

            let mut marc_seats = data
                .votes
                .iter()
                .map(|_| Seats::unlimited())
                .collect::<Vec<Seats>>();
            let marc_votes = data
                .votes
                .iter()
                .map(|v| Votes((*v).into()))
                .collect::<Vec<Votes>>();
            kiesraad_model::allocate(Seats::filled(data.seats), &marc_votes, &mut marc_seats);
            assert!(
                seats
                    .iter()
                    .map(|s| *s)
                    .eq(marc_seats.iter().map(|s| s.count())),
                "Marc's implementation did not produce the same results:\nMarc: {:?}\nAbacus: {:?}",
                marc_seats,
                seats
            );
        }
        Err(ApportionmentError::DrawingOfLotsNotImplemented) => {} // ignore
    }
});
