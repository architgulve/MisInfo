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
      <div className="rounded-2xl border border-gray-200 bg-[#121212] shadow-md p-4">
        {/* Argument text */}
        <p className="text-gray-200 font-semibold mb-3 leading-relaxed">
          {argument}
        </p>

        {/* Source */}
        {source && (
          <div className="flex items-center text-sm text-blue-200 hover:underline mb-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="text-blue-200">Source: {source}</span>
          </div>
        )}

        {/* Reliability */}
        {reliability && (
          <div className="text-sm text-[#ffffff79]">
            Reliability: {reliability}%
          </div>
        )}
      </div>
    </motion.div>
  );
}
