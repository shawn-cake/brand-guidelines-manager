import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';

interface VersionHistoryPanelProps {
  clientId: Id<"clients">;
  viewingVersionId: Id<"versions"> | null;
  onClose: () => void;
  onViewVersion: (versionId: Id<"versions"> | null) => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return formatDate(timestamp);
}

export function VersionHistoryPanel({ clientId, viewingVersionId, onClose, onViewVersion }: VersionHistoryPanelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const client = useQuery(api.clients.get, { id: clientId });
  const versions = useQuery(api.versions.listByClient, { client_id: clientId });

  const createVersion = useMutation(api.versions.create);
  const restoreVersion = useMutation(api.versions.restore);
  const deleteVersion = useMutation(api.versions.remove);

  const handleSaveVersion = async () => {
    if (!client) return;

    setIsSaving(true);
    try {
      // Calculate next version number
      const currentVersion = client.current_version || '1.0';
      const [major, minor] = currentVersion.split('.').map(Number);
      const nextVersion = `${major}.${minor + 1}`;

      await createVersion({
        client_id: clientId,
        version_number: nextVersion,
        version_name: versionName || undefined,
        description: versionDescription || undefined,
      });

      toast.success(`Version ${nextVersion} saved successfully`);
      setShowSaveForm(false);
      setVersionName('');
      setVersionDescription('');
    } catch (error) {
      console.error('Failed to save version:', error);
      toast.error('Failed to save version');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async (versionId: Id<"versions">, versionNumber: string) => {
    try {
      await restoreVersion({ version_id: versionId });
      toast.success(`Restored to version ${versionNumber}`);
      setRestoreConfirm(null);
      onViewVersion(null); // Clear any viewed version
      onClose(); // Close the panel after restore
    } catch (error) {
      console.error('Failed to restore version:', error);
      toast.error('Failed to restore version');
    }
  };

  const handleDelete = async (versionId: Id<"versions">, versionNumber: string) => {
    try {
      await deleteVersion({ id: versionId });
      toast.success(`Version ${versionNumber} deleted`);
      setDeleteConfirm(null);
      // If we deleted the version we're viewing, go back to current draft
      if (viewingVersionId === versionId) {
        onViewVersion(null);
      }
      onClose(); // Close the panel after delete
    } catch (error) {
      console.error('Failed to delete version:', error);
      toast.error('Failed to delete version');
    }
  };

  const handleView = (versionId: Id<"versions">) => {
    console.log('=== handleView called ===');
    console.log('versionId:', versionId);
    onViewVersion(versionId);
    console.log('onViewVersion called');
    onClose(); // Close the panel to show the version content
  };

  const handleBackToCurrentDraft = () => {
    onViewVersion(null);
  };

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

        {/* Save Version Button/Form */}
        <div className="p-4 border-b border-[#E5E7EB]">
          {showSaveForm ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Version name (optional)"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md text-sm focus:outline-none focus:border-[#4074A8] focus:ring-1 focus:ring-[#4074A8]"
              />
              <textarea
                placeholder="Description of changes (optional)"
                value={versionDescription}
                onChange={(e) => setVersionDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md text-sm focus:outline-none focus:border-[#4074A8] focus:ring-1 focus:ring-[#4074A8] resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveVersion}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-[#F2A918] text-[#111827] rounded-md hover:bg-[#D99A15] hover:text-[#111827] transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
                  )}
                  Save Version
                </button>
                <button
                  onClick={() => {
                    setShowSaveForm(false);
                    setVersionName('');
                    setVersionDescription('');
                  }}
                  className="px-4 py-2 bg-[#E5E7EB] text-[#374151] rounded-md hover:bg-[#D1D5DB] transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSaveForm(true)}
              className="w-full px-4 py-2.5 bg-[#F2A918] text-[#111827] rounded-md hover:bg-[#D99A15] hover:text-[#111827] transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
              Save Current as New Version
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Current Draft */}
            <div className={`pb-4 border-b border-[#E5E7EB] ${!viewingVersionId ? 'bg-[#EBF1F7] -mx-6 px-6 py-3' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#D1E0EE] text-[#4074A8] text-xs font-medium rounded">
                    Current Draft
                  </span>
                  {!viewingVersionId && (
                    <span className="text-xs text-[#059669] font-medium">← Viewing</span>
                  )}
                </div>
                {viewingVersionId && (
                  <button
                    onClick={handleBackToCurrentDraft}
                    className="px-3 py-1.5 bg-[#4074A8] text-white text-xs font-medium rounded hover:bg-[#2D5276] transition-colors"
                  >
                    Back to Draft
                  </button>
                )}
              </div>
              <div className="text-sm text-[#6B7280] mb-1">
                {versions && versions.length > 0
                  ? `Working draft based on v${versions[0].version_number}`
                  : 'No versions saved yet'}
              </div>
              {client && (
                <div className="text-xs text-[#9CA3AF]">
                  Last edited: {formatRelativeTime(client.updated_at)}
                </div>
              )}
            </div>

            {/* Version List */}
            {versions === undefined ? (
              <div className="flex items-center justify-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-[#6B7280] animate-spin" />
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#6B7280]">
                No versions saved yet. Click "Save Current as New Version" to create your first snapshot.
              </div>
            ) : (
              versions.map((version) => {
                const isConfirmingDelete = deleteConfirm === version._id;
                const isConfirmingRestore = restoreConfirm === version._id;
                const isViewing = viewingVersionId === version._id;

                return (
                  <div
                    key={version._id}
                    className={`pb-4 border-b border-[#E5E7EB] last:border-0 ${isViewing ? 'bg-[#EBF1F7] -mx-6 px-6 py-3' : ''}`}
                  >
                    {isConfirmingDelete ? (
                      <div className="bg-[#FEE2E2] p-3 rounded-md">
                        <p className="text-sm text-[#1F2937] mb-2">
                          Delete version {version.version_number}? This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(version._id, version.version_number)}
                            className="flex-1 px-2 py-1.5 bg-[#DC2626] text-white text-xs font-medium rounded hover:bg-[#B91C1C] transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-2 py-1.5 bg-white text-[#374151] text-xs font-medium rounded hover:bg-[#F9FAFB] transition-colors border border-[#D1D5DB]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : isConfirmingRestore ? (
                      <div className="bg-[#D1E0EE] p-3 rounded-md">
                        <p className="text-sm text-[#1F2937] mb-2">
                          Restore to version {version.version_number}? This will overwrite your current draft.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestore(version._id, version.version_number)}
                            className="flex-1 px-2 py-1.5 bg-[#4074A8] text-white text-xs font-medium rounded hover:bg-[#2D5276] transition-colors"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => setRestoreConfirm(null)}
                            className="flex-1 px-2 py-1.5 bg-white text-[#374151] text-xs font-medium rounded hover:bg-[#F9FAFB] transition-colors border border-[#D1D5DB]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                              v{version.version_number}
                              {version.version_name && (
                                <span className="font-normal text-[#6B7280]"> — {version.version_name}</span>
                              )}
                              {isViewing && (
                                <span className="ml-2 text-xs text-[#059669] font-medium">← Viewing</span>
                              )}
                            </h3>
                            {version.description && (
                              <p className="text-sm text-[#6B7280] mb-2">{version.description}</p>
                            )}
                            <div className="text-xs text-[#9CA3AF]">
                              {formatDate(version.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {isViewing ? (
                            <button
                              onClick={handleBackToCurrentDraft}
                              className="px-3 py-1.5 bg-[#4074A8] text-white text-xs font-medium rounded hover:bg-[#2D5276] transition-colors"
                            >
                              Back to Draft
                            </button>
                          ) : (
                            <button
                              onClick={() => handleView(version._id)}
                              className="px-3 py-1.5 bg-transparent text-[#4074A8] text-xs font-medium hover:bg-[#EBF1F7] rounded transition-colors"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={() => setRestoreConfirm(version._id)}
                            className="px-3 py-1.5 bg-transparent text-[#4074A8] text-xs font-medium hover:bg-[#EBF1F7] rounded transition-colors"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(version._id)}
                            className="px-3 py-1.5 bg-transparent text-[#DC2626] text-xs font-medium hover:bg-[#FEE2E2] rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}