#![no_main]

use abacus::apportionment::{seat_allocation, ApportionmentError};
use abacus_fuzz::FuzzedElectionSummary;
use libfuzzer_sys::fuzz_target;
use pyo3::ffi::c_str;
use pyo3::prelude::*;

fn python_seat_allocation(seats: u64, votes: Vec<u32>) -> PyResult<Vec<u64>> {
    Python::with_gil(|py| {
        let code = c_str!(include_str!("../apportionment.py"));
        let module = PyModule::from_code(
            py,
            code,
            c_str!("apportionment.py"),
            c_str!("apportionment"),
        )?;

        module.getattr("allocate")?.call1((seats, votes))?.extract()
    })
}

fuzz_target!(|data: FuzzedElectionSummary| {
    match seat_allocation(data.seats, &data.election_summary) {
        Ok(alloc) => {
            let seats = alloc.get_total_seats();
            let py_seats = python_seat_allocation(data.seats, data.votes).unwrap();

            assert!(
                seats.iter().eq(py_seats.iter()),
                "Python implementation did not produce the same results:\nPython: {:?}\nAbacus: {:?}",
                py_seats,
                seats
            );
        }
        Err(ApportionmentError::DrawingOfLotsNotImplemented) => {} // ignore
    }
});
