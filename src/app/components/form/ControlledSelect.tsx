import { useState, useEffect, ReactNode } from 'react';

export interface ControlledSelectProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A controlled select that syncs with external value changes and saves on change.
 * Unlike inputs, selects save immediately on change since there's no typing involved.
 */
export function ControlledSelect({
  value,
  onSave,
  readOnly = false,
  className,
  children,
}: ControlledSelectProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when external value changes (e.g., version switch)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!readOnly) {
      onSave(newValue);
    }
  };

  return (
    <select
      value={localValue}
      onChange={handleChange}
      className={className}
      disabled={readOnly}
    >
      {children}
    </select>
  );
}
