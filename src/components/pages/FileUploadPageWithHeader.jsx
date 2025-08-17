import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import AppHeader from '@/components/organisms/AppHeader';
import FileDropZone from '@/components/organisms/FileDropZone';
import UploadQueue from '@/components/organisms/UploadQueue';
import FileList from '@/components/organisms/FileList';

function FileUploadPageWithHeader() {
  const [files, setFiles] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);

  const handleFilesAdded = (newFiles) => {
    setUploadQueue(prev => [...prev, ...newFiles]);
  };

const handleCancelUpload = (fileId) => {
    setUploadQueue(prev => prev.filter(file => file.Id !== fileId));
  };

const handleFileDeleted = (fileId) => {
    setFiles(prev => prev.filter(file => file.Id !== fileId));
  };

useEffect(() => {
    // Move completed uploads from queue to files
    const completedFiles = uploadQueue.filter(file => file.upload_progress_c === 100);
    if (completedFiles.length > 0) {
      setFiles(prev => [...prev, ...completedFiles]);
      setUploadQueue(prev => prev.filter(file => file.upload_progress_c !== 100));
    }
  }, [uploadQueue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <ApperIcon name="Upload" size={24} className="text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Upload Files</h2>
            </div>
            <FileDropZone onFilesAdded={handleFilesAdded} />
          </div>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <UploadQueue
              files={uploadQueue}
              onCancel={handleCancelUpload}
              onProgress={setUploadQueue}
            />
          )}

          {/* File List */}
          <FileList files={files} onFileDeleted={handleFileDeleted} />
        </motion.div>
      </div>
    </div>
  );
}

export default FileUploadPageWithHeader;