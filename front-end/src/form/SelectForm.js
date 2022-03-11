/**
 * Defines the select component.
 * @returns {JSX.Element}
 */
export default function SelectForm({
  id,
  name,
  required = false,
  formData,
  handleChange,
  optionsList,
}) {
  return (
    <select
      id={id}
      name={name}
      className="mb-3 form-control"
      size={1}
      required={required}
      onChange={handleChange}
      value={formData[name]}
    >
      <option value="" className="text-center">-- Select a {id.split("_").join(" ")} --</option>
      {optionsList}
    </select>
  );
}
