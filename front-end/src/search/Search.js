import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listQueryNumber } from "../utils/api";
import useQuery from "../utils/useQuery";

import InputForm from "../form/InputForm";
import ReservationsTable from "../dashboard/ReservationsTable";

/**
 * Defines the search page.
 * @returns {JSX.Element}
 */
function Search() {
  const history = useHistory();
  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const mobile_number = query.get("mobile_number");

  // loads the reservations with the queried mobile number
  useEffect(() => {
    async function loadReservations() {
      setReservations(null);
      setReservationsError(null);
      if (mobile_number) {
        const abortController = new AbortController();
        try {
          const data = await listQueryNumber(
            mobile_number,
            abortController.signal
          );
          if (!data.length)
            setReservationsError(new Error("No reservations found."));
          setReservations(data);
        } catch (err) {
          console.error(err);
          setReservationsError(err);
        }
        return () => abortController.abort();
      }
    }
    loadReservations();
  }, [mobile_number]);

  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    // reloads the page with the submitted mobile number as a query param
    history.push(`/search?mobile_number=${formData.mobile_number}`);
  }

  return (
    <>
      <div className="d-flex flex-column">
        <h2>Search</h2>
        <form className="d-flex flex-column h5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mobile_number">Mobile Number</label>
            <InputForm
              type="text"
              id="mobile_number"
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              formData={formData}
              handleChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-primary mr-2" type="submit">
              Find
            </button>
          </div>
          <div>
            {/* checks if reservations were loaded */}
            {reservations && (
              <ReservationsTable
                reservations={reservations}
                error={reservationsError}
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default Search;
