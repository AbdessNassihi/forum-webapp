



const FormComponent = ({
    type = "text",
    name,
    value,
    onChange,
    error,
    success,
    isTextarea = false,
    isSelect = false,
    options = [],
    placeholder = "",
    disabled = false
}) => {
    return (
        <div className="col-12 mb-3">
            {isTextarea ? (
                <textarea
                    className={`form-control ${error ? 'is-invalid' : success ? 'is-valid' : ''}`}
                    id={`validationServer${name}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={disabled}
                    rows="4"
                />
            ) : isSelect ? (
                <select
                    className={`form-control ${error ? 'is-invalid' : success ? 'is-valid' : ''}`}
                    id={`validationServer${name}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                >
                    <option value="">Choose from followed or created threads</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className={`form-control ${error ? 'is-invalid' : success ? 'is-valid' : ''}`}
                    id={`validationServer${name}`}
                    name={name}
                    value={type !== "file" ? value : undefined}
                    onChange={onChange}
                    placeholder={placeholder}  // Add placeholder for text input
                    disabled={disabled}
                    readOnly={disabled}
                />
            )}
            {error && <div className="invalid-feedback">{error}</div>}
            {success && !error && <div className="valid-feedback">{success}</div>}
        </div>
    );
};

export default FormComponent;
