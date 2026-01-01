import { useState, useCallback } from "react";

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Try with high accuracy first, then fallback to low accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased to 10 seconds
      maximumAge: 300000, // Cache for 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        // If high accuracy fails, try low accuracy
        if (err.code === err.TIMEOUT) {
          const fallbackOptions = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000,
          };

          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoords({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setLoading(false);
            },
            (fallbackErr) => {
              const errorMessages = {
                1: "Location permission denied. Please enable location access in your browser settings.",
                2: "Location information unavailable. Please check your GPS/internet connection.",
                3: "Location request timed out. Please try again or enter coordinates manually.",
              };
              setError(
                errorMessages[fallbackErr.code] || "Failed to get location"
              );
              setLoading(false);
            },
            fallbackOptions
          );
        } else {
          const errorMessages = {
            1: "Location permission denied. Please enable location access in your browser settings.",
            2: "Location information unavailable. Please check your GPS/internet connection.",
            3: "Location request timed out. Please try again or enter coordinates manually.",
          };
          setError(errorMessages[err.code] || "Failed to get location");
          setLoading(false);
        }
      },
      options
    );
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setError(null);
  }, []);

  return { coords, loading, error, getLocation, clearLocation };
};
