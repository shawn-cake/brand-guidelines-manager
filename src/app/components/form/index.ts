// Shared form components
export { ControlledInput, type ControlledInputProps } from './ControlledInput';
export { ControlledTextarea, type ControlledTextareaProps } from './ControlledTextarea';
export { ControlledSelect, type ControlledSelectProps } from './ControlledSelect';
export { Section, type SectionProps } from './Section';
export { FormField, type FormFieldProps } from './FormField';

// Common input class for consistent styling
export const inputClass =
  'w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]';

export const inputSmClass =
  'px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]';
