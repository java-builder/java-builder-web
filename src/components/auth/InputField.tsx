import { forwardRef } from "react";

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      type,
      label,
      placeholder,
      autoComplete,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
                    w-full px-4 py-3 border border-gray-300 rounded-lg 
                    placeholder-gray-400 text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${className}
                `
            .trim()
            .replace(/\s+/g, " ")}
          placeholder={placeholder || label}
          {...props}
        />
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
