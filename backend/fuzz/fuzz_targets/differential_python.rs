#![no_main]

use abacus::apportionment::{ApportionmentError, seat_assignment as seat_allocation};
use abacus_fuzz::FuzzedElectionSummary;
use libfuzzer_sys::fuzz_target;
use pyo3::ffi::c_str;
use pyo3::prelude::*;

fn python_seat_allocation(seats: u32, votes: Vec<u32>, candidates: Vec<u32>) -> PyResult<Vec<u32>> {
    Python::with_gil(|py| {
        let code = c_str!(include_str!("../apportionment.py"));
        let module = PyModule::from_code(
            py,
            code,
            c_str!("apportionment.py"),
            c_str!("apportionment"),
        )?;

        module
            .getattr("allocate")?
            .call1((seats, votes, candidates))?
            .extract()
    })
}

fuzz_target!(|data: FuzzedElectionSummary| {
    match seat_allocation(data.seats, &data.election_summary) {
        Ok(alloc) => {
            let candidates = data.votes.iter().map(|x| x.len() as u32).collect();
            let votes = data.votes.iter().map(|x| x.into_iter().sum::<u32>());
            let py_seats =
                python_seat_allocation(data.seats, votes.clone().collect(), candidates).unwrap();

            let seats = alloc.get_total_seats();
            assert!(
                seats.iter().eq(py_seats.iter()),
                "Python implementation did not produce the same results:\nPython: {:?}\nAbacus: {:?}\n{:?}",
                py_seats,
                seats,
                data
            );
        }
        Err(ApportionmentError::DrawingOfLotsNotImplemented) => {} // ignore
        Err(ApportionmentError::AllListsExhausted) => {
            // this should only happen if the number of candidates is smaller than the number of seats
            let candidates = data.votes.iter().flatten().count() as u32;
            assert!(
                candidates < data.seats,
                "Abacus gave AllListsExhausted error, but there are plenty of candidates"
            );
        }
        _ => panic!(),
    }
});
