import React, { useState } from "react";
import { useHistory } from "react-router";
import { finishReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TablesTable({ tables, error }) {
  const history = useHistory();
  const [finishError, setFinishError] = useState(null);

  async function handleClick(reservation_id, table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishReservation(reservation_id, table_id);
        history.go(0);
      } catch (err) {
        console.error(err);
        setFinishError(err);
      }
    }
  }

  // sets initial tables list to empty
  let tablesList = <p className="mt-3 not-found">No tables found.</p>;

  // maps tables list to rows of tables
  if (tables.length)
    tablesList = tables.map(
      ({ table_id, table_name, capacity, reservation_id }, index) => (
        <div key={index} className="card mt-3">
          <div className="card-header">#{table_id}</div>
          <div className="card-body">
            <div className="d-flex justify-content-between text-secondary">
              <h4 className="h3">Table {table_name}</h4>
              <p className="h5 font-weight-normal">
                {capacity} seat{capacity > 1 && "s"}
              </p>
            </div>
            {reservation_id && (
              <div className="d-flex justify-content-end">
                <button
                  className="btn special-button"
                  data-table-id-finish={table_id}
                  onClick={() => handleClick(reservation_id, table_id)}
                >
                  Finish
                </button>
                <ErrorAlert error={finishError} />
              </div>
            )}
          </div>
          <div className="card-footer" data-table-id-status={table_id}>
            {!reservation_id ? "Free" : "Occupied"}
          </div>
        </div>
      )
    );

  return (
    <div>
      <h3 className="mt-3 py-3 div-border">Tables</h3>
      <ErrorAlert error={error} />
      {!error && tablesList}
    </div>
  );
}
