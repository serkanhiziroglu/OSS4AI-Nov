import { useState, useEffect } from 'react';

export function ResumeUpload({ resume, setResume, fileName, setFileName, onFileUpload }) {
  // Initialize saveToCache with false, will be updated in useEffect
  const [saveToCache, setSaveToCache] = useState(false);

  // Handle both initialization and loading of cached data
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const cachedResume = localStorage.getItem('cachedResume');
      const cachedFileName = localStorage.getItem('cachedFileName');
      
      if (cachedResume && cachedFileName) {
        setResume(cachedResume);
        setFileName(cachedFileName);
        setSaveToCache(true);
      }
    }
  }, [setResume, setFileName]);

  // Handle cache checkbox change
  const handleCacheChange = (e) => {
    setSaveToCache(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem('cachedResume', resume);
      localStorage.setItem('cachedFileName', fileName);
    } else {
      localStorage.removeItem('cachedResume');
      localStorage.removeItem('cachedFileName');
    }
  };

  // Override the file upload to handle caching
  const handleFileUpload = async (e) => {
    await onFileUpload(e);
    if (saveToCache) {
      // Small delay to ensure resume state is updated
      setTimeout(() => {
        localStorage.setItem('cachedResume', resume);
        localStorage.setItem('cachedFileName', fileName);
      }, 0);
    }
  };

  // Handle text change with caching
  const handleTextChange = (e) => {
    setResume(e.target.value);
    if (saveToCache) {
      localStorage.setItem('cachedResume', e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">1. Upload Your Resume</h2>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="cacheResume"
            checked={saveToCache}
            onChange={handleCacheChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="cacheResume" className="text-sm text-gray-600">
            Save for next time
          </label>
        </div>
      </div>

      <div className="w-full">
        <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="mt-2 text-sm text-black">
            {fileName || 'Upload PDF or text file'}
          </span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <textarea
        value={resume}
        onChange={handleTextChange}
        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
        placeholder="Or paste your resume here..."
      />
    </div>
  );
}