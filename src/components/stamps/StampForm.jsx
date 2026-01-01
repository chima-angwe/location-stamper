import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGeolocation } from "../../hooks/useGeolocation";
import stampService from "../../services/stampService";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import Button from "../common/Button";
import Alert from "../common/Alert";
import ImagePreview from "../common/ImagePreview";
import { CATEGORIES } from "../../utils/constants";
import {
  MyLocationOutlined,
  PhotoCameraOutlined,
  MapOutlined,
  CloudUploadOutlined,
} from "@mui/icons-material";

const StampForm = ({ onSuccess, onCancel, initialData = null }) => {
  const {
    coords,
    loading: gpsLoading,
    error: gpsError,
    getLocation,
  } = useGeolocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    category: "other",
    notes: "",
  });
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        address: initialData.address || "",
        category: initialData.category || "other",
        notes: initialData.notes || "",
      });
      if (initialData.photos) {
        setPhotos(initialData.photos);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (coords) {
      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photoFiles.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }
    setPhotoFiles((prev) => [...prev, ...files]);
    setError(""); // Clear error on successful selection
  };

  const removePhoto = (index) => {
    if (typeof photos[index] === "string") {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const uploadPhotos = async () => {
    if (photoFiles.length === 0) return [];

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        try {
          const response = await stampService.uploadPhoto(file);
          if (response.success && response.data?.url) {
            uploadedUrls.push(response.data.url);
          } else if (response.data?.url) {
            uploadedUrls.push(response.data.url);
          }
          setUploadProgress(((i + 1) / photoFiles.length) * 100);
        } catch (uploadErr) {
          console.error(`Failed to upload photo ${i + 1}:`, uploadErr);
          setError(
            `Failed to upload photo ${i + 1}. Continuing with other photos...`
          );
        }
      }
      return uploadedUrls;
    } catch (err) {
      throw new Error("Failed to upload some photos");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }

      if (!formData.latitude || !formData.longitude) {
        setError("Location coordinates are required");
        setLoading(false);
        return;
      }

      // Upload new photos
      const newPhotoUrls = await uploadPhotos();
      const allPhotos = [...photos, ...newPhotoUrls];

      const stampData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photos: allPhotos,
      };

      if (initialData) {
        await stampService.updateStamp(initialData._id, stampData);
      } else {
        await stampService.createStamp(stampData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving stamp:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to save stamp"
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <motion.div variants={itemVariants}>
          <Alert type="error" message={error} onClose={() => setError("")} />
        </motion.div>
      )}
      {gpsError && (
        <motion.div variants={itemVariants}>
          <Alert type="error" message={gpsError} />
        </motion.div>
      )}

      {/* Title */}
      <motion.div variants={itemVariants}>
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Central Park"
          required
        />
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants}>
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of this location"
          rows={3}
        />
      </motion.div>

      {/* GPS Coordinates Section */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <MapOutlined className="text-white" />
            </div>
            <h3 className="font-semibold text-lg text-white">Location</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                required
              />
              <Input
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                required
              />
            </div>

            <motion.button
              type="button"
              onClick={getLocation}
              disabled={gpsLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MyLocationOutlined fontSize="small" />
              {gpsLoading ? "Getting Location..." : "Use Current Location"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Address */}
      <motion.div variants={itemVariants}>
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., New York, NY"
        />
      </motion.div>

      {/* Category */}
      <motion.div variants={itemVariants}>
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={CATEGORIES}
          required
        />
      </motion.div>

      {/* Notes */}
      <motion.div variants={itemVariants}>
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this location"
          rows={4}
        />
      </motion.div>

      {/* Photo Upload */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-semibold text-white mb-3">
          Photos <span className="text-gray-400">(Max 5)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
          disabled={uploading}
        />
        <label
          htmlFor="photo-upload"
          className={`
            flex flex-col items-center justify-center gap-3
            w-full px-6 py-8 rounded-xl
            bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-700
            ${
              !uploading
                ? "hover:border-blue-500 hover:from-gray-800/80 hover:to-gray-900/80 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            }
            transition-all duration-300 group
          `}
        >
          <div
            className={`p-3 bg-blue-500/20 rounded-lg ${
              uploading ? "" : "group-hover:bg-blue-500/30"
            } transition-colors`}
          >
            <PhotoCameraOutlined className="text-blue-400 text-3xl" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">
              {uploading ? "Uploading Photos..." : "Choose Photos"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {uploading
                ? `${Math.round(uploadProgress)}% complete`
                : "or drag and drop"}
            </p>
          </div>

          {uploading && (
            <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </label>

        {(photos.length > 0 || photoFiles.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <ImagePreview
              images={[...photos, ...photoFiles]}
              onRemove={removePhoto}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex gap-4 pt-6 border-t border-gray-700"
      >
        <motion.div
          whileHover={{ scale: !loading && !uploading ? 1.02 : 1 }}
          whileTap={{ scale: !loading && !uploading ? 0.98 : 1 }}
          className="flex-1"
        >
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <CloudUploadOutlined fontSize="small" />
                Uploading Photos...
              </>
            ) : loading ? (
              <>Saving Stamp...</>
            ) : (
              <>{initialData ? "Update Stamp" : "Create Stamp"}</>
            )}
          </button>
        </motion.div>
        {onCancel && (
          <motion.div
            whileHover={{ scale: !loading && !uploading ? 1.02 : 1 }}
            whileTap={{ scale: !loading && !uploading ? 0.98 : 1 }}
            className="flex-1"
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || uploading}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.form>
  );
};

export default StampForm;
