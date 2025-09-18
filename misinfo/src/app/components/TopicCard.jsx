import React from "react";

function TopicCard({
  category,
  categoryColor,
  title,
  description,
  debates,
  timeAgo,
  trend,
}) {
  return (
    <div className="bg-[#010E30] rounded-xl shadow-md hover:shadow-blue-400 transition p-5 space-y-3">
      {/* Category */}
      <div className="flex justify-between items-center"> 
        <span
          className={`px-3 py-1 text-md font-medium rounded-full text-white ${categoryColor}`}
        >
          {category}
        </span>
        <div className="flex items-center text-gray-400 space-x-1">
          <span>{trend}%</span>
          <span className="text-blue-500">▲</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl mt-4 text-gray-300 font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-gray-500 text-lg">{description}</p>

      {/* Info Row */}
      <div className="flex space-x-3 items-center text-gray-400 text-md mt-4">
        <div className="flex items-center space-x-2">
          <span>💬</span>
          <span>{debates} debates</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>⏱</span>
          <span>{timeAgo}</span>
        </div>
      </div>
      {/* Button */}
      <button className="w-full mt-3 bg-blue-600 font-bold text-[#0F1D50] py-2 rounded-lg hover:bg-blue-700 transition">
        Start Debate
      </button>
    </div>
  );
}

export default TopicCard;
