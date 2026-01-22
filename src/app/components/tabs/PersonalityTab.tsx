import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BrandGuideline } from '@/app/types';

interface PersonalityTabProps {
  data: BrandGuideline['personality'];
}

export function PersonalityTab({ data }: PersonalityTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['traits', 'voice'])
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

  const archetypes = [
    { value: '', label: 'Select a brand archetype...' },
    { value: 'hero', label: 'The Hero', description: 'Courageous, bold, inspirational — proves worth through brave acts' },
    { value: 'sage', label: 'The Sage', description: 'Wise, knowledgeable, thoughtful — seeks truth and shares wisdom' },
    { value: 'explorer', label: 'The Explorer', description: 'Independent, adventurous, pioneering — finds fulfillment through discovery' },
    { value: 'innocent', label: 'The Innocent', description: 'Pure, optimistic, simple — seeks happiness and spreads positivity' },
    { value: 'creator', label: 'The Creator', description: 'Innovative, imaginative, artistic — creates enduring value and meaning' },
    { value: 'ruler', label: 'The Ruler', description: 'Authoritative, organized, responsible — creates order and structure' },
    { value: 'caregiver', label: 'The Caregiver', description: 'Compassionate, nurturing, generous — protects and cares for others' },
    { value: 'magician', label: 'The Magician', description: 'Visionary, charismatic, transformative — makes dreams come true' },
    { value: 'lover', label: 'The Lover', description: 'Passionate, intimate, appreciative — creates intimacy and inspiration' },
    { value: 'jester', label: 'The Jester', description: 'Playful, humorous, irreverent — brings joy and lives in the moment' },
    { value: 'everyman', label: 'The Everyman', description: 'Friendly, humble, relatable — connects with solid virtues and common touch' },
    { value: 'rebel', label: 'The Rebel', description: 'Revolutionary, disruptive, liberating — breaks rules and challenges the status quo' },
  ];

  return (
    <div className="space-y-4">
      {/* Brand Personality Traits */}
      <Section
        title="Brand Personality Traits"
        expanded={expandedSections.has('traits')}
        onToggle={() => toggleSection('traits')}
      >
        <div className="space-y-4">
          <FormField label="Personality Traits">
            <p className="text-sm text-[#6B7280] mb-3">
              Select 4-6 adjectives that describe your brand's personality
            </p>
            {data.traits.map((trait, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={trait}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Trait
            </button>
          </FormField>

          <FormField label="Brand Archetype">
            <select className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]">
              {archetypes.map((archetype) => (
                <option key={archetype.value} value={archetype.value}>
                  {archetype.label}
                  {archetype.description && ` — ${archetype.description}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#6B7280] mt-2">
              Archetypes help define your brand's fundamental character and purpose
            </p>
          </FormField>
        </div>
      </Section>

      {/* Voice & Tone */}
      <Section
        title="Voice & Tone"
        expanded={expandedSections.has('voice')}
        onToggle={() => toggleSection('voice')}
      >
        <div className="space-y-4">
          <FormField label="Voice Characteristics">
            <p className="text-sm text-[#6B7280] mb-3">
              How does your brand sound when it speaks? (These remain consistent)
            </p>
            {data.voiceCharacteristics.map((characteristic, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={characteristic}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Characteristic
            </button>
          </FormField>
        </div>
      </Section>

      {/* Tone Variations by Context */}
      <Section
        title="Tone Variations by Context"
        expanded={expandedSections.has('toneVariations')}
        onToggle={() => toggleSection('toneVariations')}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Define how your tone adapts across different communication contexts while maintaining your core voice
          </p>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Website Copy</h4>
            <textarea
              placeholder="Describe the tone for website content (e.g., professional yet approachable, informative without being overwhelming)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Social Media</h4>
            <textarea
              placeholder="Describe the tone for social media posts (e.g., casual and conversational, engaging with personality)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Advertising</h4>
            <textarea
              placeholder="Describe the tone for advertising (e.g., bold and attention-grabbing, benefit-focused)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Email Marketing</h4>
            <textarea
              placeholder="Describe the tone for email campaigns (e.g., personal and direct, value-driven)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Client/Patient Communication</h4>
            <textarea
              placeholder="Describe the tone for direct communication with clients (e.g., warm and reassuring, respectful and professional)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Agency to Client Communications</h4>
            <textarea
              placeholder="Describe the tone for internal/agency communications (e.g., collaborative and strategic, clear and concise)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#1F2937]">Custom Context</h4>
              <button className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Context name (e.g., Trade Show Materials, Crisis Communication)"
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] mb-3"
            />
            <textarea
              placeholder="Describe the tone for this context..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </div>

          <button className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Custom Context
          </button>
        </div>
      </Section>

      {/* Language Guidelines */}
      <Section
        title="Language Guidelines"
        expanded={expandedSections.has('language')}
        onToggle={() => toggleSection('language')}
      >
        <div className="space-y-4">
          <FormField label="Words & Phrases to Use">
            <p className="text-sm text-[#6B7280] mb-3">
              Power words that align with your brand
            </p>
            {data.wordsToUse.map((word, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={word}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Word
            </button>
          </FormField>

          <FormField label="Words & Phrases to Avoid">
            <p className="text-sm text-[#6B7280] mb-3">
              Terms that don't align with your brand voice
            </p>
            {data.wordsToAvoid.map((word, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={word}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Word
            </button>
          </FormField>

          <FormField label="Grammar & Style Preferences">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Use Oxford comma</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Use contractions (we're, don't, etc.)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Use sentence fragments for emphasis</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Use active voice over passive</span>
              </label>
            </div>
          </FormField>
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