import InputForm from "./InputForm";
import SelectForm from "./SelectForm";

export default function Input({ inputs, formData, handleChange }) {
  const { type, id, name, min, minLength, options = null, required } = inputs;

  // checks if inputs prop has options prop
  let optionsList;
  if (options) {
    // maps options prop to option tags
    optionsList = options.map((option, index) => {
      const valueInput = option[0];
      const optionInput = option[1];
      return (
        <option key={index} value={valueInput}>
          {optionInput}
        </option>
      );
    });
  }

  return (
    <>
      <label htmlFor={id}>
        {id
          .split("_")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")}
      </label>
      {/* checks if form input element is a drop-down list or a text field */}
      {type === "select" ? (
        <SelectForm
          id={id}
          name={name}
          required={required}
          formData={formData}
          handleChange={handleChange}
          optionsList={optionsList}
        />
      ) : (
        <InputForm
          type={type}
          id={id}
          name={name}
          min={min}
          minLength={minLength}
          required={required}
          formData={formData}
          handleChange={handleChange}
        />
      )}
    </>
  );
}
