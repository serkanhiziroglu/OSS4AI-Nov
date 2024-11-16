import { useRef, useEffect } from 'react';
import { Download, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';

export function CoverLetterOutput({ coverLetter, setCoverLetter, onDownload }) {
  const coverLetterRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (coverLetter && coverLetterRef.current) {
      // Scroll to the cover letter section when it's generated
      coverLetterRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [coverLetter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!coverLetter) return null;

  return (
    <div className="" ref={coverLetterRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Your Cover Letter</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <CheckCheck size={20} /> : <Copy size={20} />}
          </button>
          <button
            onClick={onDownload}
            className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            title="Download"
          >
            <Download size={20} />
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