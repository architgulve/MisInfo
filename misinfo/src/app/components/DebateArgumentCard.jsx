import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function DebateArgumentCard({
  argument,
  source,
  reliability,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="mb-3"
    >
      <div className="rounded-2xl border border-gray-200 bg-[#11246E] shadow-md p-4">
        {/* Argument text */}
        <p className="text-gray-200 text-semibold mb-3 leading-relaxed">
          {argument}
        </p>

        {/* Source */}
        <div className="flex items-center text-sm text-blue-200 hover:underline">
          <ExternalLink className="w-4 h-4 mr-2" />
          {source?.url ? (
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.name}
            </a>
          ) : (
            <span>{source?.name}</span>
          )}
          {reliability && (
            <span className="ml-2 text-gray-200">
              (Reliability: {reliability}%)
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
