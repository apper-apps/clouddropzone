import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FileUploadProgress from "@/components/molecules/FileUploadProgress";

const UploadQueue = ({ files, onCancelUpload }) => {
  if (files.length === 0) return null;

const activeUploads = files.filter(file => file.status_c === "uploading").length;
  const completedUploads = files.filter(file => file.status_c === "completed").length;
  const failedUploads = files.filter(file => file.status_c === "error").length;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Upload" className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Queue</h3>
                <p className="text-sm text-gray-500">
                  {activeUploads > 0 && `${activeUploads} uploading, `}
                  {completedUploads > 0 && `${completedUploads} completed`}
                  {failedUploads > 0 && `, ${failedUploads} failed`}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {files.length} {files.length === 1 ? "file" : "files"}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {files.map((file) => (
              <FileUploadProgress
key={file.Id}
                file={file}
                onCancel={onCancelUpload}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadQueue;