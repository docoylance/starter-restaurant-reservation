/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

// RESERVATIONS
// sends an API call to list reservations
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// sends an API call to list the reservations with the queried mobile number
export async function listQueryNumber(mobile_number, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`
  );
  return await fetchJson(url, { headers, signal }, []);
}

// sends an API call to create a reservation
export async function createReservation(reservation, signal) {
  reservation.people = parseInt(reservation.people);
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

// sends an API call to read a reservation
export async function loadReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

// sends an API call to update a reservation
export async function updateReservation(reservation, reservation_id, signal) {
  reservation.people = parseInt(reservation.people);
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

// sends an API call to cancel a reservation
export async function cancelReservation(reservation_id) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { status: "cancelled" } }),
    headers,
  };
  return await fetchJson(url, options, {});
}

// TABLES

// sends an API call to list tables
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

// sends an API call to create a table
export async function createTable(table, signal) {
  table.capacity = parseInt(table.capacity);
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, table);
}

// sends an API call to read a table
export async function loadTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * sends an API call
 * to update the reservation status to seated
 * to assign a reservation to a table
 */
export async function seatReservation(reservation_id, table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson(url, options, {});
}

/**
 * sends an API call to
 * to update the reservation status to finished
 * to remove a reservation from a table
 */
export async function finishReservation(reservation_id, table_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson(url, options, {});
}
