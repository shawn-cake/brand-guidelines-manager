import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowDownAZ, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { mockClients } from '@/app/data/mockData';

type SortType = 'name' | 'date';

export function Sidebar() {
  const { clientId } = useParams();
  const [sortBy, setSortBy] = useState<SortType>('date');

  const sortedClients = [...mockClients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0; // Keep original order for date sort
  });

  return (
    <aside className="w-[280px] h-full bg-[#F3F4F6] border-r border-[#E5E7EB] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#1F2937] text-[20px]">Brand Guidelines Manager</h2>
        </div>

        <button className="w-full bg-[#4074A8] text-white px-4 py-2.5 rounded-md hover:bg-[#2D5276] transition-colors flex items-center justify-center gap-2 text-sm font-medium">
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          New Client
        </button>
      </div>

      {/* Sort Toggle */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('name')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-[#4074A8] text-white'
                : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <FontAwesomeIcon icon={faArrowDownAZ} className="w-3.5 h-3.5 mr-1.5" />
            A-Z
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              sortBy === 'date'
                ? 'bg-[#4074A8] text-white'
                : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5 mr-1.5" />
            Date
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        {sortedClients.map((client) => {
          const isSelected = client.id === clientId;
          return (
            <Link
              key={client.id}
              to={`/client/${client.id}`}
              className={`block px-4 py-3 border-l-3 transition-colors ${
                isSelected
                  ? 'bg-[#EBF1F7] border-l-[#4074A8]'
                  : 'bg-transparent border-l-transparent hover:bg-white'
              }`}
            >
              <div className="font-semibold text-sm text-[#1F2937] mb-0.5 text-[14px]">{client.name}</div>
              <div className="text-xs text-[#6B7280]">Edited {client.lastEdited}</div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}