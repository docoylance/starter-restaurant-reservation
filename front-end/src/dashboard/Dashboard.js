import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

import ReservationsTable from "./ReservationsTable";
import TablesTable from "./TablesTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const query = useQuery();
  const newDate = query.get("date");
  if (newDate) date = newDate;

  // loads dashboard page
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // loads reservations component
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setReservationsError(null);
    // loads tables component
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  // handlers for reservations navigation
  const handlePrevious = () => {
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const handleToday = () => {
    history.push(`/dashboard?date=${today()}`);
  };

  const handleNext = () => {
    history.push(`/dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h2>DASHBOARD</h2>
      <div className="row">
        <div className="container d-flex flex-column mb-3 col-md-6 col-lg-6 col-sm-12">
          <div className="d-flex flex-column mt-3 div-border">
            <h3 className="m-0 py-3 res-top-border">Reservations for {date}</h3>
            <div className="btn-group res-bot-border" role="group">
              <button className="btn dark-pink" onClick={handlePrevious}>
                Previous
              </button>
              <button className="btn today-button light-pink" onClick={handleToday}>
                Today
              </button>
              <button className="btn dark-pink" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
          <ReservationsTable
            reservations={reservations}
            error={reservationsError}
          />
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12 mb-3">
          <TablesTable tables={tables} error={tablesError} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
