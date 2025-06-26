'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { DeepSeek } from '@/lib/hfClient';
import AnalysisChart from '@/components/AnalysisChart';
import AnalysisMetrics from '@/components/AnalysisMetrics';
import type { User } from '@supabase/supabase-js';

type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

// Copy icon button with feedback
function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={`ml-2 p-1 rounded hover:bg-blue-700 text-xs text-white transition`}
      onClick={async e => {
        e.preventDefault();
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title="Copy to clipboard"
      aria-label="Copy post"
    >
      {copied ? (
        <span className="text-green-400 font-bold text-xs">Copied!</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="9" y="9" width="13" height="13" rx="2" fill="#2563eb" stroke="#fff" strokeWidth="2"/>
          <rect x="3" y="3" width="13" height="13" rx="2" fill="none" stroke="#fff" strokeWidth="2"/>
        </svg>
      )}
    </button>
  );
}

// Delete icon button
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      className="ml-2 p-1 rounded hover:bg-red-700 text-xs text-white transition"
      onClick={e => {
        e.preventDefault();
        onDelete();
      }}
      title="Delete post"
      aria-label="Delete post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke="#fff" strokeWidth="2" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
      </svg>
    </button>
  );
}

const personaOptions = [
  {
    value: "product promoter",
    label: (
      <span className="flex items-center gap-1">
        <span className="text-lg">🚀</span>
        <span>Product Promoter</span>
      </span>
    ),
  },
  {
    value: "enthusiast",
    label: (
      <span className="flex items-center gap-1">
        <span className="text-lg">💡</span>
        <span>Enthusiast</span>
      </span>
    ),
  },
];

function PersonaDropdown({
  persona,
  setPersona,
  disabled,
}: {
  persona: string;
  setPersona: (v: 'product promoter' | 'enthusiast') => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = personaOptions.find(opt => opt.value === persona);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#181c2a] to-[#201c42] text-white border border-blue-400/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none min-w-[180px] max-w-[220px] ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-blue-400"}`}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected?.label}
        <span className="ml-auto text-blue-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-[#181c2a] border border-blue-400/30 shadow-lg">
          {personaOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-white hover:bg-blue-900/30 transition ${persona === opt.value ? "bg-blue-900/20" : ""}`}
              onClick={() => {
                setPersona(opt.value as 'product promoter' | 'enthusiast');
                setOpen(false);
              }}
              disabled={disabled}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState('');
  const [persona, setPersona] = useState<'product promoter' | 'enthusiast'>('product promoter');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [dailyGenCount, setDailyGenCount] = useState(0);
  const [linkedinAccountName, setLinkedinAccountName] = useState('');
  type Metric = {
    id: string;
    post_url: string;
    likes: number;
    comments: number;
    posted_at: string;
    // add other fields if needed
  };
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const router = useRouter();

  // Fetch user and redirect if not logged in
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      if (!user) router.replace('/login');
    };
    getUser();
  }, [router]);

  // Fetch posts for the user
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) setError('Failed to load posts');
      else setPosts(data || []);
    };
    fetchPosts();
  }, [user]);

  // Fetch metrics for the user
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      const response = await fetch(`/api/metrics?user_id=${user.id}`);
      const data = await response.json();
      setMetrics(data);
    };
    fetchMetrics();
  }, [user]);

  // Calculate daily generation count (posts in last 24 hours)
  useEffect(() => {
    if (!posts.length) {
      setDailyGenCount(0);
      return;
    }
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const count = posts.filter(
      post => now - new Date(post.created_at).getTime() < DAY
    ).length;
    setDailyGenCount(count);
  }, [posts]);

  // Generate a new post
  const handleGeneratePost = async () => {
    if (!user || !prompt.trim() || dailyGenCount >= 3) return;
    setGenLoading(true);
    setError('');
    setGenerated('');
    try {
      const content = await DeepSeek.generate(prompt, persona);
      setGenerated(content);
      setShowGeneratedModal(true); // Show the modal
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error generating post');
      } else {
        setError('Error generating post');
      }
    }
    setGenLoading(false);
  };

  // Set Supabase token in Chrome extension storage
  useEffect(() => {
    const setExtensionToken = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token && typeof window !== "undefined" && "chrome" in window && chrome?.storage?.local) {
        chrome.storage.local.set({ supabase_token: token });
      }
    };

    setExtensionToken();
  }, []);

  // Save LinkedIn account name to Chrome storage
  const saveLinkedinName = () => {
    if (typeof window !== "undefined" && "chrome" in window && chrome?.storage?.local) {
      chrome.storage.local.set({ linkedinAccountName });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Get top 5 posts by likes + comments
  const topMetrics = [...metrics]
    .sort((a, b) => ((b.likes || 0) + (b.comments || 0)) - ((a.likes || 0) + (a.comments || 0)))
    .slice(0, 5);

  const now = new Date();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const recentMetrics = metrics
    .filter(m => m.posted_at) // filter out metrics without posted_at
    .map(m => ({
      ...m,
      posted_at: m.posted_at || "", // fallback to empty string if needed
    }))
    .filter(m => {
      const postDate = new Date(m.posted_at);
      return now.getTime() - postDate.getTime() <= THIRTY_DAYS;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32] py-12 px-4 flex items-center">
      <div className="mt-20 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent mb-4 md:mb-0">
            Dashboard
          </h1>
        </header>
        <h2 className="text-2xl font-bold text-white mb-6">
          Welcome back, {user?.user_metadata?.full_name || user?.email}! 👋
        </h2>
        {error && (
          <div className="text-red-400 mb-4">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#00a6ff]/10 to-[#00ff77]/5 border border-blue-400/20 shadow">
            <h3 className="text-xl font-semibold text-white mb-2">Your Recent Posts</h3>
            <ul className="text-gray-200 text-sm space-y-3">
              {posts.length === 0 ? (
                <li>No posts yet.</li>
              ) : (
                <>
                  {(showAllPosts ? posts : posts.slice(0, 1)).map(post => (
                    <li
                      key={post.id}
                      className="cursor-pointer flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 hover:bg-blue-900/20 transition group"
                      onClick={() => setActivePost(post)}
                    >
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 inline-block flex-shrink-0" />
                      <span className="flex-1 whitespace-pre-line break-words">
                        {post.content.slice(0, 80)}
                        {post.content.length > 80 ? "..." : ""}
                      </span>
                    </li>
                  ))}
                  {posts.length > 1 && (
                    <li>
                      <button
                        className="text-blue-400 hover:underline text-xs mt-2"
                        onClick={() => setShowAllPosts(v => !v)}
                      >
                        {showAllPosts ? "Show less" : `See more (${posts.length - 1} more)`}
                      </button>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#00ff77]/10 to-[#00a6ff]/5 border border-green-400/20 shadow">
            <h3 className="text-xl font-semibold text-white mb-2">Quick Actions</h3>
            
            {/* Modern LinkedIn Account Name Section */}
            <div className="w-full flex flex-col items-center mb-6">
              <label className="block text-white text-sm font-medium mb-1">
                LinkedIn Account Name
              </label>
              <div className="flex flex-col sm:flex-row w-full max-w-xs items-stretch sm:items-center bg-[#181c2a] border border-blue-400/30 rounded-lg px-3 py-2 shadow-inner gap-2">     
                <input
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-blue-300"
                  value={linkedinAccountName}
                  onChange={e => setLinkedinAccountName(e.target.value)}
                  placeholder="Enter your LinkedIn name"
                />
                <button
                  className="md:w-auto w-10 min-w-[60px] px-3 py-1 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow hover:from-cyan-400 hover:to-blue-600 transition text-sm"
                  onClick={saveLinkedinName}
                  type="button"
                >
                  Save
                </button>
              </div>
              <span className="text-xs text-blue-300 mt-1 text-center">
                Only posts from this LinkedIn account will be extracted.
              </span>
            </div>
            {/* End LinkedIn Account Name Section */}

            <div className="flex flex-col gap-3 items-center">
              {!showPrompt && (
                <button
                  className={`px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-600/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition ${
                    dailyGenCount >= 3 ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setShowPrompt(true)}
                  disabled={dailyGenCount >= 3}
                >
                  Generate New Post
                </button>
              )}
              {showPrompt && (
                <div className="w-full flex flex-col gap-2">
                  <textarea
                    className="w-full p-2 rounded bg-gray-900/30 outline-none resize-none text-white"
                    rows={3}
                    placeholder="Describe your post topic (e.g. 'SaaS marketing tips')"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    disabled={genLoading || dailyGenCount >= 3}
                  />
                  <div className="mb-2 flex items-center gap-3">
                    <label className="text-white font-medium">Persona</label>
                    <PersonaDropdown persona={persona} setPersona={setPersona} disabled={genLoading || dailyGenCount >= 3} />
                  </div>
                  <button
                    className={`px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-600/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition self-center ${
                      dailyGenCount >= 3 ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={handleGeneratePost}
                    disabled={genLoading || !prompt.trim() || dailyGenCount >= 3}
                  >
                    {genLoading ? 'Generating...' : 'Generate'}
                  </button>
                  <button
                    className="font-semibold self-center px-3 py-1.5 bg-gray-300/30 rounded-full text-gray-200 hover:gray-500 hover:scale-105 transition cursor-pointer mt-1"
                    onClick={() => { setShowPrompt(false); setPrompt(''); }}
                    disabled={genLoading}
                  >
                    Cancel
                  </button>
                  {dailyGenCount >= 3 && (
                    <div className="text-pink-400 text-xs text-center mt-2">
                      You have reached your daily post generation limit. Try again in 24 hours.
                    </div>
                  )}
                </div>
              )}
              <button
                className="px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-400/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition"
                onClick={() => setShowExtensionModal(true)}
                disabled
              >
                Download Chrome Extension
              </button>
              <button
                className="px-3 py-1.5 mt-3 rounded-full bg-white/10 text-pink-200 font-semibold border border-pink-400/20 hover:bg-white/20 transition cursor-pointer"
                onClick={() => router.push("/pricing")}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#201c42] to-[#0e0b25] border border-blue-400/20 shadow">
          <h3 className="text-xl font-semibold text-white mb-4">LinkedIn Post Metrics</h3>
          <AnalysisMetrics metrics={metrics} />
          <AnalysisChart metrics={recentMetrics} />

          {/* Top posts section */}
          <div className="mb-4">
            {topMetrics.length > 0 && (
              <div className="text-2xl font-semibold text-yellow-300 mb-2">
                Your all time top posts 🔥
              </div>
            )}
            <ul className="space-y-4">
              {topMetrics.length === 0 ? (
                <li>No posts yet.</li>
              ) : (
                topMetrics.map((metric: Metric) => (
                  <li key={metric.id} className="p-4 rounded bg-gray-900/60 text-white flex items-center justify-between">
                    <div>
                      <div className="mb-2 break-all">
                        <a
                          href={metric.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline break-all font-semibold"
                        >
                          View Post
                        </a>
                      </div>
                      <div>
                        👍 {metric.likes} &nbsp; 💬 {metric.comments}
                      </div>
                      <div className="text-xs mt-5 text-gray-400">
                        {metric.posted_at && !isNaN(new Date(metric.posted_at).getTime())
                          ? new Date(metric.posted_at).toLocaleString()
                          : ''}
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 rounded bg-red-500 hover:bg-red-600 transition text-white"
                      title="Delete metric"
                      onClick={async () => {
                        await supabase.from('post_metrics').delete().eq('id', metric.id);
                        setMetrics(metrics => metrics.filter((m: Metric) => m.id !== metric.id));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke="#fff" strokeWidth="2" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActivePost(null)}
          />
          <div className="relative z-10 bg-[#181c2a] rounded-xl p-6 max-w-lg w-full shadow-2xl border border-blue-400/30 scrollbar-none min-h-[400px] md:min-h-[500px] flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={() => setActivePost(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Saved Post</h3>
            <textarea
              className="w-full overflow-y-auto resize-none p-2 rounded bg-gray-900/60 text-white mb-4 flex-1"
              rows={14}
              value={activePost.content}
              readOnly
            />
            <div className="flex gap-2">
              <CopyButton content={activePost.content} />
              <DeleteButton
                onDelete={async () => {
                  await supabase.from('posts').delete().eq('id', activePost.id);
                  setPosts(posts => posts.filter((p: Post) => p.id !== activePost.id));
                  setActivePost(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {showGeneratedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGeneratedModal(false)}
          />
          <div className="relative z-10 bg-[#181c2a] rounded-xl p-6 max-w-lg w-full shadow-2xl border border-blue-400/30 min-h-[400px] md:min-h-[500px] flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowConfirmClose(true)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Generated Post</h2>
            <textarea
              className="w-full mt-2 p-2 rounded bg-gray-900/60 text-white mb-4 flex-1 resize-none overflow-y-auto"
              rows={10}
              style={{ maxHeight: "300px" }}
              value={generated}
              onChange={e => setGenerated(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00a6ff] to-[#00ff77] text-white font-semibold shadow hover:scale-105 transition text-sm"
                onClick={async () => {
                  setGenLoading(true);
                  setError('');
                  try {
                    const { error } = await supabase.from('posts').insert([
                      { user_id: user!.id, content: generated, created_at: new Date().toISOString() }
                    ]);
                    if (error) throw error;
                    // Refresh posts
                    const { data: newPosts } = await supabase
                      .from('posts')
                      .select('*')
                      .eq('user_id', user!.id)
                      .order('created_at', { ascending: false });
                    setPosts(newPosts || []);
                    setGenerated('');
                    setPrompt('');
                    setShowPrompt(false);
                    setShowGeneratedModal(false);
                  } catch (err) {
                    if (err instanceof Error) {
                      setError(err.message || 'Error saving post');
                    } else {
                      setError('Error saving post');
                    }
                  }
                  setGenLoading(false);
                }}
                disabled={genLoading || !generated.trim()}
              >
                {genLoading ? 'Saving...' : 'Save Final Post'}
              </button>
              <button
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00ff77] to-[#00a6ff] text-white font-semibold shadow hover:scale-105 transition text-sm"
                onClick={handleGeneratePost}
                disabled={genLoading}
              >
                {genLoading ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
          {showConfirmClose && (
            <div className="fixed inset-0 z-60 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative z-10 bg-[#181c2a] rounded-xl p-6 max-w-sm w-full shadow-2xl border border-blue-400/30">
                <h3 className="text-lg font-bold text-white mb-2">Are you sure?</h3>
                <p className="text-gray-300 mb-4">
                  If you close this window without saving or regenerating, your generated post will be lost.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    className="px-3 py-1.5 rounded-full bg-gray-700"
                    onClick={() => setShowConfirmClose(false)}
                  >
                    Go Back
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition text-sm"
                    onClick={() => {
                      setShowConfirmClose(false);
                      setShowGeneratedModal(false);
                      setGenerated('');
                    }}
                  >
                    Close Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExtensionModal(false)}
          />
          <div className="relative z-10 bg-[#181c2a] rounded-xl p-6 max-w-md w-full shadow-2xl border border-blue-400/30">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowExtensionModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Install Chrome Extension</h2>
            <ol className="list-decimal list-inside text-gray-200 mb-4 space-y-2">
              <li>
                <a
                  href="http://localhost:3000/extension.zip"
                  className="text-blue-400 underline"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download the extension (.zip)
                </a>
              </li>
              <li>Unzip the downloaded file.</li>
              <li>Go to <span className="bg-gray-800 px-1 rounded text-white">chrome://extensions</span> in Chrome.</li>
              <li>Enable <b>Developer Mode</b> (top right).</li>
              <li>Click <b>Load Unpacked</b> and select the unzipped folder.</li>
            </ol>
            <div className="flex justify-end">
              <button
                className="px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setShowExtensionModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}