import { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  description?: string;
}

/**
 * A form field wrapper with consistent label styling.
 * Optionally includes a description below the label.
 */
export function FormField({ label, children, description }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-[#6B7280] mb-3">{description}</p>
      )}
      {children}
    </div>
  );
}
