import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  loadReservation,
  createReservation,
  updateReservation,
} from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import Form from "../form/Form";

/**
 * Defines the reservation form.
 * @param type
 * the type of reservation form.
 * @returns {JSX.Element}
 */
function Reservation({ type = "create" }) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const params = useParams();
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  /**
   * checks if reservation form is an edit form
   * loads current reservation data on the input fields
   */
  useEffect(loadInitialFormState, [params.reservation_id, type]);

  function loadInitialFormState() {
    if (type === "update") {
      const abortController = new AbortController();
      loadReservation(params.reservation_id, abortController.signal).then(
        (data) => {
          setFormData({
            ...data,
            reservation_date: formatAsDate(data.reservation_date),
            reservation_time: formatAsTime(data.reservation_time),
          });
        }
      );
      return () => abortController.abort();
    }
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  // validates reservation data submitted
  function validate(reservation) {
    // initializes errors array
    const errors = [];

    // checks if reservation date and time submitted is in the future
    function isFutureDate({ reservation_date, reservation_time }) {
      const resDate = new Date(`${reservation_date}T${reservation_time}`);
      if (resDate < new Date())
        errors.push(
          new Error(
            "Reservation must be set in the future. Please select another date or time."
          )
        );
    }

    // checks if reservation day is set on Tuesday
    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2)
        errors.push(
          new Error(
            "The restaurant is closed on Tuesdays. Please select another day."
          )
        );
    }

    // checks if reservation is set during business hours
    function isBusinessHours({ reservation_time }) {
      const hour = parseInt(reservation_time.split(":")[0]);
      const mins = parseInt(reservation_time.split(":")[1]);

      if (hour <= 10 && mins <= 30)
        errors.push(
          new Error(
            "The restaurant opens at 10:30 AM. Please select another time."
          )
        );

      if (hour >= 22 || (hour === 21 && mins >= 30))
        errors.push(
          new Error(
            "The restaurant closes at 10:30 PM. Please select a time before 9:30 PM."
          )
        );
    }

    // checks if reservation is booked
    function isNotBooked({ status }) {
      if (status !== "booked")
        errors.push(new Error("Only booked reservations can be edited."));
    }

    // validates data
    isFutureDate(reservation);
    isTuesday(reservation);
    isBusinessHours(reservation);
    if (type === "update") isNotBooked(reservation);

    // returns errors array
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const abortController = new AbortController();

    // checks if reservation data submitted has errors
    const formErrors = validate(formData);
    if (formErrors.length) {
      console.error(formErrors);
      return setReservationsError(formErrors);
    }

    try {
      // initializes data variable
      let data;
      // checks if reservation form is for creating or editing
      if (type === "create") {
        // creates reservation
        data = await createReservation(formData, abortController.signal);
      } else if (type === "update") {
        // removes certain keys from reservation data that were loaded in
        delete formData["reservation_id"];
        delete formData["created_at"];
        delete formData["updated_at"];

        // updates reservation
        data = await updateReservation(
          formData,
          params.reservation_id,
          abortController.signal
        );
      }
      const url = `/dashboard?date=${formatAsDate(data.reservation_date)}`;
      history.push(url);
    } catch (err) {
      console.error(err);
      setReservationsError(err);
    }
    return () => abortController.abort();
  }

  const handleCancel = () => {
    history.goBack();
  };

  // initializes the input elements data
  const firstName = {
    type: "text",
    id: "first_name",
    name: "first_name",
    required: true,
  };
  const lastName = {
    type: "text",
    id: "last_name",
    name: "last_name",
    required: true,
  };
  const mobileNumber = {
    type: "text",
    id: "phone_number",
    name: "mobile_number",
    required: true,
  };
  const reservationDate = {
    type: "date",
    id: "date",
    name: "reservation_date",
    required: true,
  };
  const reservationTime = {
    type: "time",
    id: "time",
    name: "reservation_time",
    required: true,
  };
  const people = {
    type: "number",
    id: "number_of_people",
    name: "people",
    min: "1",
    required: true,
  };

  const inputs = [
    firstName,
    lastName,
    mobileNumber,
    reservationDate,
    reservationTime,
    people,
  ];

  return (
    <>
      <div className="d-flex flex-column">
        <ErrorAlert error={reservationsError} />
        <h2>
          {type === "create" ? "CREATE NEW RESERVATION" : "EDIT RESERVATION"}
        </h2>
        <Form
          inputs={inputs}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </>
  );
}

export default Reservation;
