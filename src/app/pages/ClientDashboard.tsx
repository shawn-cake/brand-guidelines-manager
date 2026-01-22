import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faClockRotateLeft, faCheck, faShareNodes, faSpinner, faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { FoundationsTab } from '@/app/components/tabs/FoundationsTab';
import { VersionHistoryPanel } from '@/app/components/VersionHistoryPanel';
import { ExportDropdown } from '@/app/components/ExportDropdown';

type TabType = 'foundations' | 'personality' | 'audiences' | 'visual';

export function ClientDashboard() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('foundations');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [viewingVersionId, setViewingVersionId] = useState<Id<"versions"> | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const client = useQuery(
    api.clients.get,
    clientId ? { id: clientId as Id<"clients"> } : "skip"
  );

  // Fetch the version being viewed (if any)
  const viewingVersion = useQuery(
    api.versions.get,
    viewingVersionId ? { id: viewingVersionId } : "skip"
  );

  const updateMetadata = useMutation(api.clients.updateMetadata);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Update local state when client data loads
  useEffect(() => {
    if (client) {
      setEditedName(client.client_name);
    }
  }, [client]);

  // Debug: track viewingVersionId changes
  useEffect(() => {
    console.log('=== viewingVersionId changed ===', viewingVersionId);
  }, [viewingVersionId]);

  const handleNameSave = async () => {
    if (!client || editedName.trim() === '') return;
    
    try {
      await updateMetadata({ 
        id: client._id, 
        client_name: editedName.trim() 
      });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditedName(client?.client_name || '');
      setIsEditingName(false);
    }
  };

  // Loading state
  if (client === undefined) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          <span>Loading client...</span>
        </div>
      </div>
    );
  }

  // Client not found
  if (client === null) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-2">Client not found</h2>
          <p className="text-[#6B7280]">This client may have been deleted.</p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'personality', label: 'Personality & Tone' },
    { id: 'audiences', label: 'Target Audiences' },
    { id: 'visual', label: 'Visual Identity' },
  ];

  const ComingSoonTab = ({ name }: { name: string }) => (
    <div className="text-center py-12">
      <p className="text-[#6B7280]">{name} tab coming soon.</p>
      <p className="text-sm text-[#9CA3AF] mt-2">This tab is being updated to work with the new data structure.</p>
    </div>
  );

  // Determine which data to display - version data or current draft
  // viewingVersion will be undefined while loading, null if not found, or the version object
  const isViewingVersion = viewingVersionId !== null && viewingVersion !== undefined && viewingVersion !== null;
  const displayData = (isViewingVersion && viewingVersion) ? viewingVersion.data : client.data;

  // Debug logging
  console.log('=== ClientDashboard Debug ===');
  console.log('viewingVersionId:', viewingVersionId);
  console.log('viewingVersion:', viewingVersion);
  console.log('isViewingVersion:', isViewingVersion);

  return (
    <div className="h-full flex flex-col">
      {/* Version Viewing Banner */}
      {isViewingVersion && (
        <div className="bg-[#FDE9B8] border-b border-[#F2A918] px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#B87D0E]">
              Viewing version {viewingVersion.version_number}
              {viewingVersion.version_name && ` — ${viewingVersion.version_name}`}
            </span>
            <span className="text-xs text-[#B87D0E]/70">
              (Read-only)
            </span>
          </div>
          <button
            onClick={() => setViewingVersionId(null)}
            className="px-4 py-1.5 bg-[#4074A8] text-white text-sm font-medium rounded-md hover:bg-[#2D5276] transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            Back to Current Draft
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className="text-2xl font-semibold text-[#1F2937] bg-white border border-[#4074A8] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4074A8]"
                style={{ fontSize: '32px' }}
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-2xl font-semibold text-[#1F2937] text-[32px]">{client.client_name}</h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-[#9CA3AF] hover:text-[#4074A8] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit client name"
                >
                  <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                </button>
              </div>
            )}
            <span className="px-2 py-0.5 bg-[#FDE9B8] text-[#B87D0E] text-xs font-medium rounded">
              v{client.current_version || '1.0'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#059669] text-sm">
              <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
              <span>All changes saved</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" />
                Import
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
                  Export
                </button>
                {showExportDropdown && (
                  <ExportDropdown 
                    client={client}
                    onClose={() => setShowExportDropdown(false)} 
                  />
                )}
              </div>
              <button className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faShareNodes} className="w-3.5 h-3.5" />
                Share URL
              </button>
              <button
                onClick={() => setShowVersionHistory(true)}
                className="px-3 py-2 bg-white border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors"
              >
                <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-8">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#4074A8] text-[#4074A8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#374151]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        <div className="max-w-[800px] mx-auto py-8 px-8">
          {activeTab === 'foundations' && (
            <FoundationsTab
              key={`foundations-${viewingVersionId ? String(viewingVersionId) : 'current-draft'}`}
              clientId={client._id}
              data={displayData.foundations}
              fullData={displayData}
              readOnly={isViewingVersion}
            />
          )}
          {activeTab === 'visual' && <ComingSoonTab name="Visual Identity" />}
          {activeTab === 'personality' && <ComingSoonTab name="Personality & Tone" />}
          {activeTab === 'audiences' && <ComingSoonTab name="Target Audiences" />}
        </div>
      </div>

      {/* Version History Panel */}
      {showVersionHistory && (
        <VersionHistoryPanel
          clientId={client._id}
          viewingVersionId={viewingVersionId}
          onClose={() => setShowVersionHistory(false)}
          onViewVersion={setViewingVersionId}
        />
      )}
    </div>
  );
}
