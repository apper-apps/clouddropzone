class FileService {
  constructor() {
    // Initialize ApperClient for file operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "upload_progress_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "preview_c" } },
          { field: { Name: "uploaded_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "uploaded_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('file_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to fetch files');
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching files:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "upload_progress_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "preview_c" } },
          { field: { Name: "uploaded_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById('file_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('File not found');
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching file with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(fileItem) {
    try {
      // Only include updateable fields for file creation
      const fileData = {
        Name: fileItem.name,
        size_c: fileItem.size,
        type_c: fileItem.type,
        upload_progress_c: fileItem.uploadProgress || 0,
        status_c: fileItem.status || "uploading",
        preview_c: fileItem.preview || null,
        uploaded_at_c: new Date().toISOString()
      };

      const params = {
        records: [fileData]
      };

      const response = await this.apperClient.createRecord('file_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to create file record');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create files ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create file record');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, data) {
    try {
      // Only include updateable fields for updates
      const updateData = {
        Id: parseInt(id)
      };

      // Map the data to database field names
      if (data.uploadProgress !== undefined) updateData.upload_progress_c = data.uploadProgress;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.preview !== undefined) updateData.preview_c = data.preview;
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.size !== undefined) updateData.size_c = data.size;
      if (data.type !== undefined) updateData.type_c = data.type;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('file_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to update file');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update files ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update file');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('file_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to delete file');
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete files ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete file');
        }
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting file:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async simulateUploadProgress(id, onProgress) {
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        await this.update(id, { uploadProgress: 100, status: "completed" });
      } else {
        await this.update(id, { uploadProgress: Math.floor(progress) });
      }
      onProgress(Math.floor(progress));
    }, 200);
  }

  validateFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv"
    ];

    if (file.size > maxSize) {
      return { valid: false, error: "File size exceeds 50MB limit" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not supported" };
    }

    return { valid: true };
  }
}

export default new FileService();