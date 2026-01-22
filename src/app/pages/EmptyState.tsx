import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <FontAwesomeIcon
          icon={faFolder}
          className="w-12 h-12 text-[#9CA3AF] mb-6"
        />
        <h2 className="text-xl font-semibold text-[#1F2937] mb-2">
          Select a client to get started
        </h2>
        <p className="text-sm text-[#6B7280] mb-6">
          Choose a client from the sidebar or create a new one
        </p>
        <button className="bg-[#4074A8] text-white px-6 py-2.5 rounded-md hover:bg-[#2D5276] transition-colors text-sm font-medium">
          New Client
        </button>
      </div>
    </div>
  );
}
