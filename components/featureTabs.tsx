"use client";

import { useState } from "react";
import PostGenerator from "./features/postGenerator";
import Analyzer from "./features/analyzer";
import Editor from "./features/editor";
import Metrics from "./features/metrics";

const TABS = [
  { id: "generator", name: "Post Generator" },
  { id: "analyzer", name: "Analyzer" },
  { id: "editor", name: "Templates" },
  { id: "metrics", name: "Metrics" },
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 flex flex-col items-center">
      {/* Tab Navigation */}
      <div className="mb-4 w-full md:w-xl">
        <div
          className="
            grid grid-cols-2 gap-2 w-full
            bg-gradient-to-r from-[#181c2a] via-[#201c42] to-[#1f1f32]
            rounded-2xl px-1 py-2 shadow border border-blue-400/20
            md:flex md:justify-center md:rounded-full md:px-2 md:py-3 md:gap-2
          "
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full md:w-auto
                px-3 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-colors outline-none
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-teal-400/40 text-white shadow"
                    : "text-gray-200 hover:bg-white/10 hover:text-white cursor-pointer"
                }
                whitespace-nowrap
              `}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 w-full">
        {activeTab === "generator" && (
          <div className="bg-gray-800/60 rounded-xl p-4 md:p-6 shadow-lg">
            <PostGenerator />
          </div>
        )}
        {activeTab === "analyzer" && (
          <div className="bg-gray-800/60 rounded-xl p-4 md:p-6 shadow-lg">
            <Analyzer />
          </div>
        )}
        {activeTab === "editor" && (
          <div className="bg-gray-800/60 rounded-xl p-4 md:p-6 shadow-lg">
            <Editor />
          </div>
        )}
        {activeTab === "metrics" && (
          <div className="bg-gray-800/60 rounded-xl p-4 md:p-6 shadow-lg">
            <Metrics />
          </div>
        )}
      </div>
    </div>
  );
}
