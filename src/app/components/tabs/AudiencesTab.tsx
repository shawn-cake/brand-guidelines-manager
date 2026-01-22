import { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

// Controlled input component
interface ControlledInputProps {
  value: string;
  onSave: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

function ControlledInput({ value, onSave, readOnly = false, placeholder, className }: ControlledInputProps) {
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
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      readOnly={readOnly}
    />
  );
}

// Controlled textarea component
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

interface AudiencesTabProps {
  clientId: Id<"clients">;
  data: any;
  fullData: any;
  readOnly?: boolean;
}

export function AudiencesTab({ clientId, data, fullData, readOnly = false }: AudiencesTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['primary', 'personas'])
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

  // Data extraction
  const primaryAudience = data?.primary_audience || {};
  const primaryDemographics = primaryAudience.demographics || {};
  const primaryPsychographics = primaryAudience.psychographics || [];
  const primaryPainPoints = primaryAudience.pain_points || [];
  const primaryGoals = primaryAudience.goals_and_motivations || [];
  const secondaryAudiences = data?.secondary_audiences || [];
  const personas = data?.customer_personas || [];
  const journey = data?.patient_client_journey || {};

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

  const saveArrayItemField = useCallback(async (path: string[], index: number, field: string, value: any) => {
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

  const inputClass = "w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]";
  const inputSmClass = "px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]";

  return (
    <div className="space-y-4">
      {/* Primary Audience */}
      <Section
        title="Primary Audience"
        expanded={expandedSections.has('primary')}
        onToggle={() => toggleSection('primary')}
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
                  className={inputSmClass + " w-full"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Gender</label>
                <ControlledInput
                  value={primaryDemographics.gender || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'gender'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., All genders"
                  className={inputSmClass + " w-full"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Income Level</label>
                <ControlledInput
                  value={primaryDemographics.income || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'income'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., $75,000+"
                  className={inputSmClass + " w-full"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Location</label>
                <ControlledInput
                  value={primaryDemographics.location || ''}
                  onSave={(value) => saveField(['target_audiences', 'primary_audience', 'demographics', 'location'], value)}
                  readOnly={readOnly}
                  placeholder="e.g., Urban areas"
                  className={inputSmClass + " w-full"}
                />
              </div>
            </div>
          </div>

          <FormField label="Psychographics">
            <p className="text-sm text-[#6B7280] mb-3">Values, attitudes, and lifestyle characteristics</p>
            {primaryPsychographics.map((item: string, index: number) => (
              <div key={`psycho-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveSimpleArrayItem(['target_audiences', 'primary_audience', 'psychographics'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['target_audiences', 'primary_audience', 'psychographics'], index)}
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
                onClick={() => handleAddToArray(['target_audiences', 'primary_audience', 'psychographics'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Psychographic
              </button>
            )}
          </FormField>

          <FormField label="Pain Points">
            <p className="text-sm text-[#6B7280] mb-3">Problems and challenges they face</p>
            {primaryPainPoints.map((item: string, index: number) => (
              <div key={`pain-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveSimpleArrayItem(['target_audiences', 'primary_audience', 'pain_points'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['target_audiences', 'primary_audience', 'pain_points'], index)}
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
                onClick={() => handleAddToArray(['target_audiences', 'primary_audience', 'pain_points'], '')}
                className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Pain Point
              </button>
            )}
          </FormField>

          <FormField label="Goals & Motivations">
            <p className="text-sm text-[#6B7280] mb-3">What they're trying to achieve</p>
            {primaryGoals.map((item: string, index: number) => (
              <div key={`goal-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={item}
                  onSave={(value) => saveSimpleArrayItem(['target_audiences', 'primary_audience', 'goals_and_motivations'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['target_audiences', 'primary_audience', 'goals_and_motivations'], index)}
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
                onClick={() => handleAddToArray(['target_audiences', 'primary_audience', 'goals_and_motivations'], '')}
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
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] mb-4">
            Additional audience segments that may benefit from your brand
          </p>

          {secondaryAudiences.map((audience: any, index: number) => (
            <div key={`secondary-${index}-${audience.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{audience.name || `Audience ${index + 1}`}</h4>
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['target_audiences', 'secondary_audiences'], index)}
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
                    className={inputSmClass + " w-full"}
                  />
                  <ControlledInput
                    value={audience.demographics?.location || ''}
                    onSave={(value) => {
                      const newDemographics = { ...audience.demographics, location: value };
                      saveArrayItemField(['target_audiences', 'secondary_audiences'], index, 'demographics', newDemographics);
                    }}
                    readOnly={readOnly}
                    placeholder="Location"
                    className={inputSmClass + " w-full"}
                  />
                </div>
              </div>
            </div>
          ))}
          {secondaryAudiences.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No secondary audiences added yet.</p>}
          {!readOnly && (
            <button
              onClick={() => handleAddToArray(['target_audiences', 'secondary_audiences'], { name: '', demographics: {} })}
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
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] mb-4">
            Create detailed buyer personas for your key audience segments
          </p>

          {personas.map((persona: any, index: number) => (
            <div key={`persona-${index}-${persona.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{persona.name || `Persona ${index + 1}`}</h4>
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveFromArray(['target_audiences', 'customer_personas'], index)}
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
                      className={inputSmClass + " w-full"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Age</label>
                    <ControlledInput
                      value={persona.age || ''}
                      onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'age', value)}
                      readOnly={readOnly}
                      placeholder="e.g., 35"
                      className={inputSmClass + " w-full"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Occupation</label>
                    <ControlledInput
                      value={persona.occupation || ''}
                      onSave={(value) => saveArrayItemField(['target_audiences', 'customer_personas'], index, 'occupation', value)}
                      readOnly={readOnly}
                      placeholder="e.g., Marketing Manager"
                      className={inputSmClass + " w-full"}
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
                    className={inputClass + " resize-y"}
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
                    className={inputClass + " resize-y"}
                  />
                </div>
              </div>
            </div>
          ))}
          {personas.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No personas added yet.</p>}
          {!readOnly && (
            <button
              onClick={() => handleAddToArray(['target_audiences', 'customer_personas'], { name: '', age: '', occupation: '', background: '', how_we_reach_them: '' })}
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
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Map the customer journey from awareness to loyalty
          </p>

          {['awareness', 'consideration', 'decision', 'experience', 'loyalty'].map((stage) => {
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
                      className={inputClass + " resize-y"}
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
                          className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm"
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