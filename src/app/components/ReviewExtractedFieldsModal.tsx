import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSpinner, faCheckDouble, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';

interface ReviewExtractedFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  importId: Id<"document_imports">;
  clientId: Id<"clients">;
}

// Field path to human-readable label mapping
const FIELD_LABELS: Record<string, string> = {
  'foundations.general_business_information.business_name': 'Business Name',
  'foundations.general_business_information.tagline': 'Tagline',
  'foundations.general_business_information.website_url': 'Website URL',
  'foundations.brand_identity.mission_statement': 'Mission Statement',
  'foundations.brand_identity.vision_statement': 'Vision Statement',
  'foundations.brand_identity.core_values': 'Core Values',
  'foundations.brand_identity.brand_story': 'Brand Story',
  'foundations.brand_identity.unique_value_proposition': 'Unique Value Proposition',
  'foundations.brand_identity.differentiators': 'Differentiators',
  'personality_and_tone.brand_personality_traits': 'Brand Personality Traits',
  'personality_and_tone.brand_archetype.primary': 'Primary Brand Archetype',
  'personality_and_tone.brand_archetype.secondary': 'Secondary Brand Archetype',
  'personality_and_tone.voice_characteristics': 'Voice Characteristics',
  'personality_and_tone.inclusive_language_standards': 'Inclusive Language Standards',
  'target_audiences.primary_audience.demographics': 'Primary Audience Demographics',
  'target_audiences.primary_audience.psychographics': 'Primary Audience Psychographics',
  'target_audiences.primary_audience.pain_points': 'Primary Audience Pain Points',
  'target_audiences.primary_audience.goals_and_motivations': 'Primary Audience Goals',
};

// Section labels for grouping
const SECTION_LABELS: Record<string, string> = {
  'foundations': 'Foundations',
  'personality_and_tone': 'Personality & Tone',
  'target_audiences': 'Target Audiences',
  'visual_identity': 'Visual Identity',
};

interface ExtractedField {
  path: string;
  label: string;
  value: unknown;
  section: string;
}

// Recursively flatten nested object into path-value pairs
function flattenFields(obj: unknown, prefix = ''): ExtractedField[] {
  const fields: ExtractedField[] = [];
  
  if (obj === null || obj === undefined) return fields;
  if (typeof obj !== 'object') return fields;
  
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const section = path.split('.')[0];
    
    if (value === null || value === undefined || value === '') continue;
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        fields.push({
          path,
          label: FIELD_LABELS[path] || formatLabel(path),
          value,
          section,
        });
      }
    } else if (typeof value === 'object') {
      // Check if it's a simple object with primitive values or nested
      const nestedFields = flattenFields(value, path);
      if (nestedFields.length > 0) {
        fields.push(...nestedFields);
      }
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      fields.push({
        path,
        label: FIELD_LABELS[path] || formatLabel(path),
        value,
        section,
      });
    }
  }
  
  return fields;
}

// Convert path like "brand_identity.mission_statement" to "Mission Statement"
function formatLabel(path: string): string {
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format a single object for display (e.g., color palette item, provider, etc.)
function formatObjectForDisplay(obj: Record<string, unknown>, index?: number): string {
  const lines: string[] = [];

  // Add index header if provided
  if (index !== undefined) {
    lines.push(`#${index}`);
  }

  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined || val === '') continue;

    const label = key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (Array.isArray(val)) {
      if (val.length > 0) {
        if (typeof val[0] === 'object') {
          lines.push(`${label}: ${JSON.stringify(val)}`);
        } else {
          lines.push(`${label}: ${val.join(', ')}`);
        }
      }
    } else if (typeof val === 'object') {
      lines.push(`${label}: ${JSON.stringify(val)}`);
    } else {
      lines.push(`${label}: ${val}`);
    }
  }

  return lines.join('\n');
}

// Format value for display
function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    // Check if array contains objects
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      // Format array of objects nicely
      return value.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return formatObjectForDisplay(item as Record<string, unknown>, index + 1);
        }
        return String(item);
      }).join('\n\n');
    }
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return formatObjectForDisplay(value as Record<string, unknown>);
  }
  return String(value);
}

export function ReviewExtractedFieldsModal({ 
  isOpen, 
  onClose, 
  importId, 
  clientId 
}: ReviewExtractedFieldsModalProps) {
  const [acceptedPaths, setAcceptedPaths] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentImport = useQuery(api.documentImports.get, { id: importId });
  const applyFields = useMutation(api.documentImports.applyFields);
  
  // Flatten extracted fields into reviewable list
  const extractedFields = useMemo(() => {
    if (!documentImport?.extracted_fields) return [];
    return flattenFields(documentImport.extracted_fields);
  }, [documentImport?.extracted_fields]);

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const grouped: Record<string, ExtractedField[]> = {};
    for (const field of extractedFields) {
      if (!grouped[field.section]) {
        grouped[field.section] = [];
      }
      grouped[field.section].push(field);
    }
    return grouped;
  }, [extractedFields]);

  const toggleField = (path: string) => {
    setAcceptedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const selectAll = () => {
    setAcceptedPaths(new Set(extractedFields.map(f => f.path)));
  };

  const deselectAll = () => {
    setAcceptedPaths(new Set());
  };

  const handleApply = async () => {
    if (acceptedPaths.size === 0) return;

    setIsApplying(true);
    try {
      // Build the accepted fields object from paths
      const acceptedFieldsList = extractedFields.filter(f => acceptedPaths.has(f.path));

      await applyFields({
        importId,
        clientId,
        acceptedFields: acceptedFieldsList.map(f => ({
          path: f.path,
          value: f.value,
        })),
      });

      onClose();
    } catch (error) {
      console.error('Failed to apply fields:', error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!documentImport) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Extracted Fields</DialogTitle>
          <DialogDescription>
            Review the fields extracted from "{documentImport.filename}". Select the fields you want to apply to the client profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
          <span className="text-sm text-[#6B7280]">
            {acceptedPaths.size} of {extractedFields.length} fields selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded hover:bg-[#F9FAFB] transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3" />
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded hover:bg-[#F9FAFB] transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
              Deselect All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {Object.entries(fieldsBySection).map(([section, fields]) => (
            <div key={section} className="space-y-3">
              <h3 className="text-sm font-semibold text-[#1F2937] uppercase tracking-wide">
                {SECTION_LABELS[section] || section}
              </h3>
              <div className="space-y-2">
                {fields.map(field => (
                  <div
                    key={field.path}
                    onClick={() => toggleField(field.path)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${acceptedPaths.has(field.path)
                        ? 'border-[#059669] bg-[#ECFDF5]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                        ${acceptedPaths.has(field.path)
                          ? 'border-[#059669] bg-[#059669]'
                          : 'border-[#D1D5DB]'
                        }
                      `}>
                        {acceptedPaths.has(field.path) && (
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#374151]">{field.label}</div>
                        <div className="text-sm text-[#6B7280] mt-1 whitespace-pre-wrap break-words">
                          {formatValue(field.value)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {extractedFields.length === 0 && (
            <div className="text-center py-8 text-[#6B7280]">
              No fields were extracted from this document.
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-md hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={acceptedPaths.size === 0 || isApplying}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2
              ${acceptedPaths.size > 0 && !isApplying
                ? 'bg-[#059669] text-white hover:bg-[#047857]'
                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              }
            `}
          >
            {isApplying && <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />}
            {isApplying ? 'Applying...' : `Apply ${acceptedPaths.size} Fields`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

