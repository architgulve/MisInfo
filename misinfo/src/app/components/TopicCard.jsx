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
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3">
      {/* Category */}
      <div className="flex justify-between items-center"> 
        <span
          className={`px-3 py-1 text-md font-medium rounded-full text-white ${categoryColor}`}
        >
          {category}
        </span>
        <div className="flex items-center text-gray-500 space-x-1">
          <span>{trend}%</span>
          <span className="text-blue-500">▲</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl mt-3 text-gray-700 font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-gray-500 text-lg">{description}</p>

      {/* Info Row */}
      <div className="flex space-x-3 items-center text-gray-500 text-md mt-3">
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
      <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Start Debate
      </button>
    </div>
  );
}

export default TopicCard;
