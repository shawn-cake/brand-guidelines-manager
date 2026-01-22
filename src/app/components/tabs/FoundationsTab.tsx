import { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faLink, faTrash } from '@fortawesome/free-solid-svg-icons';
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

  // Sync local state when external value changes (e.g., switching versions)
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

interface FoundationsTabProps {
  clientId: Id<"clients">;
  data: any;
  fullData: any;
  readOnly?: boolean;
}

export function FoundationsTab({ clientId, data, fullData, readOnly = false }: FoundationsTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
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

  const general = data?.general_business_information || {};
  const brand = data?.brand_identity || {};
  const services = data?.services_and_providers || {};
  const social = general.social_media_handles || {};

  const saveField = useCallback(async (path: string[], value: any) => {
    if (readOnly) return; // Don't save when viewing a historical version
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

  const handleTextChange = (path: string[]) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    saveField(path, e.target.value);
  };

  const handleAddToArray = async (path: string[], newItem: any) => {
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

  const handleUpdateArrayItem = (path: string[], index: number, field: string) => 
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newData = JSON.parse(JSON.stringify(fullData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      const arrayKey = path[path.length - 1];
      if (current[arrayKey] && current[arrayKey][index]) {
        current[arrayKey][index][field] = e.target.value;
        updateClient({ id: clientId, data: newData }).catch(console.error);
      }
    };

  const handleUpdateSimpleArrayItem = (path: string[], index: number) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newData = JSON.parse(JSON.stringify(fullData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]][index] = e.target.value;
      updateClient({ id: clientId, data: newData }).catch(console.error);
    };

  // Save function for simple array items (used by ControlledInput)
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

  // Save function for object array items (used by ControlledInput for services)
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

  const inputClass = "w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]";
  const inputWithIconClass = "w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]";

  return (
    <div className="space-y-4">
      <Section title="General Business Information" expanded={expandedSections.has('general')} onToggle={() => toggleSection('general')}>
        <div className="space-y-4">
          <FormField label="Business Name">
            <ControlledInput
              value={general.business_name || ''}
              onSave={(value) => saveField(['foundations', 'general_business_information', 'business_name'], value)}
              readOnly={readOnly}
              placeholder="Enter business name"
              className={inputClass}
            />
          </FormField>
          <FormField label="Tagline">
            <ControlledInput
              value={general.tagline || ''}
              onSave={(value) => saveField(['foundations', 'general_business_information', 'tagline'], value)}
              readOnly={readOnly}
              placeholder="Enter tagline or slogan"
              className={inputClass}
            />
          </FormField>
          <FormField label="Website URL">
            <div className="relative">
              <ControlledInput
                value={general.website_url || ''}
                onSave={(value) => saveField(['foundations', 'general_business_information', 'website_url'], value)}
                readOnly={readOnly}
                placeholder="https://example.com"
                className={inputWithIconClass}
              />
              <FontAwesomeIcon icon={faLink} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </FormField>
          <FormField label="Contact Page URL">
            <div className="relative">
              <ControlledInput
                value={general.contact_page_url || ''}
                onSave={(value) => saveField(['foundations', 'general_business_information', 'contact_page_url'], value)}
                readOnly={readOnly}
                placeholder="https://example.com/contact"
                className={inputWithIconClass}
              />
              <FontAwesomeIcon icon={faLink} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </FormField>
          <FormField label="Phone Numbers">
            {(general.phone_numbers || []).map((phone: string, index: number) => (
              <div key={`phone-${index}-${phone}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={phone}
                  onSave={(value) => saveSimpleArrayItem(['foundations', 'general_business_information', 'phone_numbers'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button onClick={() => handleRemoveFromArray(['foundations', 'general_business_information', 'phone_numbers'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(general.phone_numbers || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No phone numbers added yet.</p>}
            {!readOnly && (
              <button onClick={() => handleAddToArray(['foundations', 'general_business_information', 'phone_numbers'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Phone Number
              </button>
            )}
          </FormField>
          <FormField label="Hours of Operation">
            <ControlledTextarea
              value={general.hours_of_operation || ''}
              onSave={(value) => saveField(['foundations', 'general_business_information', 'hours_of_operation'], value)}
              readOnly={readOnly}
              placeholder="e.g., Mon-Fri: 9AM-5PM"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Brand Identity" expanded={expandedSections.has('brand')} onToggle={() => toggleSection('brand')}>
        <div className="space-y-4">
          <FormField label="Brand Story">
            <ControlledTextarea
              value={brand.brand_story || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'brand_story'], value)}
              readOnly={readOnly}
              placeholder="Tell the story of how your brand came to be..."
              rows={4}
              className={inputClass + " resize-y"}
            />
          </FormField>
          <FormField label="Mission Statement">
            <ControlledTextarea
              value={brand.mission_statement || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'mission_statement'], value)}
              readOnly={readOnly}
              placeholder="What is your organization's purpose?"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </FormField>
          <FormField label="Vision Statement">
            <ControlledTextarea
              value={brand.vision_statement || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'vision_statement'], value)}
              readOnly={readOnly}
              placeholder="Where do you see your organization in the future?"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </FormField>
          <FormField label="Unique Value Proposition">
            <ControlledTextarea
              value={brand.unique_value_proposition || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'unique_value_proposition'], value)}
              readOnly={readOnly}
              placeholder="What makes your brand uniquely valuable?"
              rows={3}
              className={inputClass + " resize-y"}
            />
          </FormField>
          <FormField label="Core Values">
            <p className="text-sm text-[#6B7280] mb-3">List the fundamental beliefs that guide your organization</p>
            {(brand.core_values || []).map((value: string, index: number) => (
              <div key={`core-value-${index}-${value}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={value}
                  onSave={(newValue) => saveSimpleArrayItem(['foundations', 'brand_identity', 'core_values'], index, newValue)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button onClick={() => handleRemoveFromArray(['foundations', 'brand_identity', 'core_values'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(brand.core_values || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No core values added yet.</p>}
            {!readOnly && (
              <button onClick={() => handleAddToArray(['foundations', 'brand_identity', 'core_values'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Core Value
              </button>
            )}
          </FormField>
          <FormField label="Differentiators">
            <p className="text-sm text-[#6B7280] mb-3">What sets you apart from competitors?</p>
            {(brand.differentiators || []).map((diff: string, index: number) => (
              <div key={`differentiator-${index}-${diff}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={diff}
                  onSave={(value) => saveSimpleArrayItem(['foundations', 'brand_identity', 'differentiators'], index, value)}
                  readOnly={readOnly}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button onClick={() => handleRemoveFromArray(['foundations', 'brand_identity', 'differentiators'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(brand.differentiators || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No differentiators added yet.</p>}
            {!readOnly && (
              <button onClick={() => handleAddToArray(['foundations', 'brand_identity', 'differentiators'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Differentiator
              </button>
            )}
          </FormField>
        </div>
      </Section>

      <Section title="Services" expanded={expandedSections.has('services')} onToggle={() => toggleSection('services')}>
        <div className="space-y-4">
          <FormField label="Services Offered">
            {(services.services || []).map((service: any, index: number) => (
              <div key={`service-${index}-${service.name}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={service.name || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'services'], index, 'name', value)}
                  readOnly={readOnly}
                  placeholder="Service name"
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                <ControlledInput
                  value={service.page_url || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'services'], index, 'page_url', value)}
                  readOnly={readOnly}
                  placeholder="URL"
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm"
                />
                {!readOnly && (
                  <button onClick={() => handleRemoveFromArray(['foundations', 'services_and_providers', 'services'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(services.services || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No services added yet.</p>}
            {!readOnly && (
              <button onClick={() => handleAddToArray(['foundations', 'services_and_providers', 'services'], { name: '', page_url: '' })} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Service
              </button>
            )}
          </FormField>
        </div>
      </Section>

      <Section title="Providers / Staff" expanded={expandedSections.has('providers')} onToggle={() => toggleSection('providers')}>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">Add information about key staff members or providers</p>
          {(services.providers || []).map((provider: any, index: number) => (
            <div key={`provider-${index}-${provider.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{provider.name || `Provider ${index + 1}`}</h4>
                {!readOnly && (
                  <button onClick={() => handleRemoveFromArray(['foundations', 'services_and_providers', 'providers'], index)} className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded">
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <ControlledInput
                  value={provider.name || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'providers'], index, 'name', value)}
                  readOnly={readOnly}
                  placeholder="Name"
                  className={inputClass}
                />
                <ControlledInput
                  value={provider.credentials || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'providers'], index, 'credentials', value)}
                  readOnly={readOnly}
                  placeholder="Credentials (e.g., MD, FAAD)"
                  className={inputClass}
                />
                <ControlledTextarea
                  value={provider.bio || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'providers'], index, 'bio', value)}
                  readOnly={readOnly}
                  placeholder="Bio"
                  rows={3}
                  className={inputClass + " resize-y"}
                />
              </div>
            </div>
          ))}
          {(services.providers || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No providers added yet.</p>}
          {!readOnly && (
            <button onClick={() => handleAddToArray(['foundations', 'services_and_providers', 'providers'], { name: '', credentials: '', bio: '' })} className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Provider
            </button>
          )}
        </div>
      </Section>

      <Section title="Social Media" expanded={expandedSections.has('social')} onToggle={() => toggleSection('social')}>
        <div className="space-y-4">
          {['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'].map((platform) => (
            <FormField key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
              <div className="relative">
                <ControlledInput
                  value={social[platform] || ''}
                  onSave={(value) => saveField(['foundations', 'general_business_information', 'social_media_handles', platform], value)}
                  readOnly={readOnly}
                  placeholder={`https://${platform}.com/yourpage`}
                  className={inputWithIconClass}
                />
                <FontAwesomeIcon icon={faLink} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              </div>
            </FormField>
          ))}
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
