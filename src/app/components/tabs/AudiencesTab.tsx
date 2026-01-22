import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BrandGuideline } from '@/app/types';

interface AudiencesTabProps {
  data: BrandGuideline['audiences'];
}

export function AudiencesTab({ data }: AudiencesTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['primary', 'secondary'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Primary Audiences */}
      <Section
        title="Primary Audiences"
        expanded={expandedSections.has('primary')}
        onToggle={() => toggleSection('primary')}
      >
        <div className="space-y-4">
          <FormField label="Primary Target Segments">
            <p className="text-sm text-[#6B7280] mb-3">
              Who are the main people you're trying to reach?
            </p>
            {data.primary.map((audience, index) => (
              <div key={index} className="mb-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    defaultValue={audience}
                    placeholder="Audience segment name"
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Age range"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Income level"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Occupation"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <textarea
                  placeholder="Key characteristics, behaviors, and motivations..."
                  rows={2}
                  className="w-full mt-3 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Primary Audience
            </button>
          </FormField>
        </div>
      </Section>

      {/* Secondary Audiences */}
      <Section
        title="Secondary Audiences"
        expanded={expandedSections.has('secondary')}
        onToggle={() => toggleSection('secondary')}
      >
        <div className="space-y-4">
          <FormField label="Secondary Target Segments">
            <p className="text-sm text-[#6B7280] mb-3">
              Additional audiences that may benefit from your brand
            </p>
            {data.secondary.map((audience, index) => (
              <div key={index} className="mb-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    defaultValue={audience}
                    placeholder="Audience segment name"
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Age range"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Income level"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <input
                    type="text"
                    placeholder="Occupation"
                    className="px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <textarea
                  placeholder="Key characteristics, behaviors, and motivations..."
                  rows={2}
                  className="w-full mt-3 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Secondary Audience
            </button>
          </FormField>
        </div>
      </Section>

      {/* Persona Details */}
      <Section
        title="Detailed Personas"
        expanded={expandedSections.has('personas')}
        onToggle={() => toggleSection('personas')}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] mb-4">
            Create detailed buyer personas for your key audience segments
          </p>
          
          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">Persona Name</label>
              <input
                type="text"
                placeholder="e.g., 'Wellness-Focused Whitney'"
                className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">Background</label>
              <textarea
                placeholder="Brief biography and lifestyle description..."
                rows={3}
                className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">Goals & Motivations</label>
              <textarea
                placeholder="What are they trying to achieve?"
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">Pain Points</label>
              <textarea
                placeholder="What problems or challenges do they face?"
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">How We Help</label>
              <textarea
                placeholder="How does your brand solve their problems?"
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
          </div>

          <button className="mt-4 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Another Persona
          </button>
        </div>
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
      >
        <h3 className="text-base font-semibold text-[#374151] text-[16px]">{title}</h3>
        <FontAwesomeIcon
          icon={expanded ? faChevronDown : faChevronRight}
          className="w-4 h-4 text-[#6B7280]"
        />
      </button>
      {expanded && (
        <div className="px-6 pb-6 border-t border-[#E5E7EB] pt-4">{children}</div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-2">{label}</label>
      {children}
    </div>
  );
}