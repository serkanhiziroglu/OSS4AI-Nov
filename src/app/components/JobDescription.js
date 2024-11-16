export function JobDescription({ jobDescription, setJobDescription }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">2. Add Job Description</h2>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
        placeholder="Paste the job description here..."
      />
    </div>
  );
}