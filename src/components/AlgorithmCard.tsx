import { motion } from "framer-motion";
import { Algorithm } from "@/data/algorithms";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onClick: (algorithmId: string) => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl dark:hover:shadow-gray-900/50"
      onClick={() => onClick(algorithm.id)}
    >
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {algorithm.name.charAt(0)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {algorithm.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {algorithm.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={algorithm.hasCode}
                readOnly
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Code</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={algorithm.hasQuiz}
                readOnly
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Quiz</span>
            </label>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {algorithm.complexity.time}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 