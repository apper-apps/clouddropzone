import ApperIcon from "@/components/ApperIcon";
import React from "react";
import { cn } from "@/lib/utils";
const FilePreview = ({ file, size = "sm" }) => {
  const isImage = file.type.startsWith("image/");
  
  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "FileText";
    if (type.includes("word")) return "FileText";
    if (type.includes("excel") || type.includes("spreadsheet")) return "Table";
    if (type.includes("text")) return "FileText";
    return "File";
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  if (isImage && file.preview) {
    return (
      <div className={cn("rounded-lg overflow-hidden bg-gray-100 flex-shrink-0", sizeClasses[size])}>
        <img 
          src={file.preview} 
          alt={file.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center flex-shrink-0",
      sizeClasses[size]
    )}>
      <ApperIcon 
        name={getFileIcon(file.type)} 
        className={cn(
          "text-primary-600",
          size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
        )} 
      />
    </div>
  );
};

export default FilePreview;