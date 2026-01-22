import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faImage,
  faEye,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { BrandGuideline } from '@/app/types';

interface VisualIdentityTabProps {
  data: BrandGuideline['visualIdentity'];
}

export function VisualIdentityTab({ data }: VisualIdentityTabProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['logo', 'color'])
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
      {/* Logo Section */}
      <Section
        title="Logo"
        expanded={expandedSections.has('logo')}
        onToggle={() => toggleSection('logo')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Logo Lock-ups
            </label>
            <div className="grid grid-cols-3 gap-4">
              {data.logos.map((logo) => (
                <LogoCard key={logo.id} logo={logo} />
              ))}
              <AddLogoCard />
            </div>
          </div>
        </div>
      </Section>

      {/* Color Section */}
      <Section
        title="Color"
        expanded={expandedSections.has('color')}
        onToggle={() => toggleSection('color')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Primary Colors
            </label>
            <div className="flex flex-wrap gap-4">
              {data.colors.filter((c) => c.type === 'Primary').map((color) => (
                <ColorSwatchCard key={color.id} color={color} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Secondary Colors
            </label>
            <div className="flex flex-wrap gap-4">
              {data.colors.filter((c) => c.type === 'Secondary').map((color) => (
                <ColorSwatchCard key={color.id} color={color} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Accent Colors
            </label>
            <div className="flex flex-wrap gap-4">
              {data.colors.filter((c) => c.type === 'Accent').map((color) => (
                <ColorSwatchCard key={color.id} color={color} />
              ))}
            </div>
          </div>

          <button className="px-4 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Color
          </button>
        </div>
      </Section>

      {/* Typography Section */}
      <Section
        title="Typography"
        expanded={expandedSections.has('typography')}
        onToggle={() => toggleSection('typography')}
      >
        <div className="space-y-4">
          {data.typography.map((typo) => (
            <div
              key={typo.id}
              className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md"
            >
              <div className="font-semibold text-base text-[#1F2937] mb-1">{typo.name}</div>
              <div className="text-sm text-[#6B7280] mb-2">{typo.usage}</div>
              <div className="text-xs text-[#9CA3AF]">
                Weights: {typo.weights.join(', ')}
              </div>
            </div>
          ))}
          <button className="px-4 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Add Font
          </button>
        </div>
      </Section>

      {/* Imagery & Photography Style */}
      <Section
        title="Imagery & Photography Style"
        expanded={expandedSections.has('imagery')}
        onToggle={() => toggleSection('imagery')}
      >
        <div className="space-y-4">
          <FormField label="Photography Style">
            <textarea
              placeholder="Describe the style and mood of brand photography (e.g., bright and airy, moody and dramatic, lifestyle-focused)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Image Treatment">
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Apply brand color overlay</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Use rounded corners (8px radius)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] rounded focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Black and white filter option</span>
              </label>
            </div>
          </FormField>

          <FormField label="Stock Photo Sources">
            <input
              type="text"
              placeholder="Preferred stock photo sources (e.g., Unsplash, Pexels, custom library)"
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>
        </div>
      </Section>

      {/* Icon Style */}
      <Section
        title="Icon Style"
        expanded={expandedSections.has('icons')}
        onToggle={() => toggleSection('icons')}
      >
        <div className="space-y-4">
          <FormField label="Icon Style">
            <select className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]">
              <option value="">Select icon style...</option>
              <option value="outlined">Outlined</option>
              <option value="filled">Filled</option>
              <option value="duotone">Duotone</option>
              <option value="line">Line</option>
            </select>
          </FormField>

          <FormField label="Icon Library">
            <input
              type="text"
              placeholder="e.g., FontAwesome, Heroicons, Lucide"
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
            />
          </FormField>

          <FormField label="Icon Color">
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="iconColor"
                  defaultChecked
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Primary brand color</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="iconColor"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Neutral (gray)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="iconColor"
                  className="w-4 h-4 text-[#4074A8] border-[#D1D5DB] focus:ring-[#4074A8]"
                />
                <span className="text-sm text-[#1F2937]">Context-dependent</span>
              </label>
            </div>
          </FormField>
        </div>
      </Section>

      {/* Digital Applications */}
      <Section
        title="Digital Applications"
        expanded={expandedSections.has('digital')}
        onToggle={() => toggleSection('digital')}
      >
        <div className="space-y-4">
          <FormField label="Website Elements">
            <textarea
              placeholder="Describe key website design elements (navigation style, button treatments, form styles, etc.)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Page Layout & Grid">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Max Content Width</label>
                  <input
                    type="text"
                    placeholder="e.g., 1440px"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Grid Columns</label>
                  <input
                    type="text"
                    placeholder="e.g., 12 column"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Gutter Size</label>
                  <input
                    type="text"
                    placeholder="e.g., 24px"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Margin Size</label>
                  <input
                    type="text"
                    placeholder="e.g., 40px"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
              </div>
            </div>
          </FormField>

          <FormField label="Styles & Effects">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Corner Radius (Buttons)</label>
                  <input
                    type="text"
                    placeholder="e.g., 6px"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Corner Radius (Cards)</label>
                  <input
                    type="text"
                    placeholder="e.g., 8px"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Drop Shadow Style</label>
                <input
                  type="text"
                  placeholder="e.g., 0 4px 6px rgba(0, 0, 0, 0.1)"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Transition Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 200ms"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                />
              </div>
            </div>
          </FormField>

          <FormField label="Social Media Templates">
            <textarea
              placeholder="Describe social media template requirements (dimensions, safe zones, logo placement, etc.)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Email Signatures">
            <textarea
              placeholder="Describe email signature format, required elements, and style..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Digital Advertising Specs">
            <textarea
              placeholder="List standard ad sizes and specifications (e.g., Google Display 300x250, Facebook 1200x628, etc.)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>
        </div>
      </Section>

      {/* Print Applications */}
      <Section
        title="Print Applications"
        expanded={expandedSections.has('print')}
        onToggle={() => toggleSection('print')}
      >
        <div className="space-y-4">
          <FormField label="Business Cards">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g., 3.5&quot; x 2&quot;"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Paper Stock</label>
                  <input
                    type="text"
                    placeholder="e.g., 14pt Matte"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
              </div>
              <textarea
                placeholder="Additional specifications (finish, special treatments, layout requirements)..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
          </FormField>

          <FormField label="Letterhead">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g., 8.5 x 11 inches"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Paper Weight</label>
                  <input
                    type="text"
                    placeholder="e.g., 24lb Bond"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
              </div>
              <textarea
                placeholder="Layout specifications (margins, header/footer placement, etc.)..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
          </FormField>

          <FormField label="Envelopes">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g., #10 (4.125 x 9.5 inches)"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Window</label>
                  <select className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]">
                    <option value="">None</option>
                    <option value="left">Left Window</option>
                    <option value="right">Right Window</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Logo placement, return address positioning..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
              />
            </div>
          </FormField>

          <FormField label="Brochures & Collateral">
            <textarea
              placeholder="Describe standard brochure formats, fold types, paper stocks, and design requirements..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
          </FormField>

          <FormField label="Print Advertising">
            <textarea
              placeholder="List standard print ad sizes and specifications (e.g., Full Page 8.5x11, Half Page 8.5x5.5, etc.)..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8] focus:outline-none focus:ring-3 focus:ring-[#D1E0EE] resize-y"
            />
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

interface LogoCardProps {
  logo: BrandGuideline['visualIdentity']['logos'][0];
}

function LogoCard({ logo }: LogoCardProps) {
  return (
    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden group">
      <div className="aspect-square bg-[#F9FAFB] flex items-center justify-center relative">
        <FontAwesomeIcon icon={faImage} className="w-12 h-12 text-[#9CA3AF]" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100">
            <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5 text-[#374151]" />
          </button>
          <button className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100">
            <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5 text-[#374151]" />
          </button>
          <button className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100">
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5 text-[#DC2626]" />
          </button>
        </div>
      </div>
      <div className="p-3 bg-white">
        <div className="text-sm font-medium text-[#1F2937] mb-1">{logo.name}</div>
        <span className="inline-block px-2 py-0.5 bg-[#EBF1F7] text-[#4074A8] text-xs rounded">
          {logo.type}
        </span>
      </div>
    </div>
  );
}

function AddLogoCard() {
  return (
    <button className="border-2 border-dashed border-[#D1D5DB] rounded-lg aspect-square hover:border-[#4074A8] hover:bg-[#EBF1F7] transition-colors flex flex-col items-center justify-center gap-2">
      <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-[#9CA3AF]" />
      <span className="text-sm font-medium text-[#6B7280]">Add Logo</span>
    </button>
  );
}

interface ColorSwatchCardProps {
  color: BrandGuideline['visualIdentity']['colors'][0];
}

function ColorSwatchCard({ color }: ColorSwatchCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-lg border-2 border-[#E5E7EB] cursor-pointer hover:scale-105 transition-transform"
        style={{ backgroundColor: color.hex }}
      />
      <div className="text-center">
        <div className="text-sm font-medium text-[#1F2937]">{color.name}</div>
        <div className="text-xs text-[#6B7280]">{color.hex}</div>
      </div>
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