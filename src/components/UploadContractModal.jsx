import React, { useState, useCallback } from 'react';

const ACCEPTED_TYPES = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileIcon = ({ type }) => (
  <div className={`w-10 h-10 flex items-center justify-center rounded ${
    type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
  }`}>
    {type === 'pdf' ? (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-6h3v4H8v-4zm4-2h3v6h-3v-6zm-4 0h2v2H8v-2z" />
      </svg>
    ) : (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )}
  </div>
);

const RemoveIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}

function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext === 'pdf' ? 'pdf' : 'doc';
}

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const isImage = /\.(png|jpe?g)$/i.test(file.name);
  const url = file._url;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Preview</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 flex items-center justify-center min-h-[300px] bg-gray-50">
          {isImage && url ? (
            <img src={url} alt={file.name} className="max-w-full max-h-[500px] object-contain rounded-lg shadow" />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-medium text-[var(--color-text-primary)]">{file.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Preview not available for this file type</p>
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
          <p className="text-sm text-[var(--color-text-secondary)]">{file.name}</p>
        </div>
      </div>
    </div>
  );
}

export default function UploadContractModal({ isOpen, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const validateFile = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Invalid file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Max size: ${MAX_SIZE_MB}mb`;
    }
    return null;
  };

  const processFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError('');

    const id = `${file.name}-${Date.now()}`;
    const uploadEntry = {
      id,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    };

    setUploadingFiles((prev) => [...prev, uploadEntry]);

    // Simulate upload progress
    const duration = 2000 + Math.random() * 2000;
    const interval = 50;
    let progress = 0;

    const timer = setInterval(() => {
      progress += (interval / duration) * 100;
      if (progress >= 100) {
        clearInterval(timer);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
        const isImage = /\.(png|jpe?g)$/i.test(file.name);
        const _url = isImage ? URL.createObjectURL(file) : null;
        setUploadedFiles((prev) => [
          ...prev,
          { id, name: file.name, size: file.size, type: getFileIcon(file.name), _url },
        ]);
      } else {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: Math.round(progress) } : f))
        );
      }
    }, interval);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => processFile(file));
    },
    [processFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => processFile(file));
    e.target.value = '';
  };

  const cancelUpload = (id) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = () => {
    // In a real app, this would submit all files
    onClose();
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setUploadingFiles([]);
    setError('');
    setPreviewFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop - only interactive when open */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1e3a5f]">Upload Contract</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {/* Upload section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Upload</h3>

            {/* Drag and drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-gray-300 hover:border-[var(--color-primary)]/50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept={ACCEPTED_TYPES.map((t) => `.${t}`).join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <span className="text-[var(--color-primary)] font-medium hover:underline">
                  Drop or drag file
                </span>
                <p className="text-gray-500 text-sm mt-1">doc, pdf, xls, png, jpg</p>
                <p className="text-gray-500 text-sm">max size: {MAX_SIZE_MB}mb</p>
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Uploading files */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-3">
              {uploadingFiles.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <button
                      onClick={() => cancelUpload(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Cancel upload"
                    >
                      <RemoveIcon />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{item.name}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 font-medium min-w-[3rem]">
                      {item.progress}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatFileSize((item.size * item.progress) / 100)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              {uploadedFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <FileIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                  </div>
                  <button
                    onClick={() => setPreviewFile(item)}
                    className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                    aria-label="Preview file"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <RemoveIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleUpload}
            className="w-full py-3 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-lg transition-colors"
          >
            Upload
          </button>
        </div>
      </div>

      {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
}
