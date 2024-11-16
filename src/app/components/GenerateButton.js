export function GenerateButton({ onClick, isLoading }) {
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Cover Letter'}
      </button>
    );
  }