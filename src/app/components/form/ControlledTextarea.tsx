import { useState, useEffect } from 'react';

export interface ControlledTextareaProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
}

/**
 * A controlled textarea that syncs with external value changes and saves on blur.
 * This prevents excessive database writes during typing while keeping the textarea
 * in sync with external state (e.g., when viewing different versions).
 */
export function ControlledTextarea({
  value,
  onSave,
  readOnly = false,
  placeholder,
  className,
  rows = 3,
}: ControlledTextareaProps) {
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
    <textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      rows={rows}
      readOnly={readOnly}
    />
  );
}
