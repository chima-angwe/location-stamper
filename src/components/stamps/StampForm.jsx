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
  OpenInNewOutlined,
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
  const [locationAccuracy, setLocationAccuracy] = useState(null);

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
      setLocationAccuracy(coords.accuracy);

      // Show success message with coordinates
      console.log("📍 Location set:", coords.latitude, coords.longitude);
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
    const uploadedUrls = [];

    try {
      for (const file of photoFiles) {
        const response = await stampService.uploadPhoto(file);
        if (response.success) {
          uploadedUrls.push(response.data.url);
        }
      }
      return uploadedUrls;
    } catch (err) {
      throw new Error("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const verifyLocation = () => {
    if (formData.latitude && formData.longitude) {
      const url = `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`;
      window.open(url, "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
      setError(err.response?.data?.error || "Failed to save stamp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {gpsError && <Alert type="error" message={gpsError} />}

      {/* Title */}
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Central Park"
        required
      />

      {/* Description */}
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Brief description of this location"
        rows={3}
      />

      {/* GPS Coordinates */}
      <div>
        <label className="block text-sm font-medium mb-2">
          GPS Coordinates <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude (e.g., 6.5244)"
            required
          />
          <Input
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude (e.g., 3.3792)"
            required
          />
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            onClick={getLocation}
            disabled={gpsLoading}
            loading={gpsLoading}
            variant="outline"
            className="flex-1"
          >
            <MyLocationOutlined fontSize="small" />
            {gpsLoading ? "Getting Location..." : "Use Current Location"}
          </Button>

          {formData.latitude && formData.longitude && (
            <Button type="button" onClick={verifyLocation} variant="outline">
              <OpenInNewOutlined fontSize="small" />
              Verify
            </Button>
          )}
        </div>

        {/* Location Info */}
        {formData.latitude && formData.longitude && (
          <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-sm">
            <p className="font-semibold text-blue-400 mb-1">
              📍 Location Detected
            </p>
            <p className="text-gray-300 font-mono text-xs mb-1">
              {parseFloat(formData.latitude).toFixed(6)}°,{" "}
              {parseFloat(formData.longitude).toFixed(6)}°
            </p>
            {locationAccuracy && (
              <p className="text-gray-400 text-xs">
                Accuracy: ±{locationAccuracy.toFixed(0)} meters
              </p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              💡 Click "Verify" to check this location on Google Maps
            </p>
          </div>
        )}
      </div>

      {/* Address */}
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="e.g., Lagos, Nigeria"
      />

      {/* Category */}
      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={CATEGORIES}
        required
      />

      {/* Notes */}
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Additional notes about this location"
        rows={4}
      />

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Photos (Max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="
            flex items-center justify-center gap-2
            w-full px-4 py-3 rounded-lg
            bg-gray-700 border-2 border-dashed border-gray-600
            hover:border-blue-500 cursor-pointer
            transition-colors duration-200
          "
        >
          <PhotoCameraOutlined />
          <span>Choose Photos</span>
        </label>
        <ImagePreview
          images={[...photos, ...photoFiles]}
          onRemove={removePhoto}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading || uploading}
          loading={loading || uploading}
          fullWidth
        >
          {uploading
            ? "Uploading Photos..."
            : initialData
            ? "Update Stamp"
            : "Create Stamp"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            fullWidth
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  );
};

export default StampForm;
