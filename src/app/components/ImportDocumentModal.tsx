import { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFile, faFilePdf, faFileWord, faFileAlt, faSpinner, faTimes, faCheck, faLink, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useAction } from 'convex/react';
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

interface ImportDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: Id<"clients">;
  clientName: string;
}

type ImportMode = 'file' | 'url';
type FileType = 'pdf' | 'docx' | 'txt' | 'md' | 'json' | 'html';
type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'success' | 'error';

interface SelectedFile {
  file: File;
  type: FileType;
  status: UploadStatus;
  error?: string;
}

interface UrlImportState {
  url: string;
  status: UploadStatus;
  error?: string;
}

const ACCEPTED_TYPES: Record<string, FileType> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'text/markdown': 'md',
  'application/json': 'json',
};

// File extension fallback for browsers that don't set correct MIME types
const EXTENSION_TYPES: Record<string, FileType> = {
  '.md': 'md',
  '.markdown': 'md',
  '.json': 'json',
  '.txt': 'txt',
  '.pdf': 'pdf',
  '.docx': 'docx',
};

const FILE_ICONS: Record<FileType, typeof faFilePdf> = {
  pdf: faFilePdf,
  docx: faFileWord,
  txt: faFileAlt,
  md: faFileAlt,
  json: faFileAlt,
  html: faGlobe,
};

export function ImportDocumentModal({ isOpen, onClose, clientId, clientName }: ImportDocumentModalProps) {
  const [importMode, setImportMode] = useState<ImportMode>('file');
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [urlImport, setUrlImport] = useState<UrlImportState>({ url: '', status: 'idle' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.documentImports.generateUploadUrl);
  const createDocumentImport = useMutation(api.documentImports.create);
  const importFromUrl = useAction(api.documentImports.importFromUrl);
  const extractText = useAction(api.documentImports.extractText);
  const extractFields = useAction(api.claudeExtraction.extractFields);

  const getFileType = (file: File): FileType | null => {
    // First try MIME type
    if (ACCEPTED_TYPES[file.type]) {
      return ACCEPTED_TYPES[file.type];
    }

    // Fallback to file extension (some browsers don't set correct MIME for .md/.json)
    const fileName = file.name.toLowerCase();
    for (const [ext, type] of Object.entries(EXTENSION_TYPES)) {
      if (fileName.endsWith(ext)) {
        return type;
      }
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const fileType = getFileType(file);
    if (!fileType) {
      setSelectedFile({
        file,
        type: 'txt',
        status: 'error',
        error: 'Unsupported file type. Please upload PDF, DOCX, TXT, MD, or JSON files.',
      });
      return;
    }

    setSelectedFile({
      file,
      type: fileType,
      status: 'idle',
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.status === 'uploading' || selectedFile.status === 'extracting' || selectedFile.status === 'analyzing') return;

    setSelectedFile(prev => prev ? { ...prev, status: 'uploading' } : null);

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': selectedFile.file.type },
        body: selectedFile.file,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { storageId } = await response.json();

      // Step 3: Create document import record
      const importId = await createDocumentImport({
        clientId,
        filename: selectedFile.file.name,
        fileId: storageId,
        fileType: selectedFile.type,
      });

      // Step 4: Extract text from the uploaded file
      setSelectedFile(prev => prev ? { ...prev, status: 'extracting' } : null);

      const extractionResult = await extractText({ importId });

      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'Text extraction failed');
      }

      // Step 5: Analyze text with Claude to extract brand guidelines fields
      setSelectedFile(prev => prev ? { ...prev, status: 'analyzing' } : null);

      const analysisResult = await extractFields({ importId });

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Field extraction failed');
      }

      setSelectedFile(prev => prev ? { ...prev, status: 'success' } : null);

      // Close modal after short delay to show success state
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setSelectedFile(prev => prev ? {
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      } : null);
    }
  };

  const handleUrlImport = async () => {
    if (!urlImport.url || urlImport.status === 'uploading' || urlImport.status === 'extracting' || urlImport.status === 'analyzing') return;

    setUrlImport(prev => ({ ...prev, status: 'uploading' }));

    try {
      // Step 1: Import from URL (fetches content and creates import record)
      const result = await importFromUrl({
        clientId,
        url: urlImport.url,
      });

      if (!result.success || !result.importId) {
        throw new Error(result.error || 'Failed to import from URL');
      }

      // Step 2: Extract text (may already be done for HTML/text content)
      setUrlImport(prev => ({ ...prev, status: 'extracting' }));

      const extractionResult = await extractText({ importId: result.importId });

      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'Text extraction failed');
      }

      // Step 3: Analyze with Claude
      setUrlImport(prev => ({ ...prev, status: 'analyzing' }));

      const analysisResult = await extractFields({ importId: result.importId });

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Field extraction failed');
      }

      setUrlImport(prev => ({ ...prev, status: 'success' }));

      // Close modal after short delay to show success state
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('URL import error:', error);
      setUrlImport(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Import failed',
      }));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUrlImport({ url: '', status: 'idle' });
    setImportMode('file');
    setIsDragging(false);
    onClose();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearUrl = () => {
    setUrlImport({ url: '', status: 'idle' });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isUrlValid = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  // Determine button state based on current mode
  const isFileReady = importMode === 'file' && selectedFile && selectedFile.status === 'idle';
  const isUrlReady = importMode === 'url' && urlImport.url && isUrlValid(urlImport.url) && urlImport.status === 'idle';
  const isProcessing =
    (importMode === 'file' && selectedFile && ['uploading', 'extracting', 'analyzing'].includes(selectedFile.status)) ||
    (importMode === 'url' && ['uploading', 'extracting', 'analyzing'].includes(urlImport.status));

  const getButtonText = () => {
    if (importMode === 'file') {
      if (selectedFile?.status === 'uploading') return 'Uploading...';
      if (selectedFile?.status === 'extracting') return 'Extracting text...';
      if (selectedFile?.status === 'analyzing') return 'Analyzing with AI...';
      return 'Upload & Extract';
    } else {
      if (urlImport.status === 'uploading') return 'Fetching URL...';
      if (urlImport.status === 'extracting') return 'Extracting text...';
      if (urlImport.status === 'analyzing') return 'Analyzing with AI...';
      return 'Import & Extract';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <DialogDescription>
            Import content to extract brand guidelines for {clientName}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E7EB]">
          <button
            onClick={() => setImportMode('file')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              importMode === 'file'
                ? 'border-[#4074A8] text-[#4074A8]'
                : 'border-transparent text-[#6B7280] hover:text-[#374151]'
            }`}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setImportMode('url')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              importMode === 'url'
                ? 'border-[#4074A8] text-[#4074A8]'
                : 'border-transparent text-[#6B7280] hover:text-[#374151]'
            }`}
          >
            <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
            Import from URL
          </button>
        </div>

        <div className="py-4">
          {importMode === 'file' ? (
            // File Upload Mode
            <>
              {!selectedFile ? (
                // Drop zone
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragging
                      ? 'border-[#F2A918] bg-[#FEF9E7]'
                      : 'border-[#D1D5DB] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]'
                    }
                  `}
                >
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className={`w-12 h-12 mb-4 ${isDragging ? 'text-[#F2A918]' : 'text-[#9CA3AF]'}`}
                  />
                  <p className="text-sm font-medium text-[#374151] mb-1">
                    {isDragging ? 'Drop file here' : 'Drag and drop a file here'}
                  </p>
                  <p className="text-xs text-[#6B7280] mb-3">or click to browse</p>
                  <p className="text-xs text-[#9CA3AF]">
                    Supported formats: PDF, DOCX, TXT, MD, JSON
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.markdown,.json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,application/json"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                // File preview
                <div className={`
                  border rounded-lg p-4
                  ${selectedFile.status === 'error' ? 'border-red-300 bg-red-50' : 'border-[#E5E7EB]'}
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${selectedFile.status === 'error' ? 'bg-red-100' : 'bg-[#F3F4F6]'}
                    `}>
                      <FontAwesomeIcon
                        icon={FILE_ICONS[selectedFile.type] || faFile}
                        className={`w-5 h-5 ${selectedFile.status === 'error' ? 'text-red-500' : 'text-[#6B7280]'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#374151] truncate">
                        {selectedFile.file.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {formatFileSize(selectedFile.file.size)} • {selectedFile.type.toUpperCase()}
                      </p>
                    </div>
                    {selectedFile.status === 'idle' && (
                      <button
                        onClick={clearFile}
                        className="p-1.5 text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      </button>
                    )}
                    {(selectedFile.status === 'uploading' || selectedFile.status === 'extracting' || selectedFile.status === 'analyzing') && (
                      <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-[#F2A918] animate-spin" />
                    )}
                    {selectedFile.status === 'success' && (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                  </div>
                  {selectedFile.error && (
                    <p className="mt-2 text-xs text-red-600">{selectedFile.error}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            // URL Import Mode
            <div className="space-y-4">
              {urlImport.status === 'idle' || urlImport.status === 'error' ? (
                <>
                  <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-[#374151] mb-1.5">
                      Website or Document URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-[#9CA3AF]" />
                      </div>
                      <input
                        id="url-input"
                        type="url"
                        value={urlImport.url}
                        onChange={(e) => setUrlImport({ url: e.target.value, status: 'idle' })}
                        placeholder="https://example.com/brand-guidelines"
                        className={`
                          w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4074A8] focus:border-transparent
                          ${urlImport.status === 'error' ? 'border-red-300 bg-red-50' : 'border-[#D1D5DB]'}
                        `}
                      />
                      {urlImport.url && (
                        <button
                          onClick={clearUrl}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] hover:text-[#374151]"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {urlImport.error && (
                      <p className="mt-1.5 text-xs text-red-600">{urlImport.error}</p>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Enter the URL of a webpage, PDF, or document containing brand guidelines. We'll extract and analyze the content automatically.
                  </p>
                </>
              ) : (
                // URL processing state
                <div className={`
                  border rounded-lg p-4
                  ${urlImport.status === 'success' ? 'border-green-300 bg-green-50' : 'border-[#E5E7EB]'}
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${urlImport.status === 'success' ? 'bg-green-100' : 'bg-[#F3F4F6]'}
                    `}>
                      <FontAwesomeIcon
                        icon={faGlobe}
                        className={`w-5 h-5 ${urlImport.status === 'success' ? 'text-green-600' : 'text-[#6B7280]'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#374151] truncate">
                        {urlImport.url}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {urlImport.status === 'uploading' && 'Fetching content...'}
                        {urlImport.status === 'extracting' && 'Extracting text...'}
                        {urlImport.status === 'analyzing' && 'Analyzing with AI...'}
                        {urlImport.status === 'success' && 'Import complete!'}
                      </p>
                    </div>
                    {['uploading', 'extracting', 'analyzing'].includes(urlImport.status) && (
                      <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-[#F2A918] animate-spin" />
                    )}
                    {urlImport.status === 'success' && (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-md hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={importMode === 'file' ? handleUpload : handleUrlImport}
            disabled={!(isFileReady || isUrlReady) && !isProcessing}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2
              ${(isFileReady || isUrlReady)
                ? 'bg-[#F2A918] text-[#111827] hover:bg-[#D99A15]'
                : isProcessing
                  ? 'bg-[#F2A918] text-[#111827]'
                  : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              }
            `}
          >
            {isProcessing && (
              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
            )}
            {getButtonText()}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

