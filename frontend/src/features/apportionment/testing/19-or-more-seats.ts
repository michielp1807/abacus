import { Election, ElectionSummary, SeatAssignmentResult } from "@/api";

export const seat_assignment: SeatAssignmentResult = {
  seats: 23,
  full_seats: 19,
  residual_seats: 4,
  quota: {
    integer: 52,
    numerator: 4,
    denominator: 23,
  },
  steps: [
    {
      residual_seat_number: 1,
      change: {
        changed_by: "LargestAverageAssignment",
        selected_pg_number: 5,
        pg_options: [5],
        pg_assigned: [5],
        votes_per_seat: {
          integer: 50,
          numerator: 1,
          denominator: 2,
        },
      },
      standings: [
        {
          pg_number: 1,
          votes_cast: 600,
          remainder_votes: {
            integer: 26,
            numerator: 2,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 0,
            denominator: 12,
          },
          full_seats: 11,
          residual_seats: 0,
        },
        {
          pg_number: 2,
          votes_cast: 302,
          remainder_votes: {
            integer: 41,
            numerator: 3,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 2,
            denominator: 6,
          },
          full_seats: 5,
          residual_seats: 0,
        },
        {
          pg_number: 3,
          votes_cast: 98,
          remainder_votes: {
            integer: 45,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 0,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 4,
          votes_cast: 99,
          remainder_votes: {
            integer: 46,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 1,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 5,
          votes_cast: 101,
          remainder_votes: {
            integer: 48,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 1,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
      ],
    },
    {
      residual_seat_number: 2,
      change: {
        changed_by: "LargestAverageAssignment",
        selected_pg_number: 2,
        pg_options: [2],
        pg_assigned: [2],
        votes_per_seat: {
          integer: 50,
          numerator: 2,
          denominator: 6,
        },
      },
      standings: [
        {
          pg_number: 1,
          votes_cast: 600,
          remainder_votes: {
            integer: 26,
            numerator: 2,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 0,
            denominator: 12,
          },
          full_seats: 11,
          residual_seats: 0,
        },
        {
          pg_number: 2,
          votes_cast: 302,
          remainder_votes: {
            integer: 41,
            numerator: 3,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 2,
            denominator: 6,
          },
          full_seats: 5,
          residual_seats: 0,
        },
        {
          pg_number: 3,
          votes_cast: 98,
          remainder_votes: {
            integer: 45,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 0,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 4,
          votes_cast: 99,
          remainder_votes: {
            integer: 46,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 1,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 5,
          votes_cast: 101,
          remainder_votes: {
            integer: 48,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 33,
            numerator: 2,
            denominator: 3,
          },
          full_seats: 1,
          residual_seats: 1,
        },
      ],
    },
    {
      residual_seat_number: 3,
      change: {
        changed_by: "LargestAverageAssignment",
        selected_pg_number: 1,
        pg_options: [1],
        pg_assigned: [1],
        votes_per_seat: {
          integer: 50,
          numerator: 0,
          denominator: 12,
        },
      },
      standings: [
        {
          pg_number: 1,
          votes_cast: 600,
          remainder_votes: {
            integer: 26,
            numerator: 2,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 50,
            numerator: 0,
            denominator: 12,
          },
          full_seats: 11,
          residual_seats: 0,
        },
        {
          pg_number: 2,
          votes_cast: 302,
          remainder_votes: {
            integer: 41,
            numerator: 3,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 43,
            numerator: 1,
            denominator: 7,
          },
          full_seats: 5,
          residual_seats: 1,
        },
        {
          pg_number: 3,
          votes_cast: 98,
          remainder_votes: {
            integer: 45,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 0,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 4,
          votes_cast: 99,
          remainder_votes: {
            integer: 46,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 1,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 5,
          votes_cast: 101,
          remainder_votes: {
            integer: 48,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 33,
            numerator: 2,
            denominator: 3,
          },
          full_seats: 1,
          residual_seats: 1,
        },
      ],
    },
    {
      residual_seat_number: 4,
      change: {
        changed_by: "LargestAverageAssignment",
        selected_pg_number: 4,
        pg_options: [4],
        pg_assigned: [4],
        votes_per_seat: {
          integer: 49,
          numerator: 1,
          denominator: 2,
        },
      },
      standings: [
        {
          pg_number: 1,
          votes_cast: 600,
          remainder_votes: {
            integer: 26,
            numerator: 2,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 46,
            numerator: 2,
            denominator: 13,
          },
          full_seats: 11,
          residual_seats: 1,
        },
        {
          pg_number: 2,
          votes_cast: 302,
          remainder_votes: {
            integer: 41,
            numerator: 3,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 43,
            numerator: 1,
            denominator: 7,
          },
          full_seats: 5,
          residual_seats: 1,
        },
        {
          pg_number: 3,
          votes_cast: 98,
          remainder_votes: {
            integer: 45,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 0,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 4,
          votes_cast: 99,
          remainder_votes: {
            integer: 46,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 49,
            numerator: 1,
            denominator: 2,
          },
          full_seats: 1,
          residual_seats: 0,
        },
        {
          pg_number: 5,
          votes_cast: 101,
          remainder_votes: {
            integer: 48,
            numerator: 19,
            denominator: 23,
          },
          meets_remainder_threshold: true,
          next_votes_per_seat: {
            integer: 33,
            numerator: 2,
            denominator: 3,
          },
          full_seats: 1,
          residual_seats: 1,
        },
      ],
    },
  ],
  final_standing: [
    {
      pg_number: 1,
      votes_cast: 600,
      remainder_votes: {
        integer: 26,
        numerator: 2,
        denominator: 23,
      },
      meets_remainder_threshold: true,
      full_seats: 11,
      residual_seats: 1,
      total_seats: 12,
    },
    {
      pg_number: 2,
      votes_cast: 302,
      remainder_votes: {
        integer: 41,
        numerator: 3,
        denominator: 23,
      },
      meets_remainder_threshold: true,
      full_seats: 5,
      residual_seats: 1,
      total_seats: 6,
    },
    {
      pg_number: 3,
      votes_cast: 98,
      remainder_votes: {
        integer: 45,
        numerator: 19,
        denominator: 23,
      },
      meets_remainder_threshold: true,
      full_seats: 1,
      residual_seats: 0,
      total_seats: 1,
    },
    {
      pg_number: 4,
      votes_cast: 99,
      remainder_votes: {
        integer: 46,
        numerator: 19,
        denominator: 23,
      },
      meets_remainder_threshold: true,
      full_seats: 1,
      residual_seats: 1,
      total_seats: 2,
    },
    {
      pg_number: 5,
      votes_cast: 101,
      remainder_votes: {
        integer: 48,
        numerator: 19,
        denominator: 23,
      },
      meets_remainder_threshold: true,
      full_seats: 1,
      residual_seats: 1,
      total_seats: 2,
    },
  ],
};

export const election_summary: ElectionSummary = {
  voters_counts: {
    poll_card_count: 1200,
    proxy_certificate_count: 2,
    voter_card_count: 3,
    total_admitted_voters_count: 1205,
  },
  votes_counts: {
    votes_candidates_count: 1200,
    blank_votes_count: 2,
    invalid_votes_count: 3,
    total_votes_cast_count: 1205,
  },
  differences_counts: {
    more_ballots_count: {
      count: 0,
      polling_stations: [],
    },
    fewer_ballots_count: {
      count: 0,
      polling_stations: [],
    },
    unreturned_ballots_count: {
      count: 0,
      polling_stations: [],
    },
    too_few_ballots_handed_out_count: {
      count: 0,
      polling_stations: [],
    },
    too_many_ballots_handed_out_count: {
      count: 0,
      polling_stations: [],
    },
    other_explanation_count: {
      count: 0,
      polling_stations: [],
    },
    no_explanation_count: {
      count: 0,
      polling_stations: [],
    },
  },
  recounted_polling_stations: [],
  political_group_votes: [
    {
      number: 1,
      total: 600,
      candidate_votes: [
        {
          number: 1,
          votes: 78,
        },
        {
          number: 2,
          votes: 20,
        },
        {
          number: 3,
          votes: 55,
        },
        {
          number: 4,
          votes: 45,
        },
        {
          number: 5,
          votes: 50,
        },
        {
          number: 6,
          votes: 0,
        },
        {
          number: 7,
          votes: 60,
        },
        {
          number: 8,
          votes: 40,
        },
        {
          number: 9,
          votes: 30,
        },
        {
          number: 10,
          votes: 20,
        },
        {
          number: 11,
          votes: 50,
        },
        {
          number: 12,
          votes: 152,
        },
      ],
    },
    {
      number: 2,
      total: 302,
      candidate_votes: [
        {
          number: 1,
          votes: 150,
        },
        {
          number: 2,
          votes: 50,
        },
        {
          number: 3,
          votes: 22,
        },
        {
          number: 4,
          votes: 10,
        },
        {
          number: 5,
          votes: 30,
        },
        {
          number: 6,
          votes: 40,
        },
      ],
    },
    {
      number: 3,
      total: 98,
      candidate_votes: [
        {
          number: 1,
          votes: 20,
        },
        {
          number: 2,
          votes: 15,
        },
        {
          number: 3,
          votes: 25,
        },
        {
          number: 4,
          votes: 3,
        },
        {
          number: 5,
          votes: 2,
        },
        {
          number: 6,
          votes: 33,
        },
      ],
    },
    {
      number: 4,
      total: 99,
      candidate_votes: [
        {
          number: 1,
          votes: 20,
        },
        {
          number: 2,
          votes: 15,
        },
        {
          number: 3,
          votes: 25,
        },
        {
          number: 4,
          votes: 24,
        },
        {
          number: 5,
          votes: 15,
        },
      ],
    },
    {
      number: 5,
      total: 101,
      candidate_votes: [
        {
          number: 1,
          votes: 20,
        },
        {
          number: 2,
          votes: 31,
        },
        {
          number: 3,
          votes: 10,
        },
        {
          number: 4,
          votes: 40,
        },
      ],
    },
  ],
};

export const election: Election = {
  id: 2,
  name: "Test Election >= 19 seats",
  location: "Test Location",
  number_of_voters: 2000,
  category: "Municipal",
  number_of_seats: 23,
  election_date: "2026-03-18",
  nomination_date: "2026-02-02",
  status: "DataEntryFinished",
  political_groups: [
    {
      number: 1,
      name: "Political Group A",
      candidates: [
        {
          number: 1,
          initials: "L.",
          first_name: "Lidewij",
          last_name: "Oud",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 2,
          initials: "J.",
          first_name: "Johan",
          last_name: "Oud",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 3,
          initials: "M.",
          first_name: "Marijke",
          last_name: "Oud",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 4,
          initials: "A.",
          first_name: "Arie",
          last_name: "Jansen",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 5,
          initials: "H.",
          first_name: "Henk",
          last_name: "Van der Weijden",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 6,
          initials: "B.",
          first_name: "Berta",
          last_name: "Van der Weijden",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 7,
          initials: "K.",
          first_name: "Klaas",
          last_name: "Oud",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 8,
          initials: "S.",
          first_name: "Sophie",
          last_name: "Bakker",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 9,
          initials: "J.",
          first_name: "Johan",
          last_name: "De Vries",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 10,
          initials: "M.",
          first_name: "Marijke",
          last_name: "Van den Berg",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 11,
          initials: "R.",
          first_name: "Rolf",
          last_name: "De Jong",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 12,
          initials: "K.",
          first_name: "Karin",
          last_name: "Kok",
          locality: "Test Location",
          gender: "Female",
        },
      ],
    },
    {
      number: 2,
      name: "Political Group B",
      candidates: [
        {
          number: 1,
          initials: "T.",
          first_name: "Tinus",
          last_name: "Bakker",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 2,
          initials: "D.",
          first_name: "Drs.",
          last_name: "P.",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 3,
          initials: "W.",
          first_name: "Willem",
          last_name: "de Vries",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 4,
          initials: "K.",
          first_name: "Klaas",
          last_name: "Kloosterboer",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 5,
          initials: "L.",
          first_name: "Liesbeth",
          last_name: "Jansen",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 6,
          initials: "H.",
          first_name: "Henk",
          last_name: "Van den Berg",
          locality: "Test Location",
          gender: "Male",
        },
      ],
    },
    {
      number: 3,
      name: "Political Group C",
      candidates: [
        {
          number: 1,
          initials: "A.",
          first_name: "Adelbert",
          last_name: "Van Doorn",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 2,
          initials: "M.",
          first_name: "Margriet",
          last_name: "Van der Linden",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 3,
          initials: "P.",
          first_name: "Paul",
          last_name: "Veldkamp",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 4,
          initials: "S.",
          first_name: "Sophie",
          last_name: "De Groot",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 5,
          initials: "R.",
          first_name: "Rik",
          last_name: "De Ruiter",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 6,
          initials: "N.",
          first_name: "Nico",
          last_name: "Ruiter",
          locality: "Test Location",
          gender: "Male",
        },
      ],
    },
    {
      number: 4,
      name: "Political Group D",
      candidates: [
        {
          number: 1,
          initials: "G.",
          first_name: "Gerard",
          last_name: "Bogaert",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 2,
          initials: "J.",
          first_name: "Jan",
          last_name: "Stevens",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 3,
          initials: "E.",
          first_name: "Els",
          last_name: "Groot",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 4,
          initials: "B.",
          first_name: "Bart",
          last_name: "Smit",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 5,
          initials: "F.",
          first_name: "Frits",
          last_name: "Veldman",
          locality: "Test Location",
          gender: "Male",
        },
      ],
    },
    {
      number: 5,
      name: "Political Group E",
      candidates: [
        {
          number: 1,
          initials: "G.",
          first_name: "Gert",
          last_name: "Smit",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 2,
          initials: "E.",
          first_name: "Eva",
          last_name: "Koster",
          locality: "Test Location",
          gender: "Female",
        },
        {
          number: 3,
          initials: "L.",
          first_name: "Leon",
          last_name: "Hofman",
          locality: "Test Location",
          gender: "Male",
        },
        {
          number: 4,
          initials: "S.",
          first_name: "Sophie",
          last_name: "Visser",
          locality: "Test Location",
          gender: "Female",
        },
      ],
    },
  ],
};
