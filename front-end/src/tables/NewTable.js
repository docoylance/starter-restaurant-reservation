import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

import Form from "../form/Form";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the table form.
 * @returns {JSX.Element}
 */
function NewTable() {
  const history = useHistory();
  const [createError, setCreateError] = useState(null);
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const abortController = new AbortController();

    // creates table
    try {
      await createTable(formData, abortController.signal);
      history.push("/dashboard");
    } catch (err) {
      console.error(err);
      setCreateError(err);
    }
    return () => abortController.abort();
  }

  const handleCancel = () => {
    history.goBack();
  };

  // initializes the input elements data
  const tableName = {
    type: "text",
    id: "table_name",
    name: "table_name",
    minLength: "2",
    required: true,
  };
  const capacity = {
    type: "number",
    id: "capacity",
    name: "capacity",
    min: "1",
    required: true,
  };

  const inputs = [tableName, capacity];

  return (
    <>
      <div className="d-flex flex-column">
        <h2>Create New Table</h2>
        <ErrorAlert error={createError} />
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

export default NewTable;
