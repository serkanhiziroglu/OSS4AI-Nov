// components/StyleControls.js
export function StyleControls({ styleValue, onStyleChange, wordLimit, onWordLimitChange }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 -mb-5 text-center">Writing Style</h2>
        
        {/* Style Slider */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>Professional</span>
              <span>Friendly</span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max="100"
                value={styleValue}
                onChange={(e) => onStyleChange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #1e40af 0%,
                    #3b82f6 ${styleValue/2}%,
                    #60a5fa ${styleValue}%,
                    #93c5fd ${styleValue + (100-styleValue)/2}%,
                    #dbeafe 100%
                  )`,
                }}
              />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 text-center">Word Limit</h2>

        {/* Word Limit Input */}
        <div className="flex items-center space-x-4">
            
          <label className="flex-1 relative">
            <input
              type="number"
              value={wordLimit || ''}
              onChange={(e) => onWordLimitChange(e.target.value ? Number(e.target.value) : null)}
              placeholder="No word limit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              min="100"
              max="1000"
            />
            <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
              words
            </span>
          </label>
          <button
            onClick={() => onWordLimitChange(null)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }