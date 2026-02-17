import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Id } from '../../../../convex/_generated/dataModel';
import { TocSection } from '../TableOfContents';
import { useFieldOperations } from '../../hooks/useFieldOperations';
import {
  ControlledInput,
  ControlledTextarea,
  Section,
  FormField,
  inputClass,
  inputSmClass,
} from '../form';
import { TargetAudiences, ClientData, SecondaryAudience, CustomerPersona } from '../../types/brandGuidelines';

interface AudiencesTabProps {
  clientId: Id<"clients">;
  data: TargetAudiences;
  fullData: ClientData;
  readOnly?: boolean;
  onExpandedSectionsChange?: (sections: Set<string>) => void;
}

export interface AudiencesTabHandle {
  getSections: () => TocSection[];
  expandedSections: Set<string>;
  completedSections: Set<string>;
  expandSection: (sectionId: string) => void;
}

// Section configuration for ToC
const SECTION_CONFIG = [
  { id: 'primary', title: 'Primary Audience' },
  { id: 'secondary', title: 'Secondary Audiences' },
  { id: 'personas', title: 'Customer Personas' },
  { id: 'journey', title: 'Customer Journey' },
];

export const AudiencesTab = forwardRef<AudiencesTabHandle, AudiencesTabProps>(
  function AudiencesTab({ clientId, data, fullData, readOnly = false, onExpandedSectionsChange }, ref) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['primary', 'personas'])
  );

  // Use shared field operations hook
  const { saveField, addToArray, removeFromArray, saveArrayItem, saveArrayItemField } = useFieldOperations({
    clientId,
    fullData,
    readOnly,
  });

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
      const newExpanded = new Set(expandedSections);
      newExpanded.add(sectionId);
      setExpandedSections(newExpanded);
      onExpandedSectionsChange?.(newExpanded);
    }
  };

  // Data extraction
  const primaryAudience = data?.primary_audience || {};
  const primaryDemographics = primaryAudience.demographics || {};
  const primaryPsychographics = primaryAudience.psychographics || [];
  const primaryPainPoints = primaryAudience.pain_points || [];
  const primaryGoals = primaryAudience.goals_and_motivations || [];
  const secondaryAudiences = data?.secondary_audiences || [];
  const personas = data?.customer_personas || [];
  const journey = data?.patient_client_journey || {};

  // Calculate section completion status
  const getCompletedSections = (): Set<string> => {
    const completed = new Set<string>();

    // Primary Audience: complete if any demographic field is filled
    const demoFields = ['age_range', 'gender', 'location', 'income_level', 'education_level', 'occupation'] as const;
    if (
      demoFields.some(field => primaryDemographics[field]?.trim()) ||
      primaryPsychographics.some((p: string) => p?.trim()) ||
      primaryPainPoints.some((p: string) => p?.trim()) ||
      primaryGoals.some((g: string) => g?.trim())
    ) {
      completed.add('primary');
    }

    // Secondary Audiences: complete if at least 1 secondary audience with a name is added
    if (secondaryAudiences.some((a: { name?: string }) => a?.name?.trim())) {
      completed.add('secondary');
    }

    // Personas: complete if at least 1 persona with a name is added
    if (personas.some((p: { name?: string }) => p?.name?.trim())) {
      completed.add('personas');
    }

    // Customer Journey: complete if at least one stage has content
    const stages = ['awareness', 'consideration', 'decision', 'experience', 'loyalty'] as const;
    if (stages.some(stage => {
      const stageData = journey[stage];
      if (!stageData) return false;
      return stageData.thoughts_feelings?.trim() ||
             (stageData.touchpoints?.length > 0 && stageData.touchpoints.some((t: string) => t?.trim()));
    })) {
      completed.add('journey');
    }

    return completed;
  };

  const completedSections = getCompletedSections();

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getSections: () => SECTION_CONFIG.map(({ id, title }) => ({
      id,
      title,
      ref: sectionRefs.current[id],
    })),
    expandedSections,
    completedSections,
    expandSection,
  }), [expandedSections, completedSections]);

  return (
    <div className="space-y-4">
      {/* Primary Audience */}
      <Section
        title="Primary Audience"
        expanded={expandedSections.has('primary')}
        onToggle={() => toggleSection('primary')}
        sectionRef={sectionRefs.current['primary']}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Define the demographics and characteristics of your primary target audience
          </p>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Demographics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Age Range</label>
                <ControlledInput
                  value={primaryDemographics.age_range || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'age_range'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., 25-45"
                  className={`${inputSmClass} w-full`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Gender</label>
                <ControlledInput
                  value={primaryDemographics.gender || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'gender'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., All genders"
                  className={`${inputSmClass} w-full`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Income Level</label>
                <ControlledInput
                  value={primaryDemographics.income || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'income'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., $75,000+"
                  className={`${inputSmClass} w-full`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Location</label>
                <ControlledInput
                  value={primaryDemographics.location || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'location'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., Urban areas"
                  className={`${inputSmClass} w-full`}
                />
              </div>
            </div>
          </div>

          <FormField label="Psychographics" description="Values, attitudes, and lifestyle characteristics">
            {primaryPsychographics.map((item: string, index: number) => (
              <div key={`psycho-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveArrayItem(['target_audiences', 'primary_audience', 'psychographics'], index, value)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button
                    onClick={() => removeFromArray(['target_audiences', 'primary_audience', 'psychographics'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {primaryPsychographics.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No psychographics added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => addToArray(['target_audiences', 'primary_audience', 'psychographics'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Psychographic
              </button>
            )}
          </FormField>

          <FormField label="Pain Points" description="Problems and challenges they face">
            {primaryPainPoints.map((item: string, index: number) => (
              <div key={`pain-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveArrayItem(['target_audiences', 'primary_audience', 'pain_points'], index, value)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button
                    onClick={() => removeFromArray(['target_audiences', 'primary_audience', 'pain_points'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {primaryPainPoints.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No pain points added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => addToArray(['target_audiences', 'primary_audience', 'pain_points'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Pain Point
              </button>
            )}
          </FormField>

          <FormField label="Goals & Motivations" description="What they're trying to achieve">
            {primaryGoals.map((item: string, index: number) => (
              <div key={`goal-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveArrayItem(['target_audiences', 'primary_audience', 'goals_and_motivations'], index, value)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button
                    onClick={() => removeFromArray(['target_audiences', 'primary_audience', 'goals_and_motivations'], index)}
                    className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {primaryGoals.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No goals added yet.</p>}
            {!readOnly && (
              <button
                onClick={() => addToArray(['target_audiences', 'primary_audience', 'goals_and_motivations'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Goal
              </button>
            )}
          </FormField>
        </div>
      </Section>

      {/* Secondary Audiences */}
      <Section
        title="Secondary Audiences"
        expanded={expandedSections.has('secondary')}
        onToggle={() => toggleSection('secondary')}
        sectionRef={sectionRefs.current['secondary']}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] mb-4">
            Additional audience segments that may benefit from your brand
          </p>

          {secondaryAudiences.map((audience: SecondaryAudience, index: number) => (
            <div key={`secondary-${index}-${audience.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{audience.name || `Audience ${index + 1}`}</h4>
                {!readOnly && (
                  <button
                    onClick={() => removeFromArray(['target_audiences', 'secondary_audiences'], index)}
                    className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <ControlledInput
                  value={audience.name || ''}
                  onSave={(value) => saveArrayItemField(['target_audiences', 'secondary_audiences'], index, 'name', value)}
                  readOnly={readOnly}
                  placeholder="Audience segment name"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <ControlledInput
                    value={audience.demographics?.age_range || ''}
                    onSave={(value) => {
                      const newDemographics = { ...audience.demographics, age_range: value };
                      saveArrayItemField(['target_audiences', 'secondary_audiences'], index, 'demographics', newDemographics);
                    }}
                    readOnly={readOnly}
                    placeholder="Age range"
                    className={`${inputSmClass} w-full`}
                  />
                  <ControlledInput
                    value={audience.demographics?.location || ''}
                    onSave={(value) => {
                      const newDemographics = { ...audience.demographics, location: value };
                      saveArrayItemField(['target_audiences', 'secondary_audiences'], index, 'demographics', newDemographics);
                    }}
                    readOnly={readOnly}
                    placeholder="Location"
                    className={`${inputSmClass} w-full`}
                  />
                </div>
              </div>
            </div>
          ))}
          {secondaryAudiences.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No secondary audiences added yet.</p>}
          {!readOnly && (
            <button
              onClick={() => addToArray(['target_audiences', 'secondary_audiences'], { name: '', demographics: {} })}
              className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Secondary Audience
            </button>
          )}
        </div>
      </Section>

      {/* Customer Personas */}
      <Section
        title="Customer Personas"
        expanded={expandedSections.has('personas')}
        onToggle={() => toggleSection('personas')}
        sectionRef={sectionRefs.current['personas']}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] mb-4">
            Create detailed buyer personas for your key audience segments
          </p>

          {personas.map((persona: CustomerPersona, index: number) => (
            <div key={`persona-${index}-${persona.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{persona.name || `Persona ${index + 1}`}</h4>
                {!readOnly && (
                  <button
                    onClick={() => removeFromArray(['target_audiences', 'customer_personas'], index)}
                    className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Name</label>
                    <ControlledInput
                      value={persona.name || ''}
                      onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'name', value)}
                      readOnly={readOnly}
                      placeholder="e.g., 'Wellness Whitney'"
                      className={`${inputSmClass} w-full`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Age</label>
                    <ControlledInput
                      value={persona.age || ''}
                      onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'age', value)}
                      readOnly={readOnly}
                      placeholder="e.g., 35"
                      className={`${inputSmClass} w-full`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Occupation</label>
                    <ControlledInput
                      value={persona.occupation || ''}
                      onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'occupation', value)}
                      readOnly={readOnly}
                      placeholder="e.g., Marketing Manager"
                      className={`${inputSmClass} w-full`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Background</label>
                  <ControlledTextarea
                    value={persona.background || ''}
                    onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'background', value)}
                    readOnly={readOnly}
                    placeholder="Brief biography and lifestyle..."
                    rows={2}
                    className={`${inputClass} resize-y`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">How We Reach Them</label>
                  <ControlledTextarea
                    value={persona.how_we_reach_them || ''}
                    onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'how_we_reach_them', value)}
                    readOnly={readOnly}
                    placeholder="Marketing channels and touchpoints..."
                    rows={2}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>
            </div>
          ))}
          {personas.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No personas added yet.</p>}
          {!readOnly && (
            <button
              onClick={() => addToArray(['target_audiences', 'customer_personas'], { name: '', age: '', occupation: '', background: '', how_we_reach_them: '' })}
              className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Persona
            </button>
          )}
        </div>
      </Section>

      {/* Customer Journey */}
      <Section
        title="Customer Journey"
        expanded={expandedSections.has('journey')}
        onToggle={() => toggleSection('journey')}
        sectionRef={sectionRefs.current['journey']}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Map the customer journey from awareness to loyalty
          </p>

          {(['awareness', 'consideration', 'decision', 'experience', 'loyalty'] as const).map((stage) => {
            const stageData = journey[stage] || {};
            const touchpoints = stageData.touchpoints || [];
            return (
              <div key={stage} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                <h4 className="text-sm font-medium text-[#1F2937] mb-3 capitalize">{stage}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Thoughts & Feelings</label>
                    <ControlledTextarea
                      value={stageData.thoughts_feelings || ''}
                      onSave={(value) => saveField(['target_audiences', 'patient_client_journey', stage, 'thoughts_feelings'], value)}
                      readOnly={readOnly}
                      placeholder={`What are they thinking/feeling at ${stage}?`}
                      rows={2}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Touchpoints</label>
                    {touchpoints.map((tp: string, tpIndex: number) => (
                      <div key={`${stage}-tp-${tpIndex}-${tp}`} className="flex gap-2 mb-2">
                        <ControlledInput
                          value={tp}
                          onSave={(value) => {
                            const newTouchpoints = [...touchpoints];
                            newTouchpoints[tpIndex] = value;
                            saveField(['target_audiences', 'patient_client_journey', stage, 'touchpoints'], newTouchpoints);
                          }}
                          readOnly={readOnly}
                          placeholder="Touchpoint"
                          className={`flex-1 ${inputSmClass}`}
                        />
                        {!readOnly && (
                          <button
                            onClick={() => {
                              const newTouchpoints = touchpoints.filter((_: string, i: number) => i !== tpIndex);
                              saveField(['target_audiences', 'patient_client_journey', stage, 'touchpoints'], newTouchpoints);
                            }}
                            className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {!readOnly && (
                      <button
                        onClick={() => {
                          const newTouchpoints = [...touchpoints, ''];
                          saveField(['target_audiences', 'patient_client_journey', stage, 'touchpoints'], newTouchpoints);
                        }}
                        className="mt-1 px-2 py-1 text-xs text-[#4074A8] hover:bg-[#EBF1F7] rounded flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />Add Touchpoint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
});
