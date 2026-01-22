import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { mockVersions } from '@/app/data/mockData';

interface VersionHistoryPanelProps {
  onClose: () => void;
}

export function VersionHistoryPanel({ onClose }: VersionHistoryPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1F2937] text-[20px]">Version History</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F9FAFB] rounded transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Save Version Button */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <button className="w-full px-4 py-2.5 bg-[#F2A918] text-[rgb(255,255,255)] rounded-md hover:bg-[#B87D0E] transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
            Save Current as New Version
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Current Draft */}
            <div className="pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#D1E0EE] text-[#4074A8] text-xs font-medium rounded">
                  Current Draft
                </span>
              </div>
              <div className="text-sm text-[#6B7280] mb-1">
                Unsaved changes since v1.2
              </div>
              <div className="text-xs text-[#9CA3AF]">
                Last edited: Today at 3:45 PM
              </div>
            </div>

            {/* Version List */}
            {mockVersions.map((version, index) => (
              <div
                key={version.version}
                className="pb-4 border-b border-[#E5E7EB] last:border-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                      {version.version}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-2">{version.description}</p>
                    <div className="text-xs text-[#9CA3AF]">
                      {version.createdAt}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-transparent text-[#4074A8] text-xs font-medium hover:bg-[#EBF1F7] rounded transition-colors">
                    View
                  </button>
                  {index !== 0 && (
                    <button className="px-3 py-1.5 bg-transparent text-[#4074A8] text-xs font-medium hover:bg-[#EBF1F7] rounded transition-colors">
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}