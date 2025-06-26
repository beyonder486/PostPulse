import React, { useMemo, useState } from "react";

type Metric = {
  posted_at: string;
  likes: number;
  comments: number;
};

type Props = {
  metrics: Metric[];
};

function calcEngagement(metrics: Metric[]) {
  if (metrics.length === 0) return { avg: 0, totalLikes: 0, totalComments: 0 };
  const totalLikes = metrics.reduce((sum, m) => sum + (m.likes || 0), 0);
  const totalComments = metrics.reduce((sum, m) => sum + (m.comments || 0), 0);
  const avg = (totalLikes + totalComments) / metrics.length; // per post
  return { avg, totalLikes, totalComments };
}

function calcChange(current: number, prev: number) {
  if (prev === 0) return current === 0 ? 0 : 100;
  return ((current - prev) / prev) * 100;
}

function getSteadyEngagement(metrics: number[], trimPercent = 10) {
  if (metrics.length === 0) return 0;
  const sorted = [...metrics].sort((a, b) => a - b);
  const trimCount = Math.floor(metrics.length * (trimPercent / 100));
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  if (trimmed.length === 0) return 0;
  const total = trimmed.reduce((sum, value) => sum + value, 0);
  return Math.round(total / trimmed.length);
}

export default function AnalysisMetrics({ metrics }: Props) {
  const [period, setPeriod] = useState<7 | 30>(7);

  // Sort metrics by date descending
  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()),
    [metrics]
  );

  // Use today as the end of the period (not the most recent post)
  const periodEnd = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999); // end of today
    return d;
  }, []);

  const periodStart = useMemo(() => {
    const d = new Date(periodEnd);
    d.setDate(periodEnd.getDate() - period + 1);
    d.setHours(0, 0, 0, 0); // start of day
    return d;
  }, [period, periodEnd]);

  const prevPeriodEnd = useMemo(() => {
    const d = new Date(periodStart);
    d.setDate(periodStart.getDate() - 1);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [periodStart]);

  const prevPeriodStart = useMemo(() => {
    const d = new Date(prevPeriodEnd);
    d.setDate(prevPeriodEnd.getDate() - period + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [prevPeriodEnd, period]);

  // Current period metrics
  const currentMetrics = useMemo(() =>
    sortedMetrics.filter(m => {
      const d = new Date(m.posted_at);
      return d >= periodStart && d <= periodEnd;
    }), [sortedMetrics, periodStart, periodEnd]
  );

  // Previous period metrics
  const prevMetrics = useMemo(() =>
    sortedMetrics.filter(m => {
      const d = new Date(m.posted_at);
      return d >= prevPeriodStart && d <= prevPeriodEnd;
    }), [sortedMetrics, prevPeriodStart, prevPeriodEnd]
  );

  const { avg: avgEngagement, totalLikes, totalComments } = calcEngagement(currentMetrics);
  const { avg: prevAvg, totalLikes: prevLikes, totalComments: prevComments } = calcEngagement(prevMetrics);

  const engagementChange = calcChange(avgEngagement, prevAvg);
  const likesChange = calcChange(totalLikes, prevLikes);
  const commentsChange = calcChange(totalComments, prevComments);

  // Calculate daily engagement values for the current period
  const dailyEngagements = Array.from({ length: period }, (_, i) => {
    const dayStart = new Date(periodEnd);
    dayStart.setDate(periodEnd.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Sum likes+comments for posts on this day
    const daySum = currentMetrics
      .filter(m => {
        const d = new Date(m.posted_at);
        return d >= dayStart && d < dayEnd;
      })
      .reduce((sum, m) => sum + (m.likes || 0) + (m.comments || 0), 0);

    return daySum;
  }).reverse(); // so days are in chronological order

  const steadyEngagement = getSteadyEngagement(dailyEngagements);

  // Calculate steady engagement for previous period
  const prevDailyEngagements = Array.from({ length: period }, (_, i) => {
    const dayStart = new Date(prevPeriodEnd);
    dayStart.setDate(prevPeriodEnd.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Sum likes+comments for posts on this day
    const daySum = prevMetrics
      .filter(m => {
        const d = new Date(m.posted_at);
        return d >= dayStart && d < dayEnd;
      })
      .reduce((sum, m) => sum + (m.likes || 0) + (m.comments || 0), 0);

    return daySum;
  }).reverse();

  const prevPostEngagements = prevMetrics.map(m => (m.likes || 0) + (m.comments || 0));
  const prevSteadyEngagement = getSteadyEngagement(prevPostEngagements);
  const steadyEngagementChange = calcChange(steadyEngagement, prevSteadyEngagement);

  return (
    <div className="bg-[#181c2a] rounded-xl p-6 shadow-lg border border-blue-400/20 max-w-6xl mb-5 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-xl font-bold text-white">Engagement Analytics</h2>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              period === 7 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => setPeriod(7)}
          >
            7 Days
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              period === 30 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => setPeriod(30)}
          >
            30 Days
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#232946] rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Avg. Engagement / post</span>
          <span className="text-2xl font-bold text-[#00ff77]">{avgEngagement.toFixed(2)}</span>
          <span className={`text-xs mt-1 ${engagementChange >= 0 ? "text-green-400" : "text-pink-400"}`}>
            {engagementChange >= 0 ? "▲" : "▼"} {Math.abs(engagementChange).toFixed(1)}% vs prev
          </span>
        </div>
        <div className="bg-[#232946] rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Total Likes</span>
          <span className="text-2xl font-bold text-blue-400">{totalLikes}</span>
          <span className={`text-xs mt-1 ${likesChange >= 0 ? "text-green-400" : "text-pink-400"}`}>
            {likesChange >= 0 ? "▲" : "▼"} {Math.abs(likesChange).toFixed(1)}% vs prev
          </span>
        </div>
        <div className="bg-[#232946] rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Total Comments</span>
          <span className="text-2xl font-bold text-pink-400">{totalComments}</span>
          <span className={`text-xs mt-1 ${commentsChange >= 0 ? "text-green-400" : "text-pink-400"}`}>
            {commentsChange >= 0 ? "▲" : "▼"} {Math.abs(commentsChange).toFixed(1)}% vs prev
          </span>
        </div>
        <div className="bg-[#232946] rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Steady Engagement / post</span>
          <span className="text-2xl font-bold text-yellow-300">{steadyEngagement}</span>
          <span className={`text-xs mt-1 ${steadyEngagementChange >= 0 ? "text-green-400" : "text-pink-400"}`}>
            {steadyEngagementChange >= 0 ? "▲" : "▼"} {Math.abs(steadyEngagementChange).toFixed(1)}% vs prev
          </span>
          <span className="text-xs mt-1 text-gray-400">Trimmed mean (excludes outliers)</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-4 text-center">
        Engagement per post = (Likes + Comments) / Number of posts in period
      </div>
    </div>
  )
}