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
  let tablesList = (
    <tr>
      <td colSpan={6}>No tables found.</td>
    </tr>
  );

  // maps tables list to rows of tables
  if (tables.length)
    tablesList = tables.map(
      ({ table_id, table_name, capacity, reservation_id }, index) => (
        <tr key={index}>
          <td>{table_id}</td>
          <td>{table_name}</td>
          <td>{capacity}</td>
          <td data-table-id-status={table_id}>
            {reservation_id ? "Occupied" : "Free"}
          </td>
          <td>
            {reservation_id && (
              <>
                <button
                  className="btn btn-primary mr-2"
                  data-table-id-finish={table_id}
                  onClick={() => handleClick(reservation_id, table_id)}
                >
                  Finish
                </button>
                <ErrorAlert error={finishError} />
              </>
            )}
          </td>
        </tr>
      )
    );

  return (
    <div>
      <h4 className="mb-0">Tables</h4>
      <ErrorAlert error={error} />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{tablesList}</tbody>
      </table>
    </div>
  );
}
