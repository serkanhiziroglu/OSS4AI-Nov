// components/CoverLetterOutput.js
import { useRef, useEffect } from 'react';

export function CoverLetterOutput({ coverLetter, setCoverLetter, onDownload }) {
  const coverLetterRef = useRef(null);

  useEffect(() => {
    if (coverLetter && coverLetterRef.current) {
      // Scroll to the cover letter section when it's generated
      coverLetterRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [coverLetter]);

  if (!coverLetter) return null;

  return (
    <div className="space-y-4" ref={coverLetterRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Your Cover Letter</h2>
        <button
          onClick={onDownload}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Download
        </button>
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