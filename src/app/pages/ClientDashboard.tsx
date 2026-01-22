import { useState } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faClockRotateLeft, faCheck, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { mockClients, mockGuideline } from '@/app/data/mockData';
import { FoundationsTab } from '@/app/components/tabs/FoundationsTab';
import { VisualIdentityTab } from '@/app/components/tabs/VisualIdentityTab';
import { PersonalityTab } from '@/app/components/tabs/PersonalityTab';
import { AudiencesTab } from '@/app/components/tabs/AudiencesTab';
import { VersionHistoryPanel } from '@/app/components/VersionHistoryPanel';
import { ExportDropdown } from '@/app/components/ExportDropdown';

type TabType = 'foundations' | 'personality' | 'audiences' | 'visual';

export function ClientDashboard() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('foundations');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const client = mockClients.find((c) => c.id === clientId);
  if (!client) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'personality', label: 'Personality & Tone' },
    { id: 'audiences', label: 'Target Audiences' },
    { id: 'visual', label: 'Visual Identity' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#1F2937] text-[32px]">{client.name}</h1>
            <span className="px-2 py-0.5 bg-[#FDE9B8] text-[#B87D0E] text-xs font-medium rounded">
              {client.currentVersion}
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
                  <ExportDropdown onClose={() => setShowExportDropdown(false)} />
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
          {activeTab === 'foundations' && <FoundationsTab data={mockGuideline.foundations} />}
          {activeTab === 'visual' && <VisualIdentityTab data={mockGuideline.visualIdentity} />}
          {activeTab === 'personality' && <PersonalityTab data={mockGuideline.personality} />}
          {activeTab === 'audiences' && <AudiencesTab data={mockGuideline.audiences} />}
        </div>
      </div>

      {/* Version History Panel */}
      {showVersionHistory && (
        <VersionHistoryPanel onClose={() => setShowVersionHistory(false)} />
      )}
    </div>
  );
}