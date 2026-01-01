import api from "./api";

const stampService = {
  // Get all stamps
  getStamps: async () => {
    const response = await api.get("/stamps");
    return response.data;
  },

  // Get single stamp
  getStamp: async (id) => {
    const response = await api.get(`/stamps/${id}`);
    return response.data;
  },

  // Create stamp
  createStamp: async (stampData) => {
    const response = await api.post("/stamps", stampData);
    return response.data;
  },

  // Update stamp
  updateStamp: async (id, stampData) => {
    const response = await api.put(`/stamps/${id}`, stampData);
    return response.data;
  },

  // Delete stamp
  deleteStamp: async (id) => {
    const response = await api.delete(`/stamps/${id}`);
    return response.data;
  },

  // Upload photo
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post("/upload/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload multiple photos
  uploadPhotos: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });
    const response = await api.post("/upload/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default stampService;
