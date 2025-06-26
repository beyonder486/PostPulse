export default function FeatureMetrics() {
  return (
    <div className="bg-gray-800/60 rounded-xl p-6 shadow-lg max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold text-white mb-2">📊 Post Metrics</h2>
      <p className="text-gray-300 mb-4">
        Instantly see which of your LinkedIn posts generate the most responses — from likes and comments to shares and saves.

PostPulse breaks down your post performance with clean, visual analytics that help you spot what's working and what’s not.

Track engagement trends over time, compare results across different content types, and uncover exactly what resonates with your audience.

Use these insights to fine-tune your content strategy, double down on what works, and grow with confidence — one post at a time.
      </p>
      <div className="w-full flex justify-center">
        {/* Example bar chart visualization */}
        <div className="flex gap-2 items-end h-20">
          <div className="w-6 rounded-t h-8" style={{
            background: "linear-gradient(180deg, #00a6ff 0%, #00ff77 100%)"
          }}></div>
          <div className="w-6 rounded-t h-16" style={{
            background: "linear-gradient(180deg, #00a6ff 0%, #00ff77 100%)"
          }}></div>
          <div className="w-6 rounded-t h-10" style={{
            background: "linear-gradient(180deg, #00a6ff 0%, #00ff77 100%)"
          }}></div>
          <div className="w-6 rounded-t h-6" style={{
            background: "linear-gradient(180deg, #00a6ff 0%, #00ff77 100%)"
          }}></div>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-2 block">Top performing posts at a glance</span>
    </div>
  )}