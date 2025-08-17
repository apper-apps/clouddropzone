import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Progress from "@/components/atoms/Progress";
import FilePreview from "@/components/molecules/FilePreview";

const FileUploadProgress = ({ file, onCancel }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusColor = () => {
    switch (file.status) {
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "uploading":
        return "text-primary-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case "completed":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "uploading":
        return "Loader2";
      default:
        return "Clock";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-3">
        <FilePreview file={file} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${getStatusColor()}`}>
                {file.status === "uploading" ? `${file.uploadProgress}%` : file.status}
              </span>
              {file.status === "uploading" && (
                <ApperIcon 
                  name={getStatusIcon()} 
                  className={`w-3 h-3 ${getStatusColor()} animate-spin`} 
                />
              )}
              {file.status === "completed" && (
                <ApperIcon name={getStatusIcon()} className={`w-3 h-3 ${getStatusColor()}`} />
              )}
              {file.status === "error" && (
                <ApperIcon name={getStatusIcon()} className={`w-3 h-3 ${getStatusColor()}`} />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{formatFileSize(file.size)}</span>
            {file.status === "uploading" && onCancel && (
              <button
                onClick={() => onCancel(file.Id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          
          {file.status === "uploading" && (
            <Progress value={file.uploadProgress} className="h-1.5" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploadProgress;