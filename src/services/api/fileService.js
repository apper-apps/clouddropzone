import filesData from "../mockData/files.json";

class FileService {
  constructor() {
    this.files = [...filesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.files];
  }

  async getById(id) {
    await this.delay(200);
    const file = this.files.find(f => f.Id === parseInt(id));
    if (!file) {
      throw new Error("File not found");
    }
    return { ...file };
  }

  async create(fileItem) {
    await this.delay(400);
    const newFile = {
      ...fileItem,
      Id: this.getNextId(),
      uploadedAt: new Date().toISOString(),
      status: "uploading",
      uploadProgress: 0
    };
    this.files.push(newFile);
    return { ...newFile };
  }

  async update(id, data) {
    await this.delay(250);
    const index = this.files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    this.files[index] = { ...this.files[index], ...data };
    return { ...this.files[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }
    this.files.splice(index, 1);
    return true;
  }

  async simulateUploadProgress(id, onProgress) {
    const file = this.files.find(f => f.Id === parseInt(id));
    if (!file) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.update(id, { uploadProgress: 100, status: "completed" });
      } else {
        this.update(id, { uploadProgress: Math.floor(progress) });
      }
      onProgress(Math.floor(progress));
    }, 200);
  }

  getNextId() {
    return this.files.length > 0 ? Math.max(...this.files.map(f => f.Id)) + 1 : 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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