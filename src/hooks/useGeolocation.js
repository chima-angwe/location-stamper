import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Log for debugging
    console.log('🌍 Requesting GPS location...');

    // Try with high accuracy first, then fallback to low accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0, // Don't use cached location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        // Log the received coordinates
        console.log('✅ GPS Success:', {
          latitude,
          longitude,
          accuracy: `±${accuracy.toFixed(0)} meters`,
          timestamp: new Date(position.timestamp).toLocaleString(),
        });

        // Verify coordinates are reasonable (not 0,0 or extreme values)
        if (latitude === 0 && longitude === 0) {
          console.warn('⚠️ Received 0,0 coordinates - likely invalid');
          setError('Invalid location received. Please try again or enter coordinates manually.');
          setLoading(false);
          return;
        }

        if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
          console.warn('⚠️ Coordinates out of valid range');
          setError('Invalid coordinates received. Please try again.');
          setLoading(false);
          return;
        }

        // Log Google Maps link for verification
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        console.log('🗺️ Verify location:', mapsUrl);

        setCoords({
          latitude,
          longitude,
          accuracy,
        });
        setLoading(false);
      },
      (err) => {
        console.error('❌ GPS Error:', err);
        
        // If high accuracy fails, try low accuracy
        if (err.code === err.TIMEOUT) {
          console.log('⏱️ High accuracy timeout, trying low accuracy...');
          
          const fallbackOptions = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000, // Accept 1 minute old location
          };
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              const accuracy = position.coords.accuracy;

              console.log('✅ GPS Success (low accuracy):', {
                latitude,
                longitude,
                accuracy: `±${accuracy.toFixed(0)} meters`,
              });

              // Verify coordinates
              if (latitude === 0 && longitude === 0) {
                setError('Invalid location received. Please enter coordinates manually.');
                setLoading(false);
                return;
              }

              const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
              console.log('🗺️ Verify location:', mapsUrl);

              setCoords({
                latitude,
                longitude,
                accuracy,
              });
              setLoading(false);
            },
            (fallbackErr) => {
              console.error('❌ GPS Fallback Error:', fallbackErr);
              
              const errorMessages = {
                1: 'Location permission denied. Please enable location access in your browser settings.',
                2: 'Location information unavailable. Please check your GPS/internet connection.',
                3: 'Location request timed out. Please try again or enter coordinates manually.',
              };
              setError(errorMessages[fallbackErr.code] || 'Failed to get location');
              setLoading(false);
            },
            fallbackOptions
          );
        } else {
          const errorMessages = {
            1: 'Location permission denied. Please enable location access in your browser settings.',
            2: 'Location information unavailable. Please check your GPS/internet connection.',
            3: 'Location request timed out. Please try again or enter coordinates manually.',
          };
          setError(errorMessages[err.code] || 'Failed to get location');
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