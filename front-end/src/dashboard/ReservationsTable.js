import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationsTable({ reservations, error }) {
  const history = useHistory();
  const [cancelError, setCancelError] = useState(null);

  async function handleCancel(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservation_id);
        history.go(0);
      } catch (err) {
        console.error(err);
        setCancelError(err);
      }
    }
  }

  // sets initial reservations list to empty
  let reservationsList = <p className="mt-3 not-found">No reservations found.</p>;

  // maps reservations list to rows of reservations
  if (reservations.length)
    reservationsList = formatReservationDate(
      formatReservationTime(reservations)
    ).map(
      (
        {
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people,
          status,
        },
        index
      ) => (
        <div key={index} className="card mt-3">
          <div className="card-header">#{reservation_id}</div>
          <div className="card-body">
            <div className="d-flex justify-content-between text-secondary">
              <h4 className="h3">
                {last_name}, {first_name}
              </h4>
              <p className="h5 font-weight-normal">
                {people} person{people > 1 && "s"}
              </p>
            </div>
            <div className="text-secondary mt-0">
              <p className="h6 font-weight-normal">{mobile_number}</p>
              <p className="h5 font-weight-normal">
                {reservation_date}, {reservation_time}
              </p>
            </div>
            <div className="d-flex">
              {status === "booked" && (
                <>
                  <a
                    href={`/reservations/${reservation_id}/edit`}
                    className="btn normal-button mr-2"
                  >
                    Edit
                  </a>
                  <a
                    href={`/reservations/${reservation_id}/seat`}
                    className="btn normal-button mr-2"
                  >
                    Seat
                  </a>
                </>
              )}
              <button
                data-reservation-id-cancel={reservation_id}
                className="btn special-button ml-auto"
                onClick={() => handleCancel(reservation_id)}
              >
                Cancel
              </button>
              <ErrorAlert error={cancelError} />
            </div>
          </div>
          <div
            className="card-footer"
            data-reservation-id-status={reservation_id}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </div>
        </div>
      )
    );

  return (
    <div className="mb-3">
      <ErrorAlert error={error} />
      {!error && reservationsList}
    </div>
  );
}
