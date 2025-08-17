import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Upload" className="w-12 h-12 text-primary-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No files uploaded yet
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Your uploaded files will appear here. Drag and drop files or click the upload button to get started.
      </p>

      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Upload Your First File
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;