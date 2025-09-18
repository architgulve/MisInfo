"use client";
import React from "react";
import TopicCard from "../components/TopicCard";

function TrendingTopics() {
  const topics = [
    {
      category: "Technology",
      categoryColor: "bg-blue-600 text-blue-700",
      title: "AI Ethics and Regulation",
      description:
        "Should artificial intelligence development be heavily regulated?",
      debates: 12,
      timeAgo: "2 hours ago",
      trend: 89,
    },
    {
      category: "Environment",
      categoryColor: "bg-green-600 text-green-700",
      title: "Climate Change Solutions",
      description:
        "Are renewable energy sources sufficient to combat climate change?",
      debates: 8,
      timeAgo: "4 hours ago",
      trend: 76,
    },
    {
      category: "Economics",
      categoryColor: "bg-red-600 text-red-700",
      title: "Universal Basic Income",
      description: "Would UBI solve economic inequality or create dependency?",
      debates: 15,
      timeAgo: "1 hour ago",
      trend: 92,
    },
    {
      category: "Science",
      categoryColor: "bg-blue-400 text-purple-700",
      title: "Space Exploration Funding",
      description:
        "Should governments prioritize space exploration over Earth problems?",
      debates: 6,
      timeAgo: "6 hours ago",
      trend: 64,
    },
    {
      category: "Technology",
      categoryColor: "bg-blue-500 text-blue-700",
      title: "Social Media Privacy",
      description:
        "Do social media platforms have too much access to personal data?",
      debates: 11,
      timeAgo: "3 hours ago",
      trend: 85,
    },
    {
      category: "Education",
      categoryColor: "bg-yellow-500 text-yellow-700",
      title: "Education System Reform",
      description:
        "Should traditional education be replaced with personalized learning?",
      debates: 9,
      timeAgo: "5 hours ago",
      trend: 71,
    },
  ];

  return (
    <div className="min-h-screen bg-[#010E30]">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-[#010E30]">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">DebateBot Arena</h1>
        <nav className="flex gap-10">
          <button className="text-white text-xl hover:text-black  hover:bg-gray-200 rounded-lg px-4 py-1"
          onClick={() => (window.location.href = "/")}>
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
            className="bg-gray-200 text-black text-bold px-4 py-2 rounded-lg hover:bg-[#020817] hover:text-white"
          >
            New Debate
          </button>
        </nav>
      </header>
      <div className="max-w-full bg-[#020817] max-h-full px-4 py-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Trending Topics
        </h2>
        <p className="text-gray-400 mb-8 text-2xl">
          Discover popular debate topics and join the conversation
        </p>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {topics.map((topic, index) => (
            <TopicCard key={index} {...topic} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendingTopics;
