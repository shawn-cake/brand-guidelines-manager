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
import { VisualIdentity, ClientData, ColorSwatch, Typeface, LogoLockup } from '../../types/brandGuidelines';

interface VisualIdentityTabProps {
  clientId: Id<"clients">;
  data: VisualIdentity;
  fullData: ClientData;
  readOnly?: boolean;
  onExpandedSectionsChange?: (sections: Set<string>) => void;
}

export interface VisualIdentityTabHandle {
  getSections: () => TocSection[];
  expandedSections: Set<string>;
  expandSection: (sectionId: string) => void;
}

// Section configuration for ToC
const SECTION_CONFIG = [
  { id: 'logo', title: 'Logo' },
  { id: 'color', title: 'Color' },
  { id: 'typography', title: 'Typography' },
  { id: 'imagery', title: 'Photography & Imagery' },
  { id: 'graphics', title: 'Graphic Elements' },
  { id: 'digital', title: 'Digital Applications' },
  { id: 'print', title: 'Print Applications' },
];

export const VisualIdentityTab = forwardRef<VisualIdentityTabHandle, VisualIdentityTabProps>(
  function VisualIdentityTab({ clientId, data, fullData, readOnly = false, onExpandedSectionsChange }, ref) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['logo', 'color'])
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

  // Data extraction
  const logo = data?.logo || {};
  const logoLockups = logo.logo_lockups || [];
  const logoParts = logo.logo_parts || {};
  const minSizeReqs = logo.minimum_size_requirements || {};
  const unacceptableUsage = logo.unacceptable_usage || [];

  const color = data?.color || {};
  const palette = color.palette || {};
  const primaryColors = palette.primary || [];
  const secondaryColors = palette.secondary || [];
  const tertiaryColors = palette.tertiary || [];
  const grayColors = palette.gray || [];
  const colorSchemes = color.color_schemes || [];
  const colorAccessibility = color.accessibility || {};

  const typography = data?.typography || {};
  const primaryTypeface = typography.primary_typeface || {};
  const secondaryTypeface = typography.secondary_typeface || {};
  const typographyHierarchy = typography.hierarchy || {};
  const typographyAccessibility = typography.accessibility || {};

  const photography = data?.photography_and_imagery || {};
  const styleGuidelines = photography.style_guidelines || [];
  const subjectMatter = photography.subject_matter || [];
  const imageFilters = photography.image_treatment_and_filters || [];
  const stockGuidelines = photography.stock_photography_guidelines || [];
  const altTextGuidelines = photography.alt_text_guidelines || [];

  const graphicElements = data?.graphic_elements || {};
  const icons = graphicElements.icons || {};
  const patterns = graphicElements.patterns || {};
  const textures = graphicElements.textures || {};
  const illustrations = graphicElements.illustrations || {};

  const digitalApps = data?.digital_applications || {};
  const websiteElements = digitalApps.website_elements || {};
  const socialTemplates = digitalApps.social_media_templates || {};
  const emailSig = digitalApps.email_signature || {};

  const printApps = data?.print_applications || {};
  const businessCards = printApps.business_cards || {};
  const letterhead = printApps.letterhead || {};
  const envelopes = printApps.envelopes || {};
  const brochures = printApps.brochures_and_collateral || {};
  const printAd = printApps.print_advertising || {};

  return (
    <div className="space-y-4">
      {/* Logo Section */}
      <Section
        title="Logo"
        expanded={expandedSections.has('logo')}
        onToggle={() => toggleSection('logo')}
        sectionRef={sectionRefs.current['logo']}
      >
        <div className="space-y-4">
          <FormField label="Logo Lock-ups" description="Primary and alternate logo versions">
            {logoLockups.map((lockup: LogoLockup, index: number) => (
              <div key={`lockup-${index}-${lockup.name}`} className="mb-4 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-[#1F2937]">{lockup.name || `Logo ${index + 1}`}</h4>
                  {!readOnly && (
                    <button onClick={() => removeFromArray(['visual_identity', 'logo', 'logo_lockups'], index)} className="text-[#DC2626] hover:bg-[#FEE2E2] px-2 py-1 rounded">
                      <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Name</label>
                    <ControlledInput value={lockup.name || ''} onSave={(v) => saveArrayItemField(['visual_identity', 'logo', 'logo_lockups'], index, 'name', v)} readOnly={readOnly} placeholder="e.g., Primary Logo" className={`${inputSmClass} w-full`} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Type</label>
                    <ControlledInput value={lockup.type || ''} onSave={(v) => saveArrayItemField(['visual_identity', 'logo', 'logo_lockups'], index, 'type', v)} readOnly={readOnly} placeholder="primary or alternate" className={`${inputSmClass} w-full`} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-[#374151] mb-1">Description</label>
                  <ControlledTextarea value={lockup.description || ''} onSave={(v) => saveArrayItemField(['visual_identity', 'logo', 'logo_lockups'], index, 'description', v)} readOnly={readOnly} placeholder="Description of this logo version..." rows={2} className={`${inputClass} resize-y`} />
                </div>
              </div>
            ))}
            {logoLockups.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No logo lock-ups added yet.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['visual_identity', 'logo', 'logo_lockups'], { name: '', type: 'primary', description: '' })} className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Logo Lock-up
              </button>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <h4 className="text-sm font-medium text-[#1F2937] mb-3">Logomark</h4>
              <ControlledTextarea value={logoParts.logomark?.description || ''} onSave={(v) => saveField(['visual_identity', 'logo', 'logo_parts', 'logomark', 'description'], v)} readOnly={readOnly} placeholder="Description of the logomark (icon portion)..." rows={2} className={`${inputClass} resize-y`} />
            </div>
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
              <h4 className="text-sm font-medium text-[#1F2937] mb-3">Wordmark</h4>
              <ControlledTextarea value={logoParts.wordmark?.description || ''} onSave={(v) => saveField(['visual_identity', 'logo', 'logo_parts', 'wordmark', 'description'], v)} readOnly={readOnly} placeholder="Description of the wordmark (text portion)..." rows={2} className={`${inputClass} resize-y`} />
            </div>
          </div>

          <FormField label="Minimum Size Requirements">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Print</label>
                <ControlledInput value={minSizeReqs.print || ''} onSave={(v) => saveField(['visual_identity', 'logo', 'minimum_size_requirements', 'print'], v)} readOnly={readOnly} placeholder="e.g., 1 inch wide" className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Digital</label>
                <ControlledInput value={minSizeReqs.digital || ''} onSave={(v) => saveField(['visual_identity', 'logo', 'minimum_size_requirements', 'digital'], v)} readOnly={readOnly} placeholder="e.g., 120px wide" className={`${inputSmClass} w-full`} />
              </div>
            </div>
          </FormField>

          <FormField label="Clear Space Requirements">
            <ControlledTextarea value={logo.clear_space_requirements || ''} onSave={(v) => saveField(['visual_identity', 'logo', 'clear_space_requirements'], v)} readOnly={readOnly} placeholder="Describe the minimum clear space around the logo..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>

          <FormField label="Unacceptable Usage" description="Things to avoid when using the logo">
            {unacceptableUsage.map((item: string, index: number) => (
              <div key={`unacceptable-${index}-${item}`} className="flex gap-2 mb-2">
                <ControlledInput value={item} onSave={(v) => saveArrayItem(['visual_identity', 'logo', 'unacceptable_usage'], index, v)} readOnly={readOnly} className={`flex-1 ${inputSmClass}`} />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['visual_identity', 'logo', 'unacceptable_usage'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {unacceptableUsage.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No unacceptable usages defined.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['visual_identity', 'logo', 'unacceptable_usage'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Unacceptable Usage
              </button>
            )}
          </FormField>
        </div>
      </Section>

      {/* Color Section */}
      <Section
        title="Color"
        expanded={expandedSections.has('color')}
        onToggle={() => toggleSection('color')}
        sectionRef={sectionRefs.current['color']}
      >
        <div className="space-y-6">
          <ColorPaletteSection title="Primary Colors" colors={primaryColors} path={['visual_identity', 'color', 'palette', 'primary']} onSave={saveArrayItemField} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <ColorPaletteSection title="Secondary Colors" colors={secondaryColors} path={['visual_identity', 'color', 'palette', 'secondary']} onSave={saveArrayItemField} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <ColorPaletteSection title="Tertiary Colors" colors={tertiaryColors} path={['visual_identity', 'color', 'palette', 'tertiary']} onSave={saveArrayItemField} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <ColorPaletteSection title="Gray Colors" colors={grayColors} path={['visual_identity', 'color', 'palette', 'gray']} onSave={saveArrayItemField} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />

          <FormField label="Color Schemes" description="Approved color combinations">
            {colorSchemes.map((scheme: string, index: number) => (
              <div key={`scheme-${index}-${scheme}`} className="flex gap-2 mb-2">
                <ControlledInput value={scheme} onSave={(v) => saveArrayItem(['visual_identity', 'color', 'color_schemes'], index, v)} readOnly={readOnly} className={`flex-1 ${inputSmClass}`} />
                {!readOnly && (
                  <button onClick={() => removeFromArray(['visual_identity', 'color', 'color_schemes'], index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {colorSchemes.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No color schemes defined.</p>}
            {!readOnly && (
              <button onClick={() => addToArray(['visual_identity', 'color', 'color_schemes'], '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Color Scheme
              </button>
            )}
          </FormField>

          <FormField label="Color Accessibility">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Body Text Contrast Ratio</label>
                <ControlledInput value={colorAccessibility.body_text_contrast_ratio || ''} onSave={(v) => saveField(['visual_identity', 'color', 'accessibility', 'body_text_contrast_ratio'], v)} readOnly={readOnly} placeholder="e.g., 4.5:1" className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Large Text Contrast Ratio</label>
                <ControlledInput value={colorAccessibility.large_text_contrast_ratio || ''} onSave={(v) => saveField(['visual_identity', 'color', 'accessibility', 'large_text_contrast_ratio'], v)} readOnly={readOnly} placeholder="e.g., 3:1" className={`${inputSmClass} w-full`} />
              </div>
            </div>
            <ControlledTextarea value={colorAccessibility.notes || ''} onSave={(v) => saveField(['visual_identity', 'color', 'accessibility', 'notes'], v)} readOnly={readOnly} placeholder="Additional accessibility notes..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>
        </div>
      </Section>

      {/* Typography Section */}
      <Section
        title="Typography"
        expanded={expandedSections.has('typography')}
        onToggle={() => toggleSection('typography')}
        sectionRef={sectionRefs.current['typography']}
      >
        <div className="space-y-4">
          <TypefaceSection title="Primary Typeface" typeface={primaryTypeface} path={['visual_identity', 'typography', 'primary_typeface']} onSave={saveField} readOnly={readOnly} />
          <TypefaceSection title="Secondary Typeface" typeface={secondaryTypeface} path={['visual_identity', 'typography', 'secondary_typeface']} onSave={saveField} readOnly={readOnly} />

          <FormField label="Type Hierarchy">
            <div className="grid grid-cols-2 gap-3">
              {(['h1', 'h2', 'h3', 'h4', 'body', 'caption'] as const).map((level) => (
                <div key={level}>
                  <label className="block text-xs font-medium text-[#374151] mb-1 uppercase">{level}</label>
                  <ControlledInput value={typographyHierarchy[level] || ''} onSave={(v) => saveField(['visual_identity', 'typography', 'hierarchy', level], v)} readOnly={readOnly} placeholder={`e.g., 32px/1.2 Bold`} className={`${inputSmClass} w-full`} />
                </div>
              ))}
            </div>
          </FormField>

          <FormField label="Typography Accessibility">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Minimum Body Size</label>
                <ControlledInput value={typographyAccessibility.minimum_body_size || ''} onSave={(v) => saveField(['visual_identity', 'typography', 'accessibility', 'minimum_body_size'], v)} readOnly={readOnly} placeholder="e.g., 16px" className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Line Height</label>
                <ControlledInput value={typographyAccessibility.line_height || ''} onSave={(v) => saveField(['visual_identity', 'typography', 'accessibility', 'line_height'], v)} readOnly={readOnly} placeholder="e.g., 1.5" className={`${inputSmClass} w-full`} />
              </div>
            </div>
            <ControlledTextarea value={typographyAccessibility.notes || ''} onSave={(v) => saveField(['visual_identity', 'typography', 'accessibility', 'notes'], v)} readOnly={readOnly} placeholder="Additional typography notes..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>
        </div>
      </Section>

      {/* Photography & Imagery */}
      <Section
        title="Photography & Imagery"
        expanded={expandedSections.has('imagery')}
        onToggle={() => toggleSection('imagery')}
        sectionRef={sectionRefs.current['imagery']}
      >
        <div className="space-y-4">
          <StringArrayField title="Style Guidelines" items={styleGuidelines} path={['visual_identity', 'photography_and_imagery', 'style_guidelines']} placeholder="e.g., Bright and airy natural lighting" onSave={saveArrayItem} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <StringArrayField title="Subject Matter" items={subjectMatter} path={['visual_identity', 'photography_and_imagery', 'subject_matter']} placeholder="e.g., Real patients in authentic settings" onSave={saveArrayItem} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <StringArrayField title="Image Treatment & Filters" items={imageFilters} path={['visual_identity', 'photography_and_imagery', 'image_treatment_and_filters']} placeholder="e.g., Warm color grading" onSave={saveArrayItem} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <StringArrayField title="Stock Photography Guidelines" items={stockGuidelines} path={['visual_identity', 'photography_and_imagery', 'stock_photography_guidelines']} placeholder="e.g., Use authentic, diverse imagery" onSave={saveArrayItem} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
          <StringArrayField title="Alt Text Guidelines" items={altTextGuidelines} path={['visual_identity', 'photography_and_imagery', 'alt_text_guidelines']} placeholder="e.g., Describe the action and emotion" onSave={saveArrayItem} onAdd={addToArray} onRemove={removeFromArray} readOnly={readOnly} />
        </div>
      </Section>

      {/* Graphic Elements */}
      <Section
        title="Graphic Elements"
        expanded={expandedSections.has('graphics')}
        onToggle={() => toggleSection('graphics')}
        sectionRef={sectionRefs.current['graphics']}
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Icons</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Style</label>
                <ControlledInput value={icons.style || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'icons', 'style'], v)} readOnly={readOnly} placeholder="e.g., Outlined, 2px stroke" className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Usage</label>
                <ControlledInput value={icons.usage || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'icons', 'usage'], v)} readOnly={readOnly} placeholder="e.g., Navigation, UI elements" className={`${inputSmClass} w-full`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Patterns</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Description</label>
                <ControlledTextarea value={patterns.description || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'patterns', 'description'], v)} readOnly={readOnly} placeholder="Describe brand patterns..." rows={2} className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Usage</label>
                <ControlledInput value={patterns.usage || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'patterns', 'usage'], v)} readOnly={readOnly} placeholder="e.g., Backgrounds, accent elements" className={`${inputSmClass} w-full`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Textures</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Description</label>
                <ControlledTextarea value={textures.description || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'textures', 'description'], v)} readOnly={readOnly} placeholder="Describe brand textures..." rows={2} className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Usage</label>
                <ControlledInput value={textures.usage || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'textures', 'usage'], v)} readOnly={readOnly} placeholder="e.g., Print materials, backgrounds" className={`${inputSmClass} w-full`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Illustrations</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Style</label>
                <ControlledInput value={illustrations.style || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'illustrations', 'style'], v)} readOnly={readOnly} placeholder="e.g., Flat, minimal line art" className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Usage</label>
                <ControlledInput value={illustrations.usage || ''} onSave={(v) => saveField(['visual_identity', 'graphic_elements', 'illustrations', 'usage'], v)} readOnly={readOnly} placeholder="e.g., Marketing materials, website" className={`${inputSmClass} w-full`} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Digital Applications */}
      <Section
        title="Digital Applications"
        expanded={expandedSections.has('digital')}
        onToggle={() => toggleSection('digital')}
        sectionRef={sectionRefs.current['digital']}
      >
        <div className="space-y-4">
          <FormField label="Website Elements">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Page Layout & Grid</label>
                <ControlledTextarea value={websiteElements.page_layout_and_grid || ''} onSave={(v) => saveField(['visual_identity', 'digital_applications', 'website_elements', 'page_layout_and_grid'], v)} readOnly={readOnly} placeholder="Describe page layout, grid system, margins..." rows={2} className={`${inputClass} resize-y`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Corner Radius</label>
                  <ControlledInput value={websiteElements.styles_and_effects?.corner_radius || ''} onSave={(v) => saveField(['visual_identity', 'digital_applications', 'website_elements', 'styles_and_effects', 'corner_radius'], v)} readOnly={readOnly} placeholder="e.g., 8px" className={`${inputSmClass} w-full`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Drop Shadows</label>
                  <ControlledInput value={websiteElements.styles_and_effects?.drop_shadows || ''} onSave={(v) => saveField(['visual_identity', 'digital_applications', 'website_elements', 'styles_and_effects', 'drop_shadows'], v)} readOnly={readOnly} placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)" className={`${inputSmClass} w-full`} />
                </div>
              </div>
            </div>
          </FormField>

          <FormField label="Social Media Templates">
            <div className="space-y-3">
              {(['instagram_post', 'instagram_story', 'facebook_cover', 'linkedin_banner'] as const).map((platform) => (
                <div key={platform} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1 capitalize">{platform.replace('_', ' ')}</label>
                    <ControlledInput value={socialTemplates[platform]?.specs || ''} onSave={(v) => saveField(['visual_identity', 'digital_applications', 'social_media_templates', platform, 'specs'], v)} readOnly={readOnly} placeholder="e.g., 1080x1080px" className={`${inputSmClass} w-full`} />
                  </div>
                </div>
              ))}
            </div>
          </FormField>

          <FormField label="Email Signature">
            <ControlledTextarea value={emailSig.format || ''} onSave={(v) => saveField(['visual_identity', 'digital_applications', 'email_signature', 'format'], v)} readOnly={readOnly} placeholder="Describe email signature format, required elements..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>
        </div>
      </Section>

      {/* Print Applications */}
      <Section
        title="Print Applications"
        expanded={expandedSections.has('print')}
        onToggle={() => toggleSection('print')}
        sectionRef={sectionRefs.current['print']}
      >
        <div className="space-y-4">
          <FormField label="Business Cards">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Size</label>
                <ControlledInput value={businessCards.size || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'business_cards', 'size'], v)} readOnly={readOnly} placeholder={'e.g., 3.5" x 2"'} className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Orientation</label>
                <ControlledInput value={businessCards.orientation || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'business_cards', 'orientation'], v)} readOnly={readOnly} placeholder="e.g., Horizontal" className={`${inputSmClass} w-full`} />
              </div>
            </div>
            <ControlledTextarea value={businessCards.notes || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'business_cards', 'notes'], v)} readOnly={readOnly} placeholder="Additional specifications..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>

          <FormField label="Letterhead">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Size</label>
                <ControlledInput value={letterhead.size || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'letterhead', 'size'], v)} readOnly={readOnly} placeholder={'e.g., 8.5" x 11"'} className={`${inputSmClass} w-full`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Layout</label>
                <ControlledInput value={letterhead.layout || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'letterhead', 'layout'], v)} readOnly={readOnly} placeholder="e.g., Logo top-left" className={`${inputSmClass} w-full`} />
              </div>
            </div>
            <ControlledTextarea value={letterhead.notes || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'letterhead', 'notes'], v)} readOnly={readOnly} placeholder="Additional specifications..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>

          <FormField label="Envelopes">
            <div className="mb-3">
              <label className="block text-xs font-medium text-[#374151] mb-1">Type</label>
              <ControlledInput value={envelopes.type || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'envelopes', 'type'], v)} readOnly={readOnly} placeholder="e.g., #10 Standard" className={`${inputSmClass} w-full`} />
            </div>
            <ControlledTextarea value={envelopes.notes || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'envelopes', 'notes'], v)} readOnly={readOnly} placeholder="Logo placement, return address positioning..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>

          <FormField label="Brochures & Collateral">
            <ControlledTextarea value={brochures.notes || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'brochures_and_collateral', 'notes'], v)} readOnly={readOnly} placeholder="Describe brochure formats, fold types, design requirements..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>

          <FormField label="Print Advertising">
            <ControlledTextarea value={printAd.notes || ''} onSave={(v) => saveField(['visual_identity', 'print_applications', 'print_advertising', 'notes'], v)} readOnly={readOnly} placeholder="List standard print ad sizes and specifications..." rows={2} className={`${inputClass} resize-y`} />
          </FormField>
        </div>
      </Section>
    </div>
  );
});

// Helper Components

interface ColorPaletteSectionProps {
  title: string;
  colors: ColorSwatch[];
  path: string[];
  onSave: (path: string[], index: number, field: string, value: unknown) => void;
  onAdd: (path: string[], item: unknown) => void;
  onRemove: (path: string[], index: number) => void;
  readOnly: boolean;
}

function ColorPaletteSection({ title, colors, path, onSave, onAdd, onRemove, readOnly }: ColorPaletteSectionProps) {
  return (
    <FormField label={title}>
      <div className="space-y-3">
        {colors.map((color: ColorSwatch, index: number) => (
          <div key={`${title}-color-${index}-${color.name}`} className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
            <div className="w-12 h-12 rounded-md border border-[#D1D5DB]" style={{ backgroundColor: color.hex || '#cccccc' }} />
            <div className="flex-1 grid grid-cols-4 gap-2">
              <ControlledInput value={color.name || ''} onSave={(v) => onSave(path, index, 'name', v)} readOnly={readOnly} placeholder="Name" className={`${inputSmClass} w-full`} />
              <ControlledInput value={color.hex || ''} onSave={(v) => onSave(path, index, 'hex', v)} readOnly={readOnly} placeholder="HEX (#000000)" className={`${inputSmClass} w-full`} />
              <ControlledInput value={color.rgb || ''} onSave={(v) => onSave(path, index, 'rgb', v)} readOnly={readOnly} placeholder="RGB" className={`${inputSmClass} w-full`} />
              <ControlledInput value={color.pantone || ''} onSave={(v) => onSave(path, index, 'pantone', v)} readOnly={readOnly} placeholder="Pantone" className={`${inputSmClass} w-full`} />
            </div>
            {!readOnly && (
              <button onClick={() => onRemove(path, index)} className="px-2 py-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded">
                <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {colors.length === 0 && <p className="text-sm text-[#9CA3AF]">No colors added yet.</p>}
        {!readOnly && (
          <button onClick={() => onAdd(path, { name: '', hex: '', rgb: '', pantone: '' })} className="px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Color
          </button>
        )}
      </div>
    </FormField>
  );
}

interface TypefaceSectionProps {
  title: string;
  typeface: Typeface;
  path: string[];
  onSave: (path: string[], value: unknown) => void;
  readOnly: boolean;
}

function TypefaceSection({ title, typeface, path, onSave, readOnly }: TypefaceSectionProps) {
  return (
    <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
      <h4 className="text-sm font-medium text-[#1F2937] mb-3">{title}</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Font Name</label>
            <ControlledInput value={typeface.name || ''} onSave={(v) => onSave([...path, 'name'], v)} readOnly={readOnly} placeholder="e.g., Inter" className={`${inputSmClass} w-full`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">Source URL</label>
            <ControlledInput value={typeface.source_url || ''} onSave={(v) => onSave([...path, 'source_url'], v)} readOnly={readOnly} placeholder="e.g., https://fonts.google.com/..." className={`${inputSmClass} w-full`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">Usage</label>
          <ControlledTextarea value={typeface.usage || ''} onSave={(v) => onSave([...path, 'usage'], v)} readOnly={readOnly} placeholder="When and how to use this typeface..." rows={2} className={`${inputClass} resize-y`} />
        </div>
      </div>
    </div>
  );
}

interface StringArrayFieldProps {
  title: string;
  items: string[];
  path: string[];
  placeholder: string;
  onSave: (path: string[], index: number, value: string) => void;
  onAdd: (path: string[], item: unknown) => void;
  onRemove: (path: string[], index: number) => void;
  readOnly: boolean;
}

function StringArrayField({ title, items, path, placeholder, onSave, onAdd, onRemove, readOnly }: StringArrayFieldProps) {
  return (
    <FormField label={title}>
      {items.map((item: string, index: number) => (
        <div key={`${title}-${index}-${item}`} className="flex gap-2 mb-2">
          <ControlledInput value={item} onSave={(v) => onSave(path, index, v)} readOnly={readOnly} placeholder={placeholder} className={`flex-1 ${inputSmClass}`} />
          {!readOnly && (
            <button onClick={() => onRemove(path, index)} className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#DC2626] rounded-md hover:bg-[#FEE2E2]">
              <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-[#9CA3AF] mb-2">No items added yet.</p>}
      {!readOnly && (
        <button onClick={() => onAdd(path, '')} className="mt-2 px-3 py-2 bg-transparent text-[#4074A8] text-sm font-medium hover:bg-[#EBF1F7] rounded-md flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />Add Item
        </button>
      )}
    </FormField>
  );
}
