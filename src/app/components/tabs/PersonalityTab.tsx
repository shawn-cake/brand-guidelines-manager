import { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

// Controlled input that syncs with external value and saves on blur
interface ControlledInputProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  type?: string;
}

function ControlledInput({ value, onSave, readOnly = false, placeholder, className, type = 'text' }: ControlledInputProps) {
  const [localValue, setLocalValue] = useState(value);

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

// Controlled textarea
interface ControlledTextareaProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
}

function ControlledTextarea({ value, onSave, readOnly = false, placeholder, className, rows = 3 }: ControlledTextareaProps) {
  const [localValue, setLocalValue] = useState(value);

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

// Controlled select
interface ControlledSelectProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  children: React.ReactNode;
}

function ControlledSelect({ value, onSave, readOnly = false, className, children }: ControlledSelectProps) {
  const [localValue, setLocalValue] = useState(value);

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

interface PersonalityTabProps {
  clientId: Id<"clients">;
  data: any;
  fullData: any;
  readOnly?: boolean;
}

export function PersonalityTab({ clientId, data, fullData, readOnly = false }: PersonalityTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['traits', 'voice'])
  );
  const updateClient = useMutation(api.clients.update);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
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

  const saveField = useCallback(async (path: string[], value: any) => {
    if (readOnly) return;
    try {
      const newData = JSON.parse(JSON.stringify(fullData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      await updateClient({ id: clientId, data: newData });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }, [clientId, fullData, updateClient, readOnly]);

  const handleAddToArray = async (path: string[], newItem: any) => {
    if (readOnly) return;
    const newData = JSON.parse(JSON.stringify(fullData));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    const arrayKey = path[path.length - 1];
    if (!current[arrayKey]) current[arrayKey] = [];
    current[arrayKey].push(newItem);
    try {
      await updateClient({ id: clientId, data: newData });
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleRemoveFromArray = async (path: string[], index: number) => {
    if (readOnly) return;
    const newData = JSON.parse(JSON.stringify(fullData));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]].splice(index, 1);
    try {
      await updateClient({ id: clientId, data: newData });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const saveSimpleArrayItem = useCallback(async (path: string[], index: number, value: string) => {
    if (readOnly) return;
    try {
      const newData = JSON.parse(JSON.stringify(fullData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]][index] = value;
      await updateClient({ id: clientId, data: newData });
    } catch (error) {
      console.error('Failed to save array item:', error);
    }
  }, [clientId, fullData, updateClient, readOnly]);

  const saveArrayItemField = useCallback(async (path: string[], index: number, field: string, value: string) => {
    if (readOnly) return;
    try {
      const newData = JSON.parse(JSON.stringify(fullData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      const arrayKey = path[path.length - 1];
      if (current[arrayKey] && current[arrayKey][index]) {
        current[arrayKey][index][field] = value;
        await updateClient({ id: clientId, data: newData });
      }
    } catch (error) {
      console.error('Failed to save array item field:', error);
    }
  }, [clientId, fullData, updateClient, readOnly]);

  const archetypes = [
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

  const inputClass = "w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]";

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
            {traits.map((trait: string, index: number) => (
              <div key={`trait-${index}-${trait}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={trait}
                  onSave={(value) => saveSimpleArrayItem(['personality_and_tone', 'brand_personality_traits'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'brand_personality_traits'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {traits.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No traits added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'brand_personality_traits'], '')}
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
              onSave={(value) => saveField(['personality_and_tone', 'brand_archetype', 'primary'], value)}
              readOnly={readOnly}
              className={inputClass}
            >
              {archetypes.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </ControlledSelect>
          </FormField>

          <FormField label="Secondary Brand Archetype">
            <ControlledSelect
              value={archetype.secondary || ''}
              onSave={(value) => saveField(['personality_and_tone', 'brand_archetype', 'secondary'], value)}
              readOnly={readOnly}
              className={inputClass}
            >
              {archetypes.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
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
      >
        <div className="space-y-4">
          <FormField label="Voice Characteristics">
            <p className="text-sm text-[#6B7280] mb-3">
              How does your brand sound when it speaks? (These remain consistent)
            </p>
            {voiceChars.map((characteristic: string, index: number) => (
              <div key={`voice-${index}-${characteristic}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={characteristic}
                  onSave={(value) => saveSimpleArrayItem(['personality_and_tone', 'voice_characteristics'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'voice_characteristics'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {voiceChars.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No voice characteristics added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'voice_characteristics'], '')}
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
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Define how your tone adapts across different communication contexts while maintaining your core voice
          </p>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Website Copy</h4>
            <ControlledTextarea
              value={toneVariations.website_copy || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'website_copy'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for website content..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Social Media</h4>
            <ControlledTextarea
              value={toneVariations.social_media || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'social_media'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for social media posts..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Advertising</h4>
            <ControlledTextarea
              value={toneVariations.advertising || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'advertising'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for advertising..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Email Marketing</h4>
            <ControlledTextarea
              value={toneVariations.email_marketing || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'email_marketing'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for email campaigns..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Client/Patient Communication</h4>
            <ControlledTextarea
              value={toneVariations.client_to_patient_communication || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'client_to_patient_communication'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for direct client communication..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Agency to Client Communications</h4>
            <ControlledTextarea
              value={toneVariations.agency_to_client_communications || ''}
              onSave={(value) => saveField(['personality_and_tone', 'tone_variations_by_context', 'agency_to_client_communications'], value)}
              readOnly={readOnly}
              placeholder="Describe the tone for agency communications..."
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>
        </div>
      </Section>

      {/* Language Guidelines */}
      <Section
        title="Language Guidelines"
        expanded={expandedSections.has('language')}
        onToggle={() => toggleSection('language')}
      >
        <div className="space-y-4">
          <FormField label="Preferred Terminology">
            <p className="text-sm text-[#6B7280] mb-3">
              Define preferred terms and what to use instead
            </p>
            {preferredTerms.map((term: { use: string; instead_of: string }, index: number) => (
              <div key={`term-${index}-${term.use}`} className="flex gap-2 mb-2 items-center">
                <span className="text-sm text-[#6B7280] w-10">Use:</span>
                <ControlledInput
                  value={term.use || ''}
                  onSave={(value) => saveArrayItemField(['personality_and_tone', 'language_guidelines', 'preferred_terminology'], index, 'use', value)}
                  readOnly={readOnly}
                  placeholder="Preferred term"
                  className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                <span className="text-sm text-[#6B7280] w-20">Instead of:</span>
                <ControlledInput
                  value={term.instead_of || ''}
                  onSave={(value) => saveArrayItemField(['personality_and_tone', 'language_guidelines', 'preferred_terminology'], index, 'instead_of', value)}
                  readOnly={readOnly}
                  placeholder="Avoid this term"
                  className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'language_guidelines', 'preferred_terminology'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {preferredTerms.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No preferred terminology added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'language_guidelines', 'preferred_terminology'], { use: '', instead_of: '' })}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                Add Term
              </button>
            )}
          </FormField>

          <FormField label="Words & Phrases to Avoid">
            <p className="text-sm text-[#6B7280] mb-3">
              Terms that don't align with your brand voice
            </p>
            {wordsToAvoid.map((word: string, index: number) => (
              <div key={`avoid-${index}-${word}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={word}
                  onSave={(value) => saveSimpleArrayItem(['personality_and_tone', 'language_guidelines', 'words_to_avoid'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'language_guidelines', 'words_to_avoid'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {wordsToAvoid.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No words to avoid added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'language_guidelines', 'words_to_avoid'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                Add Word
              </button>
            )}
          </FormField>

          <FormField label="Industry-Specific Language">
            <p className="text-sm text-[#6B7280] mb-3">
              Terminology specific to your industry
            </p>
            {industryLanguage.map((term: string, index: number) => (
              <div key={`industry-${index}-${term}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={term}
                  onSave={(value) => saveSimpleArrayItem(['personality_and_tone', 'language_guidelines', 'industry_specific_language'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'language_guidelines', 'industry_specific_language'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {industryLanguage.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No industry terms added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'language_guidelines', 'industry_specific_language'], '')}
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
      >
        <div className="space-y-4">
          <FormField label="Inclusive Language Guidelines">
            <p className="text-sm text-[#6B7280] mb-3">
              Guidelines for inclusive and respectful communication
            </p>
            {inclusiveStandards.map((standard: string, index: number) => (
              <div key={`inclusive-${index}-${standard}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={standard}
                  onSave={(value) => saveSimpleArrayItem(['personality_and_tone', 'inclusive_language_standards'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['personality_and_tone', 'inclusive_language_standards'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {inclusiveStandards.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No standards added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => handleAddToArray(['personality_and_tone', 'inclusive_language_standards'], '')}
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

function Section({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
        <h3 className="text-base font-semibold text-[#374151]">{title}</h3>
        <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} className="w-4 h-4 text-[#6B7280]" />
      </button>
      {expanded && <div className="px-6 pb-6 border-t border-[#E5E7EB] pt-4">{children}</div>}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-2">{label}</label>
      {children}
    </div>
  );
}