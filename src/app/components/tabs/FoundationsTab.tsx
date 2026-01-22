import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faPlus, faLink, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BrandGuideline } from '@/app/types';

interface FoundationsTabProps {
  data: BrandGuideline['foundations'];
}

export function FoundationsTab({ data }: FoundationsTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['general'])
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
      {/* General Business Information */}
      <Section
        title="General Business Information"
        expanded={expandedSections.has('general')}
        onToggle={() => toggleSection('general')}
      >
        <div className="space-y-4">
          <FormField label="Business Name">
            <input
              type="text"
              defaultValue={data.businessName}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>

          <FormField label="Tagline">
            <input
              type="text"
              defaultValue={data.tagline}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>

          <FormField label="Website URL">
            <div className="relative">
              <input
                type="text"
                defaultValue={data.websiteUrl}
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="Contact Page URL">
            <div className="relative">
              <input
                type="text"
                defaultValue={data.contactPageUrl}
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="Phone Numbers">
            {data.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={phone}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Phone Number
            </button>
          </FormField>
        </div>
      </Section>

      {/* Locations */}
      <Section
        title="Locations"
        expanded={expandedSections.has('locations')}
        onToggle={() => toggleSection('locations')}
      >
        <div className="space-y-4">
          <FormField label="Business Locations">
            <p className="text-sm text-[#6B7280] mb-3">
              Add each location with its address and hours of operation
            </p>
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1F2937]">Location 1</h4>
                <button className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Location Name (e.g., Main Office, Downtown Location)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <textarea
                  placeholder="Street Address, City, State, ZIP"
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
                <textarea
                  placeholder="Hours of Operation (e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-4PM)"
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
                <input
                  type="text"
                  placeholder="Phone Number (optional)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
            </div>
            <button className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Location
            </button>
          </FormField>
        </div>
      </Section>

      {/* Brand Identity */}
      <Section
        title="Brand Identity"
        expanded={expandedSections.has('brand')}
        onToggle={() => toggleSection('brand')}
      >
        <div className="space-y-4">
          <FormField label="Brand Story">
            <textarea
              defaultValue={data.brandStory}
              placeholder="Tell the story of how your brand came to be..."
              rows={4}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Mission">
            <textarea
              defaultValue={data.mission}
              placeholder="What is your organization's purpose?"
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Vision">
            <textarea
              defaultValue={data.vision}
              placeholder="Where do you see your organization in the future?"
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Unique Value Proposition">
            <textarea
              placeholder="What makes your brand uniquely valuable to customers?"
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Core Values">
            <p className="text-sm text-[#6B7280] mb-3">
              List the fundamental beliefs that guide your organization
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g., Integrity"
                className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
              </button>
            </div>
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Core Value
            </button>
          </FormField>

          <FormField label="Differentiators">
            <p className="text-sm text-[#6B7280] mb-3">
              What sets you apart from competitors?
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g., 24/7 Customer Support"
                className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
              </button>
            </div>
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Differentiator
            </button>
          </FormField>
        </div>
      </Section>

      {/* Services & Providers */}
      <Section
        title="Services & Providers"
        expanded={expandedSections.has('services')}
        onToggle={() => toggleSection('services')}
      >
        <div className="space-y-4">
          <FormField label="Services Offered">
            {data.services.map((service, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={service}
                  className="flex-1 px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
                <button className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2] transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Add Service
            </button>
          </FormField>
        </div>
      </Section>

      {/* Staff */}
      <Section
        title="Staff"
        expanded={expandedSections.has('staff')}
        onToggle={() => toggleSection('staff')}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Add information about key staff members, providers, or team members
          </p>
          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-[#1F2937]">Staff Member 1</h4>
              <button className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Name & Credentials</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Jane Smith, MD, FAAD"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Title/Role</label>
                <input
                  type="text"
                  placeholder="e.g., Board-Certified Dermatologist"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Bio / Background</label>
                <textarea
                  placeholder="Professional background, education, certifications, experience..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Services Offered</label>
                <textarea
                  placeholder="List specific services this staff member provides..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
              </div>
            </div>
          </div>
          <button className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Staff Member
          </button>
        </div>
      </Section>

      {/* Contact Information */}
      <Section
        title="Contact Information"
        expanded={expandedSections.has('contact')}
        onToggle={() => toggleSection('contact')}
      >
        <div className="space-y-4">
          <FormField label="Primary Email">
            <input
              type="email"
              placeholder="info@company.com"
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>

          <FormField label="Support Email">
            <input
              type="email"
              placeholder="support@company.com"
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>
        </div>
      </Section>

      {/* Social Media */}
      <Section
        title="Social Media"
        expanded={expandedSections.has('social')}
        onToggle={() => toggleSection('social')}
      >
        <div className="space-y-4">
          <FormField label="Facebook">
            <div className="relative">
              <input
                type="text"
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="Instagram">
            <div className="relative">
              <input
                type="text"
                placeholder="https://instagram.com/yourpage"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="Twitter/X">
            <div className="relative">
              <input
                type="text"
                placeholder="https://twitter.com/yourhandle"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="LinkedIn">
            <div className="relative">
              <input
                type="text"
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="TikTok">
            <div className="relative">
              <input
                type="text"
                placeholder="https://tiktok.com/@yourhandle"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="Pinterest">
            <div className="relative">
              <input
                type="text"
                placeholder="https://pinterest.com/yourboard"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>

          <FormField label="YouTube">
            <div className="relative">
              <input
                type="text"
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-3 py-2.5 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
              />
              <FontAwesomeIcon
                icon={faLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
              />
            </div>
          </FormField>
        </div>
      </Section>

      {/* Other Media to Emphasize */}
      <Section
        title="Other Media to Emphasize"
        expanded={expandedSections.has('otherMedia')}
        onToggle={() => toggleSection('otherMedia')}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Highlight other media channels that are important for your brand (podcasts, newsletters, etc.)
          </p>
          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#1F2937]">Media Channel 1</h4>
              <button className="px-2 py-1 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Channel Type</label>
                <input
                  type="text"
                  placeholder="e.g., Podcast, Newsletter, Blog, YouTube Channel"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g., The Beauty & Wellness Hour"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">URL</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-3 py-2 pr-10 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                  <FontAwesomeIcon
                    icon={faLink}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Description</label>
                <textarea
                  placeholder="Brief description of this media channel and why it's important..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
                />
              </div>
            </div>
          </div>
          <button className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Media Channel
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