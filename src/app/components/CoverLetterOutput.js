// components/CoverLetterOutput.js
import { useRef, useEffect, useState } from 'react';
import { ClipboardIcon, ClipboardCheckIcon, DownloadIcon } from './icons';

export function CoverLetterOutput({ coverLetter, setCoverLetter, onDownload }) {
  const coverLetterRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (coverLetter && coverLetterRef.current) {
      coverLetterRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [coverLetter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!coverLetter) return null;

  return (
    <div className="space-y-4" ref={coverLetterRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Your Cover Letter</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 ${
              copySuccess ? 'text-green-600' : 'text-gray-600'
            }`}
            title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
          >
            {copySuccess ? <ClipboardCheckIcon /> : <ClipboardIcon />}
          </button>
          <button
            onClick={onDownload}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
            title="Download"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full h-96 p-3 border border-gray-300 rounded-lg bg-white text-black resize-vertical"
          placeholder="Your cover letter will appear here..."
        />
      </div>
    </div>
  );
}