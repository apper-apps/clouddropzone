import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FileDropZone from "@/components/organisms/FileDropZone";
import UploadQueue from "@/components/organisms/UploadQueue";
import FileList from "@/components/organisms/FileList";

const FileUploadPage = () => {
  const [uploadQueue, setUploadQueue] = useState([]);

  const handleFilesAdded = (newFiles) => {
    setUploadQueue(prev => [...newFiles, ...prev]);
  };

const handleCancelUpload = (fileId) => {
    setUploadQueue(prev => prev.filter(file => file.Id !== fileId));
  };

const handleFileDeleted = (fileId) => {
    // Remove from upload queue if it exists there
    setUploadQueue(prev => prev.filter(file => file.Id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Upload" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  DropZone
                </h1>
                <p className="text-sm text-gray-500">Upload and manage your files</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="Shield" className="w-4 h-4" />
              <span>Secure file upload</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Drop Zone */}
        <section>
          <FileDropZone onFilesAdded={handleFilesAdded} />
        </section>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <section>
            <UploadQueue 
              files={uploadQueue}
              onCancelUpload={handleCancelUpload}
            />
          </section>
        )}

        {/* File List */}
        <section>
          <FileList 
            uploadedFiles={uploadQueue}
            onFileDeleted={handleFileDeleted}
          />
        </section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500" />
                <span>Secure uploads</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Zap" className="w-4 h-4 text-yellow-500" />
                <span>Fast processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Lock" className="w-4 h-4 text-blue-500" />
                <span>Encrypted storage</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Maximum file size: 50MB • Supported formats: Images, PDF, Office documents
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default FileUploadPage;