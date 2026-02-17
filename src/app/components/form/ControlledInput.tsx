import { useState, useEffect } from 'react';

export interface ControlledInputProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  type?: string;
}

/**
 * A controlled input that syncs with external value changes and saves on blur.
 * This prevents excessive database writes during typing while keeping the input
 * in sync with external state (e.g., when viewing different versions).
 */
export function ControlledInput({
  value,
  onSave,
  readOnly = false,
  placeholder,
  className,
  type = 'text',
}: ControlledInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when external value changes (e.g., version switch)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (!readOnly && localValue !== value) {
      onSave(localValue);
    }
  };

  return (
    <input
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      readOnly={readOnly}
    />
  );
}
