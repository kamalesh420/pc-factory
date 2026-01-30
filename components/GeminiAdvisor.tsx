import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { PCComponent } from '../types';
import { analyzeBuild } from '../services/geminiService';

interface GeminiAdvisorProps {
  components: PCComponent[];
  tierName: string;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ components, tierName }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Reset analysis when tier changes, but don't auto-fetch to save tokens/money unless desired
  useEffect(() => {
    setAnalysis("");
    setHasLoaded(false);
  }, [tierName]);

  const handleConsult = async () => {
    setLoading(true);
    const result = await analyzeBuild(components, tierName);
    setAnalysis(result);
    setLoading(false);
    setHasLoaded(true);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">HonestPC AI Advisor</h3>
          <p className="text-xs text-slate-500">Powered by Gemini</p>
        </div>
      </div>

      {!hasLoaded && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-600 mb-3">
            Want a second opinion? Ask our AI to explain why this build is perfect for you.
          </p>
          <button 
            onClick={handleConsult}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Sparkles size={16} />
            Analyze Build Value
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 text-blue-600">
          <Loader2 className="animate-spin" size={24} />
          <span className="ml-2 text-sm font-medium">Analyzing hardware quality...</span>
        </div>
      )}

      {analysis && !loading && (
        <div className="prose prose-sm text-slate-700 bg-white p-4 rounded-lg border border-blue-100 shadow-sm animate-fade-in">
          <p className="whitespace-pre-line leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
};