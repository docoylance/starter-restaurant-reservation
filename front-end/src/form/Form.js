import Input from "./Input";

/**
 * Defines the form component.
 * @prop inputs
 *  the input elements data of a form.
 * @returns {JSX.Element}
 */
export default function Form({
  inputs,
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
}) {
  // maps passed-in inputs prop to input elements
  const inputList = inputs.map((input, key) => (
    <Input
      key={key}
      inputs={input}
      formData={formData}
      handleChange={handleChange}
    />
  ));
  return (
    <form className="d-flex flex-column h5" onSubmit={handleSubmit}>
      <div>{inputList}</div>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn submit-button mr-2" type="submit">
          Submit
        </button>
        <button
          className="btn cancel-button"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
