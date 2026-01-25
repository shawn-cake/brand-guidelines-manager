import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLink, faTrash } from '@fortawesome/free-solid-svg-icons';
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
import { Foundations, ClientData } from '../../types/brandGuidelines';

interface FoundationsTabProps {
  clientId: Id<"clients">;
  data: Foundations;
  fullData: ClientData;
  readOnly?: boolean;
  onExpandedSectionsChange?: (sections: Set<string>) => void;
}

export interface FoundationsTabHandle {
  getSections: () => TocSection[];
  expandedSections: Set<string>;
  expandSection: (sectionId: string) => void;
}

// Section configuration for ToC
const SECTION_CONFIG = [
  { id: 'general', title: 'General Business Information' },
  { id: 'brand', title: 'Brand Identity' },
  { id: 'services', title: 'Services' },
  { id: 'providers', title: 'Providers / Staff' },
  { id: 'social', title: 'Social Media' },
];

export const FoundationsTab = forwardRef<FoundationsTabHandle, FoundationsTabProps>(
  function FoundationsTab({ clientId, data, fullData, readOnly = false, onExpandedSectionsChange }, ref) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));

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

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getSections: () => SECTION_CONFIG.map(({ id, title }) => ({
      id,
      title,
      ref: sectionRefs.current[id],
    })),
    expandedSections,
    expandSection,
  }), [expandedSections]);

  const general = data?.general_business_information || {};
  const brand = data?.brand_identity || {};
  const services = data?.services_and_providers || {};
  const social = general.social_media_handles || {};

  const inputWithIconClass = `${inputClass} pr-10`;

  return (
    <div className="space-y-4">
      <Section title="General Business Information" expanded={expandedSections.has('general')} onToggle={() => toggleSection('general')} sectionRef={sectionRefs.current['general']}>
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
                  onSave={(value) => saveArrayItem(['foundations', 'general_business_information', 'phone_numbers'], index, value)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['foundations', 'general_business_information', 'phone_numbers'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(general.phone_numbers || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No phone numbers added yet.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['foundations', 'general_business_information', 'phone_numbers'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
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
              className={`${inputClass} resize-y`}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Brand Identity" expanded={expandedSections.has('brand')} onToggle={() => toggleSection('brand')} sectionRef={sectionRefs.current['brand']}>
        <div className="space-y-4">
          <FormField label="Brand Story">
            <ControlledTextarea
              value={brand.brand_story || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'brand_story'], value)}
              readOnly={readOnly}
              placeholder="Tell the story of how your brand came to be..."
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </FormField>
          <FormField label="Mission Statement">
            <ControlledTextarea
              value={brand.mission_statement || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'mission_statement'], value)}
              readOnly={readOnly}
              placeholder="What is your organization's purpose?"
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </FormField>
          <FormField label="Vision Statement">
            <ControlledTextarea
              value={brand.vision_statement || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'vision_statement'], value)}
              readOnly={readOnly}
              placeholder="Where do you see your organization in the future?"
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </FormField>
          <FormField label="Unique Value Proposition">
            <ControlledTextarea
              value={brand.unique_value_proposition || ''}
              onSave={(value) => saveField(['foundations', 'brand_identity', 'unique_value_proposition'], value)}
              readOnly={readOnly}
              placeholder="What makes your brand uniquely valuable?"
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </FormField>
          <FormField label="Core Values" description="List the fundamental beliefs that guide your organization">
            {(brand.core_values || []).map((value: string, index: number) => (
              <div key={`core-value-${index}-${value}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={value}
                  onSave={(newValue) => saveArrayItem(['foundations', 'brand_identity', 'core_values'], index, newValue)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['foundations', 'brand_identity', 'core_values'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(brand.core_values || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No core values added yet.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['foundations', 'brand_identity', 'core_values'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Core Value
              </button>
            )}
          </FormField>
          <FormField label="Differentiators" description="What sets you apart from competitors?">
            {(brand.differentiators || []).map((diff: string, index: number) => (
              <div key={`differentiator-${index}-${diff}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={diff}
                  onSave={(value) => saveArrayItem(['foundations', 'brand_identity', 'differentiators'], index, value)}
                  readOnly={readOnly}
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['foundations', 'brand_identity', 'differentiators'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(brand.differentiators || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No differentiators added yet.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['foundations', 'brand_identity', 'differentiators'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Differentiator
              </button>
            )}
          </FormField>
        </div>
      </Section>

      <Section title="Services" expanded={expandedSections.has('services')} onToggle={() => toggleSection('services')} sectionRef={sectionRefs.current['services']}>
        <div className="space-y-4">
          <FormField label="Services Offered">
            {(services.services || []).map((service: { name?: string; page_url?: string }, index: number) => (
              <div key={`service-${index}-${service.name}`} className="flex gap-2 mb-2">
                <ControlledInput
                  value={service.name || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'services'], index, 'name', value)}
                  readOnly={readOnly}
                  placeholder="Service name"
                  className={`flex-1 ${inputSmClass}`}
                />
                <ControlledInput
                  value={service.page_url || ''}
                  onSave={(value) => saveArrayItemField(['foundations', 'services_and_providers', 'services'], index, 'page_url', value)}
                  readOnly={readOnly}
                  placeholder="URL"
                  className={`flex-1 ${inputSmClass}`}
                />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['foundations', 'services_and_providers', 'services'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {(services.services || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No services added yet.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['foundations', 'services_and_providers', 'services'], { name: '', page_url: '' })} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Service
              </button>
            )}
          </FormField>
        </div>
      </Section>

      <Section title="Providers / Staff" expanded={expandedSections.has('providers')} onToggle={() => toggleSection('providers')} sectionRef={sectionRefs.current['providers']}>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">Add information about key staff members or providers</p>
          {(services.providers || []).map((provider: { name?: string; credentials?: string; bio?: string }, index: number) => (
            <div key={`provider-${index}-${provider.name}`} className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-[#1F2937]">{provider.name || `Provider ${index + 1}`}</h4>
                {!readOnly && (
                  <button onClick={() => removeFromArray(['foundations', 'services_and_providers', 'providers'], index)} className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded">
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
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          ))}
          {(services.providers || []).length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No providers added yet.</p>}
          {!readOnly && (
            <button onClick={() => addToArray(['foundations', 'services_and_providers', 'providers'], { name: '', credentials: '', bio: '' })} className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Provider
            </button>
          )}
        </div>
      </Section>

      <Section title="Social Media" expanded={expandedSections.has('social')} onToggle={() => toggleSection('social')} sectionRef={sectionRefs.current['social']}>
        <div className="space-y-4">
          {(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'] as const).map((platform) => (
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
});
