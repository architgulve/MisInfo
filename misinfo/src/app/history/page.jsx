"use client";
import React from "react";

const debates = [
  {
    id: 1,
    title: "AI will replace most human jobs by 2030",
    duration: "45 secs",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2024",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 2,
    title: "Social media should be regulated like traditional media",
    duration: "38 secs",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
  {
    id: 3,
    title: "Iphone is better than Android",
    duration: "54 secs",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2025",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 4,
    title: "India is best Cricket Team",
    duration: "32 secs",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
  {
    id: 5,
    title: "AI will replace most human jobs by 2030",
    duration: "45 secs",
    participants: 156,
    arguments: 24,
    date: "Jan 15, 2024",
    result: "Pro Won",
    resultColor: "bg-green-500",
  },
  {
    id: 6,
    title: "Social media should be regulated like traditional media",
    duration: "38 secs",
    participants: 89,
    arguments: 18,
    date: "Jan 14, 2024",
    result: "Con Won",
    resultColor: "bg-red-500",
  },
];

export default function DebateHistory() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-[#212121]">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          DebateBot Arena
        </h1>
        <nav className="flex gap-10">
          <button className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </button>
          <button
            onClick={() => (window.location.href = "/trending_topics")}
            className="text-white text-xl hover:text-black hover:bg-gray-200 rounded-lg px-4 py-1"
          >
            Topics
          </button>
          <button
            onClick={() => (window.location.href = "/history")}
            className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1"
          >
            History
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 text-black text-bold px-4 py-2 rounded-lg hover:bg-[#181818] hover:text-white"
          >
            New Debate
          </button>
        </nav>
      </header>

      {/* Debate History Section */}
      <main className="max-w-full bg-[#181818] mx-auto px-6 py-8 space-x-3">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ">
          Debate History
        </h2>
        <p className="text-gray-400 text-xl mb-6">
          Explore past debates and their outcomes
        </p>

        <div className="space-y-6">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className="bg-[#212121] p-4 rounded-lg shadow-smshadow-blue-400 hover:bg-[#0F1D50] transition duration-200 ease-in-out space-y-6"
            >
              {/* Title + Result */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl text-gray-200 font-semibold">
                  {debate.title}
                </h3>
                <span
                  className={`px-2 py-0.5 text-212121 rounded-md text-md ${debate.resultColor}`}
                >
                  {debate.result}
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-4 gap-3 text-lg text-gray-300 my-3">
                <span>⏱ {debate.duration}</span>
                <span>👥 {debate.participants} participants</span>
                <span>💬 {debate.arguments} arguments</span>
                <span>🏆 {debate.date}</span>
              </div>

              {/* Agents + Button */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 bg-green-600 text-green-200 rounded-md text-lg">
                    Pro Agent
                  </span>
                  <span className="text-gray-400 text-sm">vs</span>
                  <span className="px-2 py-0.5 bg-red-600 text-red-200 rounded-md text-lg">
                    Con Agent
                  </span>
                </div>
                <button className="border px-3 py-1 rounded-md text-lg text-gray-600 hover:bg-gray-100">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
