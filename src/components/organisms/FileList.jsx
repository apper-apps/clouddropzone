import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FilePreview from "@/components/molecules/FilePreview";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import fileService from "@/services/api/fileService";

const FileList = ({ uploadedFiles, onFileDeleted }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFiles = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fileService.getAll();
      setFiles(data.filter(file => file.status === "completed"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Update files when new uploads complete
  useEffect(() => {
    const completedFiles = uploadedFiles.filter(file => file.status === "completed");
    if (completedFiles.length > 0) {
      setFiles(prev => {
        const newFiles = completedFiles.filter(
          newFile => !prev.some(existing => existing.Id === newFile.Id)
        );
        return [...newFiles, ...prev];
      });
    }
  }, [uploadedFiles]);

  const handleDelete = async (fileId) => {
    try {
      await fileService.delete(fileId);
      setFiles(prev => prev.filter(file => file.Id !== fileId));
      onFileDeleted?.(fileId);
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadFiles} />;
  if (files.length === 0) return <Empty onAction={() => document.getElementById("file-upload")?.click()} />;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {files.length}
              </p>
              <p className="text-sm text-gray-500">Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {formatFileSize(getTotalSize())}
              </p>
              <p className="text-sm text-gray-500">Total Size</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="FolderOpen" className="w-4 h-4" />
            <span>Uploaded Files</span>
          </div>
        </div>
      </motion.div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.Id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <FilePreview file={file} size="lg" />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate mb-1">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.Id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileList;