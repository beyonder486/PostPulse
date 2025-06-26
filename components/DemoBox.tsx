'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function getDeviceId() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  return id;
}

export default function DemoBox() {
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [genCount, setGenCount] = useState<number>(0);
  const router = useRouter();

  // Load generation count from localStorage on mount
  useEffect(() => {
    const count = Number(localStorage.getItem('demoGenCount') || '0');
    setGenCount(count);
  }, []);

  const handleGenerate = async () => {
    const deviceId = getDeviceId();
    if (genCount >= 3) {
      router.push('/signup');
      return;
    }
    setIsGenerating(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, deviceId }),
      });
      const data = await res.json();
      if (data.error === 'limit') {
        router.push('/signup');
        return;
      }
      setOutput(data.content || data.error || 'No response from AI');
      // Increment generation count
      const newCount = genCount + 1;
      setGenCount(newCount);
      localStorage.setItem('demoGenCount', String(newCount));
    } catch (err) {
      setOutput('Error connecting to AI service.');
    }
    setIsGenerating(false);
  };

  return (
    <div className="mt-15 md:mt-32 mx-auto max-w-2xl bg-gradient-to-br from-[#181c2a] via-[#232946] to-[#181c2a] border border-blue-400/20 shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-2 tracking-tight">
        Try the LinkedIn Post Generator!
      </h2>
      <p className="text-center text-blue-200 mb-6 text-sm md:text-base">
        Describe your niche or product and get a scroll-stopping LinkedIn post in
        seconds.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your niche (e.g., 'SaaS marketing')"
        className="w-full bg-[#232946] text-white p-4 rounded-lg outline-none mb-4 min-h-[100px] border border-blue-400/20 focus:border-blue-400 transition resize-none"
      />
      <button
        onClick={handleGenerate}
        disabled={isGenerating || genCount >= 3}
        className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 cursor-pointer
          ${
            isGenerating || genCount >= 3
              ? 'bg-blue-900 text-blue-300 opacity-60 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white hover:from-[#00A0DC] hover:to-[#0077B5] shadow-lg hover:scale-105'
          }`}
      >
        {genCount >= 3
          ? 'Sign up to continue'
          : isGenerating
          ? 'Generating...'
          : 'Generate Post →'}
      </button>
      <p className="text-blue-300 text-center text-sm mt-3">
        {genCount < 3
          ? `✨ ${3 - genCount} free post${
              3 - genCount === 1 ? '' : 's'
            } left.`
          : 'You have reached your free post limit.'}
      </p>
      {output && (
        <div className="mt-8 p-6 bg-[#181c2a] border border-blue-400/10 rounded-xl text-white whitespace-pre-line shadow-lg relative">
          <span className="absolute -top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
            AI Output
          </span>
          {output}
          <div className="mt-6 text-xs text-blue-300 text-center border-t border-gray-700 pt-3">
            <span>
              <strong>Want to edit or regenerate your post?</strong> <br />
              <a
                href="/signup"
                className="underline hover:text-blue-400 transition"
              >
                Sign up
              </a>{' '}
              to unlock editing and regeneration features!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}