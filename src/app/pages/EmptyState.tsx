import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function EmptyState() {
  const navigate = useNavigate();
  const createClient = useMutation(api.clients.create);

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
        <button
          onClick={handleNewClient}
          className="bg-[#4074A8] text-white px-6 py-2.5 rounded-md hover:bg-[#2D5276] transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          New Client
        </button>
      </div>
    </div>
  );
}
