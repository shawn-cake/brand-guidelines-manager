import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Id } from '../../../../convex/_generated/dataModel';
import { TocSection } from '../TableOfContents';
import {
  ControlledInput,
  ControlledTextarea,
  ControlledSelect,
  Section,
  FormField,
  inputClass,
} from '../form';
import { useFieldOperations } from '../../hooks/useFieldOperations';
import { PersonalityAndTone, ClientData } from '../../types/brandGuidelines';

interface PersonalityTabProps {
  clientId: Id<'clients'>;
  data: PersonalityAndTone;
  fullData: ClientData;
  readOnly?: boolean;
  onExpandedSectionsChange?: (sections: Set<string>) => void;
}

export interface PersonalityTabHandle {
  getSections: () => TocSection[];
  expandedSections: Set<string>;
  completedSections: Set<string>;
  expandSection: (sectionId: string) => void;
}

// Section configuration for ToC
const SECTION_CONFIG = [
  { id: 'traits', title: 'Brand Personality Traits' },
  { id: 'voice', title: 'Voice & Tone' },
  { id: 'toneVariations', title: 'Tone Variations by Context' },
  { id: 'language', title: 'Language Guidelines' },
  { id: 'inclusive', title: 'Inclusive Language Standards' },
];

const ARCHETYPES = [
  { value: '', label: 'Select a brand archetype...' },
  { value: 'hero', label: 'The Hero' },
  { value: 'sage', label: 'The Sage' },
  { value: 'explorer', label: 'The Explorer' },
  { value: 'innocent', label: 'The Innocent' },
  { value: 'creator', label: 'The Creator' },
  { value: 'ruler', label: 'The Ruler' },
  { value: 'caregiver', label: 'The Caregiver' },
  { value: 'magician', label: 'The Magician' },
  { value: 'lover', label: 'The Lover' },
  { value: 'jester', label: 'The Jester' },
  { value: 'everyman', label: 'The Everyman' },
  { value: 'rebel', label: 'The Rebel' },
];

export const PersonalityTab = forwardRef<PersonalityTabHandle, PersonalityTabProps>(
  function PersonalityTab({ clientId, data, fullData, readOnly = false, onExpandedSectionsChange }, ref) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
      new Set(['traits', 'voice'])
    );

    // Use the shared hook for all field operations
    const { saveField, addToArray, removeFromArray, saveArrayItem, saveArrayItemField } =
      useFieldOperations({ clientId, fullData, readOnly });

    // Create refs for each section
    const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
    SECTION_CONFIG.forEach(({ id }) => {
      if (!sectionRefs.current[id]) {
        sectionRefs.current[id] = { current: null };
      }
    });

    const toggleSection = (section: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(section)) {
        newExpanded.delete(section);
      } else {
        newExpanded.add(section);
      }
      setExpandedSections(newExpanded);
      onExpandedSectionsChange?.(newExpanded);
    };

    const expandSection = (sectionId: string) => {
      if (!expandedSections.has(sectionId)) {
        const newExpanded = new Set([...expandedSections, sectionId]);
        setExpandedSections(newExpanded);
        onExpandedSectionsChange?.(newExpanded);
      }
    };

    // Data extraction with defaults
    const traits = data?.brand_personality_traits || [];
    const archetype = data?.brand_archetype || {};
    const voiceChars = data?.voice_characteristics || [];
    const toneVariations = data?.tone_variations_by_context || {};
    const langGuidelines = data?.language_guidelines || {};
    const preferredTerms = langGuidelines.preferred_terminology || [];
    const wordsToAvoid = langGuidelines.words_to_avoid || [];
    const industryLanguage = langGuidelines.industry_specific_language || [];
    const inclusiveStandards = data?.inclusive_language_standards || [];

    // Calculate section completion status
    const getCompletedSections = (): Set<string> => {
      const completed = new Set<string>();

      // Traits: complete if at least 1 trait is added
      if (traits.some((t: string) => t?.trim())) {
        completed.add('traits');
      }

      // Voice & Tone: complete if at least 1 voice characteristic is added
      if (voiceChars.some((v: string) => v?.trim())) {
        completed.add('voice');
      }

      // Tone Variations: complete if at least one context has content
      const toneContexts = ['formal', 'informal', 'social_media', 'customer_service', 'internal'] as const;
      if (toneContexts.some(ctx => toneVariations[ctx]?.trim())) {
        completed.add('toneVariations');
      }

      // Language Guidelines: complete if at least 1 term, word to avoid, or industry term is added
      if (
        preferredTerms.some((t: { use?: string }) => t?.use?.trim()) ||
        wordsToAvoid.some((w: string) => w?.trim()) ||
        industryLanguage.some((i: string) => i?.trim())
      ) {
        completed.add('language');
      }

      // Inclusive Language: complete if at least 1 standard is added
      if (inclusiveStandards.some((s: string) => s?.trim())) {
        completed.add('inclusive');
      }

      return completed;
    };

    const completedSections = getCompletedSections();

    // Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        getSections: () =>
          SECTION_CONFIG.map(({ id, title }) => ({
            id,
            title,
            ref: sectionRefs.current[id],
          })),
        expandedSections,
        completedSections,
        expandSection,
      }),
      [expandedSections, completedSections]
    );

    return (
      <div className="space-y-4">
        {/* Brand Personality Traits */}
        <Section
          title="Brand Personality Traits"
          expanded={expandedSections.has('traits')}
          onToggle={() => toggleSection('traits')}
          sectionRef={sectionRefs.current['traits']}
        >
          <div className="space-y-4">
            <FormField
              label="Personality Traits"
              description="Select 4-6 adjectives that describe your brand's personality"
            >
              {traits.map((trait: string, index: number) => (
                <div key={`trait-${index}-${trait}`} className="flex gap-2 mb-2">
                  <ControlledInput
                    value={trait}
                    onSave={(value) =>
                      saveArrayItem(['personality_and_tone', 'brand_personality_traits'], index, value)
                    }
                    readOnly={readOnly}
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(['personality_and_tone', 'brand_personality_traits'], index)
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {traits.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No traits added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() =>
                    addToArray(['personality_and_tone', 'brand_personality_traits'], '')
                  }
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Trait
                </button>
              )}
            </FormField>

            <FormField label="Primary Brand Archetype">
              <ControlledSelect
                value={archetype.primary || ''}
                onSave={(value) =>
                  saveField(['personality_and_tone', 'brand_archetype', 'primary'], value)
                }
                readOnly={readOnly}
                className={inputClass}
              >
                {ARCHETYPES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </ControlledSelect>
            </FormField>

            <FormField label="Secondary Brand Archetype">
              <ControlledSelect
                value={archetype.secondary || ''}
                onSave={(value) =>
                  saveField(['personality_and_tone', 'brand_archetype', 'secondary'], value)
                }
                readOnly={readOnly}
                className={inputClass}
              >
                {ARCHETYPES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </ControlledSelect>
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
          sectionRef={sectionRefs.current['voice']}
        >
          <div className="space-y-4">
            <FormField
              label="Voice Characteristics"
              description="How does your brand sound when it speaks? (These remain consistent)"
            >
              {voiceChars.map((characteristic: string, index: number) => (
                <div key={`voice-${index}-${characteristic}`} className="flex gap-2 mb-2">
                  <ControlledInput
                    value={characteristic}
                    onSave={(value) =>
                      saveArrayItem(['personality_and_tone', 'voice_characteristics'], index, value)
                    }
                    readOnly={readOnly}
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(['personality_and_tone', 'voice_characteristics'], index)
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {voiceChars.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No voice characteristics added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() => addToArray(['personality_and_tone', 'voice_characteristics'], '')}
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Characteristic
                </button>
              )}
            </FormField>
          </div>
        </Section>

        {/* Tone Variations by Context */}
        <Section
          title="Tone Variations by Context"
          expanded={expandedSections.has('toneVariations')}
          onToggle={() => toggleSection('toneVariations')}
          sectionRef={sectionRefs.current['toneVariations']}
        >
          <div className="space-y-4">
            <p className="text-sm text-[#6B7280]">
              Define how your tone adapts across different communication contexts while maintaining
              your core voice
            </p>

            {[
              { key: 'website_copy', label: 'Website Copy', placeholder: 'Describe the tone for website content...' },
              { key: 'social_media', label: 'Social Media', placeholder: 'Describe the tone for social media posts...' },
              { key: 'advertising', label: 'Advertising', placeholder: 'Describe the tone for advertising...' },
              { key: 'email_marketing', label: 'Email Marketing', placeholder: 'Describe the tone for email campaigns...' },
              { key: 'client_to_patient_communication', label: 'Client/Patient Communication', placeholder: 'Describe the tone for direct client communication...' },
              { key: 'agency_to_client_communications', label: 'Agency to Client Communications', placeholder: 'Describe the tone for agency communications...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                <h4 className="text-sm font-medium text-[#1F2937] mb-3">{label}</h4>
                <ControlledTextarea
                  value={(toneVariations as Record<string, string>)[key] || ''}
                  onSave={(value) =>
                    saveField(['personality_and_tone', 'tone_variations_by_context', key], value)
                  }
                  readOnly={readOnly}
                  placeholder={placeholder}
                  rows={3}
                  className={inputClass + ' resize-y'}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Language Guidelines */}
        <Section
          title="Language Guidelines"
          expanded={expandedSections.has('language')}
          onToggle={() => toggleSection('language')}
          sectionRef={sectionRefs.current['language']}
        >
          <div className="space-y-4">
            <FormField
              label="Preferred Terminology"
              description="Define preferred terms and what to use instead"
            >
              {preferredTerms.map((term: { use?: string; instead_of?: string }, index: number) => (
                <div key={`term-${index}-${term.use}`} className="flex gap-2 mb-2 items-center">
                  <span className="text-sm text-[#6B7280] w-10">Use:</span>
                  <ControlledInput
                    value={term.use || ''}
                    onSave={(value) =>
                      saveArrayItemField(
                        ['personality_and_tone', 'language_guidelines', 'preferred_terminology'],
                        index,
                        'use',
                        value
                      )
                    }
                    readOnly={readOnly}
                    placeholder="Preferred term"
                    className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  <span className="text-sm text-[#6B7280] w-20">Instead of:</span>
                  <ControlledInput
                    value={term.instead_of || ''}
                    onSave={(value) =>
                      saveArrayItemField(
                        ['personality_and_tone', 'language_guidelines', 'preferred_terminology'],
                        index,
                        'instead_of',
                        value
                      )
                    }
                    readOnly={readOnly}
                    placeholder="Avoid this term"
                    className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(
                          ['personality_and_tone', 'language_guidelines', 'preferred_terminology'],
                          index
                        )
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {preferredTerms.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No preferred terminology added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() =>
                    addToArray(
                      ['personality_and_tone', 'language_guidelines', 'preferred_terminology'],
                      { use: '', instead_of: '' }
                    )
                  }
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Term
                </button>
              )}
            </FormField>

            <FormField
              label="Words & Phrases to Avoid"
              description="Terms that don't align with your brand voice"
            >
              {wordsToAvoid.map((word: string, index: number) => (
                <div key={`avoid-${index}-${word}`} className="flex gap-2 mb-2">
                  <ControlledInput
                    value={word}
                    onSave={(value) =>
                      saveArrayItem(
                        ['personality_and_tone', 'language_guidelines', 'words_to_avoid'],
                        index,
                        value
                      )
                    }
                    readOnly={readOnly}
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(
                          ['personality_and_tone', 'language_guidelines', 'words_to_avoid'],
                          index
                        )
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {wordsToAvoid.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No words to avoid added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() =>
                    addToArray(['personality_and_tone', 'language_guidelines', 'words_to_avoid'], '')
                  }
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Word
                </button>
              )}
            </FormField>

            <FormField
              label="Industry-Specific Language"
              description="Terminology specific to your industry"
            >
              {industryLanguage.map((term: string, index: number) => (
                <div key={`industry-${index}-${term}`} className="flex gap-2 mb-2">
                  <ControlledInput
                    value={term}
                    onSave={(value) =>
                      saveArrayItem(
                        ['personality_and_tone', 'language_guidelines', 'industry_specific_language'],
                        index,
                        value
                      )
                    }
                    readOnly={readOnly}
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(
                          ['personality_and_tone', 'language_guidelines', 'industry_specific_language'],
                          index
                        )
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {industryLanguage.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No industry terms added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() =>
                    addToArray(
                      ['personality_and_tone', 'language_guidelines', 'industry_specific_language'],
                      ''
                    )
                  }
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Term
                </button>
              )}
            </FormField>
          </div>
        </Section>

        {/* Inclusive Language Standards */}
        <Section
          title="Inclusive Language Standards"
          expanded={expandedSections.has('inclusive')}
          onToggle={() => toggleSection('inclusive')}
          sectionRef={sectionRefs.current['inclusive']}
        >
          <div className="space-y-4">
            <FormField
              label="Inclusive Language Guidelines"
              description="Guidelines for inclusive and respectful communication"
            >
              {inclusiveStandards.map((standard: string, index: number) => (
                <div key={`inclusive-${index}-${standard}`} className="flex gap-2 mb-2">
                  <ControlledInput
                    value={standard}
                    onSave={(value) =>
                      saveArrayItem(
                        ['personality_and_tone', 'inclusive_language_standards'],
                        index,
                        value
                      )
                    }
                    readOnly={readOnly}
                    className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                  />
                  {!readOnly && (
                    <button
                      onClick={() =>
                        removeFromArray(
                          ['personality_and_tone', 'inclusive_language_standards'],
                          index
                        )
                      }
                      className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {inclusiveStandards.length === 0 && (
                <p className="text-sm text-[#9CA3AF] mb-2">No standards added yet.</p>
              )}
              {!readOnly && (
                <button
                  onClick={() =>
                    addToArray(['personality_and_tone', 'inclusive_language_standards'], '')
                  }
                  className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                  Add Guideline
                </button>
              )}
            </FormField>
          </div>
        </Section>
      </div>
    );
  }
);
