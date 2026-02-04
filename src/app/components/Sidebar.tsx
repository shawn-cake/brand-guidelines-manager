import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowDownAZ, faCalendarDays, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { APP_VERSION, COMPANY_NAME } from '../../version';

type SortType = 'name' | 'date';

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export function Sidebar() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const clientsByName = useQuery(api.clients.listByName);
  const clientsByDate = useQuery(api.clients.listByDate);
  const createClient = useMutation(api.clients.create);
  const deleteClient = useMutation(api.clients.remove);
  
  const clients = sortBy === 'name' ? clientsByName : clientsByDate;
  
  const handleNewClient = async () => {
    try {
      const newClientId = await createClient({ 
        client_name: 'New Client',
        industry: '',
      });
      navigate(`/client/${newClientId}`);
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const handleDeleteClient = async (id: Id<"clients">) => {
    try {
      await deleteClient({ id });
      // If we deleted the currently viewed client, navigate home
      if (clientId === id) {
        navigate('/');
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  return (
    <aside className="w-[280px] h-full bg-[#F3F4F6] border-r border-[#E5E7EB] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#1F2937] text-[20px]">Brand Guidelines Manager</h2>
        </div>

        <button
          onClick={handleNewClient}
          className="w-full bg-[#4074A8] text-white px-4 py-2.5 rounded-md hover:bg-[#2D5276] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
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
        {clients === undefined ? (
          <div className="p-4 text-sm text-[#6B7280]">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-4 text-sm text-[#6B7280]">
            No clients yet. Click "New Client" to get started.
          </div>
        ) : (
          clients.map((client) => {
            const isSelected = client._id === clientId;
            const isConfirmingDelete = deleteConfirm === client._id;
            
            return (
              <div
                key={client._id}
                className={`relative group border-l-3 transition-colors ${
                  isSelected
                    ? 'bg-[#EBF1F7] border-l-[#4074A8]'
                    : 'bg-transparent border-l-transparent hover:bg-white'
                }`}
              >
                {isConfirmingDelete ? (
                  // Delete confirmation UI
                  <div className="px-4 py-3">
                    <p className="text-sm text-[#1F2937] mb-2">Delete this client?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClient(client._id)}
                        className="flex-1 px-2 py-1 bg-[#DC2626] text-white text-xs rounded hover:bg-[#B91C1C] transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-2 py-1 bg-[#E5E7EB] text-[#374151] text-xs rounded hover:bg-[#D1D5DB] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal client item
                  <>
                    <Link
                      to={`/client/${client._id}`}
                      className="block px-4 py-3"
                    >
                      <div className="font-semibold text-sm text-[#1F2937] mb-0.5 text-[14px]">
                        {client.client_name}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        Edited {formatRelativeTime(client.updated_at)}
                      </div>
                    </Link>
                    {/* Delete button - shows on hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteConfirm(client._id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#9CA3AF] hover:text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete client"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">{COMPANY_NAME}</span>
          <span className="text-xs text-[#9CA3AF]">•</span>
          <span className="text-xs text-[#9CA3AF]">v{APP_VERSION}</span>
        </div>
      </div>
    </aside>
  );
}
