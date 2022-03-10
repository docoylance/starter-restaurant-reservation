import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  listTables,
  loadTable,
  seatReservation,
  loadReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import Form from "../form/Form";

/**
 * Defines the seat reservation form.
 * @returns {JSX.Element}
 */
function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [seatError, setSeatError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // loads the table options for the drop-down list
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const initialFormState = {
    table_id: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  // validates table option selected
  function validate(seat) {
    // initializes errors array
    const errors = [];

    // checks if table capacity can seat the number of people reserved
    async function isMore({ table_id }) {
      const abortController = new AbortController();
      try {
        const { capacity } = await loadTable(table_id, abortController.signal);
        const { people } = await loadReservation(
          reservation_id,
          abortController.signal
        );
        if (people > capacity)
          errors.push(
            new Error(
              "The number of people reserved exceeds the seating capacity of this table. Please select another table."
            )
          );
      } catch (err) {
        errors.push(err);
      }
      return () => abortController.abort();
    }

    // validates data
    isMore(seat);

    // returns errors array
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    // checks if table option selected has errors
    const formErrors = validate(formData);
    if (formErrors.length) {
      console.error(formErrors);
      return setSeatError(formErrors);
    }

    // seats reservation on selected table
    try {
      await seatReservation(reservation_id, Number(formData.table_id));
      history.push("/dashboard");
    } catch (err) {
      console.error(err);
      setSeatError(err);
    }
  }

  const handleCancel = () => {
    history.goBack();
  };

  /**
   * maps loaded tables into option values
   * initializes options data
   */
  const options = tables.map(({ table_id, table_name, capacity }) => [
    table_id,
    `${table_name} - ${capacity}`,
  ]);

  // initializes the input elements data
  const tableNumber = {
    type: "select",
    id: "table",
    name: "table_id",
    options: options,
    required: true,
  };

  const inputs = [tableNumber];

  return (
    <>
      <div className="d-flex flex-column">
        <h2>Seat Reservation</h2>
        <ErrorAlert error={tablesError} />
        <Form
          inputs={inputs}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
        <ErrorAlert error={seatError} />
      </div>
    </>
  );
}

export default SeatReservation;
