import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faCode, faFilePdf, faDownload, faCopy } from '@fortawesome/free-solid-svg-icons';

interface ExportDropdownProps {
  onClose: () => void;
}

export function ExportDropdown({ onClose }: ExportDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 p-4"
    >
      <h3 className="text-sm font-semibold text-[#1F2937] mb-3 text-[14px]">
        Export Brand Guidelines
      </h3>

      <div className="space-y-2">
        {/* Markdown */}
        <ExportOption
          icon={faFile}
          title="Markdown (.md)"
          description="For documentation and AI tools"
          actions={
            <>
              <button className="px-3 py-1.5 bg-[#4074A8] text-white text-xs font-medium rounded hover:bg-[#2D5276] transition-colors flex items-center gap-1.5">
                <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
                Download
              </button>
              <button className="px-3 py-1.5 bg-white border border-[#D1D5DB] text-[#374151] text-xs font-medium rounded hover:bg-[#F9FAFB] transition-colors flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCopy} className="w-3 h-3" />
                Copy
              </button>
            </>
          }
        />

        {/* JSON */}
        <ExportOption
          icon={faCode}
          title="JSON (.json)"
          description="For automation and integrations"
          actions={
            <button className="px-3 py-1.5 bg-[#4074A8] text-white text-xs font-medium rounded hover:bg-[#2D5276] transition-colors flex items-center gap-1.5">
              <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
              Download
            </button>
          }
        />

        {/* PDF */}
        <ExportOption
          icon={faFilePdf}
          title="PDF"
          description="Coming soon"
          disabled
        />
      </div>
    </div>
  );
}

interface ExportOptionProps {
  icon: any;
  title: string;
  description: string;
  actions?: React.ReactNode;
  disabled?: boolean;
}

function ExportOption({ icon, title, description, actions, disabled }: ExportOptionProps) {
  return (
    <div
      className={`p-3 border border-[#E5E7EB] rounded-md ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 bg-[#F9FAFB] rounded flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={icon} className="w-4 h-4 text-[#6B7280]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[#1F2937] mb-0.5">{title}</div>
          <div className="text-xs text-[#6B7280]">{description}</div>
        </div>
      </div>
      {actions && !disabled && <div className="flex gap-2 ml-11">{actions}</div>}
    </div>
  );
}