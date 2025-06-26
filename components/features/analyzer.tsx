export default function FeatureAnalyzer() {
  return (
    <div className="bg-gray-800/60 rounded-xl p-6 shadow-lg max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold text-white mb-2">🔍 Engagement Analyzer</h2>
      <p className="text-gray-300 mb-4">
        Dive deep into your post performance. Instantly analyze which topics, tones, and formats drive the most engagement—so you can double down on what works.
      </p>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl text-green-400 font-bold">+32%</span>
          <span className="text-xs text-gray-400 mt-1">More Comments</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl text-blue-400 font-bold">+21%</span>
          <span className="text-xs text-gray-400 mt-1">More Likes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl text-yellow-400 font-bold">+15%</span>
          <span className="text-xs text-gray-400 mt-1">More Shares</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-4 block">
        Get actionable insights to boost your LinkedIn presence.
      </span>
    </div>
  );
}