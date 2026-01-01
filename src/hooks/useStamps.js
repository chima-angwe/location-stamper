import { useState, useEffect, useCallback } from "react";
import stampService from "../services/stampService";

export const useStamps = () => {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStamps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stampService.getStamps();
      setStamps(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch stamps");
    } finally {
      setLoading(false);
    }
  }, []);

  const createStamp = async (stampData) => {
    try {
      const response = await stampService.createStamp(stampData);
      setStamps((prev) => [response.data, ...prev]);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateStamp = async (id, stampData) => {
    try {
      const response = await stampService.updateStamp(id, stampData);
      setStamps((prev) =>
        prev.map((stamp) => (stamp._id === id ? response.data : stamp))
      );
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteStamp = async (id) => {
    try {
      await stampService.deleteStamp(id);
      setStamps((prev) => prev.filter((stamp) => stamp._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchStamps();
  }, [fetchStamps]);

  return {
    stamps,
    loading,
    error,
    fetchStamps,
    createStamp,
    updateStamp,
    deleteStamp,
  };
};
