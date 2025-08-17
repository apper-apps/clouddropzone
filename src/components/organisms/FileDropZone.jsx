import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import fileService from "@/services/api/fileService";

const FileDropZone = ({ onFilesAdded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createFilePreview = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const processFiles = async (files) => {
    setIsUploading(true);
    const processedFiles = [];

    for (const file of files) {
      const validation = fileService.validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      const preview = await createFilePreview(file);
      
      const fileItem = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: "uploading",
        preview: preview
      };

      try {
        const createdFile = await fileService.create(fileItem);
        processedFiles.push(createdFile);
        
        // Start upload simulation
        fileService.simulateUploadProgress(createdFile.Id, (progress) => {
          // Progress updates are handled in the parent component
        });
        
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (processedFiles.length > 0) {
      onFilesAdded(processedFiles);
      toast.success(`${processedFiles.length} file(s) added to upload queue`);
    }

    setIsUploading(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
    e.target.value = "";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
          isDragOver
            ? "border-primary-400 bg-gradient-to-br from-primary-50 to-secondary-50 scale-[1.02]"
            : "border-gray-300 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-25 hover:to-secondary-25"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-12 text-center">
          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag-over"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                  <ApperIcon name="Upload" className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Drop files here
                </h3>
                <p className="text-primary-600 font-medium">
                  Release to upload your files
                </p>
              </motion.div>
            ) : isUploading ? (
              <motion.div
                key="uploading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
                  <ApperIcon name="Loader2" className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Processing files...
                </h3>
                <p className="text-gray-500">
                  Please wait while we prepare your files for upload
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <ApperIcon name="Upload" className="w-10 h-10 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Drag & drop files here
                  </h3>
                  <p className="text-gray-500 text-lg">
                    or click the button below to browse
                  </p>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  />
                  <label htmlFor="file-upload">
                    <Button className="cursor-pointer" size="lg">
                      <ApperIcon name="FolderOpen" className="w-5 h-5 mr-2" />
                      Browse Files
                    </Button>
                  </label>
                  
                  <p className="text-sm text-gray-400">
                    Supports: Images, PDF, Word, Excel, Text files (Max 50MB)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default FileDropZone;