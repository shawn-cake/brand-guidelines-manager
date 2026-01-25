import { ReactNode, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * A collapsible section component used in form tabs.
 * Supports ref forwarding for Table of Contents integration.
 */
export function Section({
  title,
  expanded,
  onToggle,
  children,
  sectionRef,
}: SectionProps) {
  return (
    <div
      ref={sectionRef}
      className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden scroll-mt-8"
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
        aria-expanded={expanded}
      >
        <h3 className="text-lg font-semibold text-[#374151]">{title}</h3>
        <FontAwesomeIcon
          icon={expanded ? faChevronDown : faChevronRight}
          className="w-4 h-4 text-[#6B7280]"
        />
      </button>
      {expanded && (
        <div className="px-4 pb-6 border-t border-[#E5E7EB] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
