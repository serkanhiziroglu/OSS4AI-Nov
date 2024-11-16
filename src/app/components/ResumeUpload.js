export function ResumeUpload({ resume, setResume, fileName, setFileName, onFileUpload }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black">1. Upload Your Resume</h2>
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
            onChange={onFileUpload}
          />
        </label>
      </div>
      <textarea
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
        placeholder="Or paste your resume here..."
      />
    </div>
  );
}