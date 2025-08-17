import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-500 mx-auto mb-4"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-primary-300 mx-auto"></div>
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading files...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
      </motion.div>
    </div>
  );
};

export default Loading;