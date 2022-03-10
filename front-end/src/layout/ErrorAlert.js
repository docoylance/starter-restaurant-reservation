import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  // checks if error prop is an array
  if (Array.isArray(error))
    // maps the error prop into a list of errors
    return (
      error && (
        <div className="alert alert-danger m-2">
          Error:{" "}
          <ul>
            {error.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    );

  return (
    error && (
      <div className="alert alert-danger m-2">Error: {error.message}</div>
    )
  );
}

export default ErrorAlert;
