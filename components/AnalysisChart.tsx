'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, Area
} from 'recharts';

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-[#181c2a] border border-[#00ff77] rounded p-3 text-sm text-white shadow-lg min-w-[120px]">
      <div className="font-bold mb-1">{label}</div>
      <div>Likes: <span className="text-blue-400">{data?.Likes ?? 0}</span></div>
      <div>Comments: <span className="text-pink-400">{data?.Comments ?? 0}</span></div>
      <div>Engagement: <span className="text-green-400">{data?.Total ?? 0}</span></div>
    </div>
  );
};

export default function AnalysisChart({ metrics }: { metrics: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [activeChart, setActiveChart] = useState<'bar' | 'line'>('bar');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null; // or a loader/spinner

  if (!metrics || metrics.length === 0) return null;

  const reversedMetrics=[...metrics].reverse()

  const chartData = reversedMetrics.map((m, i) => ({
    name: `Post ${i + 1}`,
    Likes: m.likes,
    Comments: m.comments,
  }));

  const timeData = [...metrics]
    .filter(m => m.posted_at)
    .sort((a, b) => new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime())
    .map(m => ({
      date: new Date(m.posted_at).toLocaleDateString(),
      Likes: m.likes || 0,
      Comments: m.comments || 0,
      Total: (m.likes || 0) + (m.comments || 0),
    }));

  return (
    <div className="mb-8 p-4 rounded relative overflow-hidden" style={{ background: "#181c2a" }}>
      {/* Glow/fade overlay at the bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(35,41,70,0) 0%, #232946 100%)",
          zIndex: 1,
        }}
      />
      <div className="relative z-10">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeChart === 'bar' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'} cursor-pointer`}
            onClick={() => setActiveChart('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`px-4 py-2 rounded ${activeChart === 'line' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'} cursor-pointer`}
            onClick={() => setActiveChart('line')}
          >
            Line Graph
          </button>
        </div>

        {activeChart === 'bar' && (
          <div className="chart-scroll" style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ width: Math.max(chartData.length * 60, 600) }}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ff77" />
                      <stop offset="100%" stopColor="#009966" />
                    </linearGradient>
                    <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00a6ff" />
                      <stop offset="100%" stopColor="#005577" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0 5" />
                  <XAxis dataKey="name" tick={{ fill: "#fff", dy: 10 }} interval={4} />
                  <YAxis tick={{ fill: "#fff" }} />
                  <Tooltip contentStyle={{ background: "#181c2a", border: "1px solid #333", color: "#fff" }} />
                  <Legend />
                  <Bar
                    dataKey="Likes"
                    fill="url(#likesGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="Comments"
                    fill="url(#commentsGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'line' && timeData.length > 1 && (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={timeData}>
              <defs>
                <linearGradient id="totalGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4bf288" stopOpacity={0.8} />
                  <stop offset="40%" stopColor="#00ff77" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#232946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" strokeOpacity={0.06} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "#fff",
                  fontWeight: 600,
                  fontSize: 12,
                  dy: 12,
                }}
                axisLine={false}
                tickLine={false}
                interval={isMobile ? 0 : "equidistantPreserveStart"}
                tickFormatter={
                  isMobile
                    ? (_value, index) => (index === 0 ? "Time" : "")
                    : undefined
                }
              />
              <YAxis
                tick={{ fill: "#00ff77", fontWeight: 600, fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="none"
                fill="url(#totalGlow)"
                fillOpacity={1}
                isAnimationActive={false}
                tooltipType="none"
              />
              <Line
                type="monotone"
                dataKey="Total"
                name="Engagement"
                stroke="#00ff77"
                strokeWidth={3.5}
                dot={false}
                activeDot={{ r: 6, fill: "#00ff77", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}