import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCategoryColor } from '../../utils/constants';
import Loader from '../common/Loader';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ stamps = [], onStampClick, center = [20, 0], zoom = 3 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const markerLayerGroupRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  // Initialize map once with proper timing
  useEffect(() => {
    if (initializedRef.current || !mapRef.current) return;

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      try {
        // Verify container exists and has dimensions
        if (!mapRef.current) {
          setError('Map container not found');
          setLoading(false);
          return;
        }

        // Set initial dimensions
        mapRef.current.style.width = '100%';
        mapRef.current.style.height = '100%';

        // Create map with proper options
        const mapInstance = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: true,
          keyboard: true,
        });

        mapInstance.setView(center, zoom);
        mapInstanceRef.current = mapInstance;

        // Add dark tile layer
        const tileLayer = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            minZoom: 2,
            subdomains: 'abcd',
            tileSize: 256,
            zIndex: 1,
          }
        );

        tileLayer.addTo(mapInstance);

        // Create marker layer group
        markerLayerGroupRef.current = L.layerGroup().addTo(mapInstance);

        // Add scale control for accuracy reference
        L.control.scale({ 
          imperial: true, 
          metric: true,
          position: 'bottomright'
        }).addTo(mapInstance);

        // Invalidate size after a short delay to ensure rendering
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

        initializedRef.current = true;
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to initialize map: ${err.message}`);
        setLoading(false);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when stamps change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerGroupRef.current) {
      return;
    }

    try {
      // Clear existing markers
      markerLayerGroupRef.current.clearLayers();
      markersRef.current = [];

      if (!stamps || stamps.length === 0) {
        return;
      }

      // Add new markers
      const bounds = L.latLngBounds();

      stamps.forEach((stamp) => {
        try {
          if (!stamp.latitude || !stamp.longitude) {
            console.warn('Stamp missing coordinates:', stamp);
            return;
          }

          const markerColor = getCategoryColor(stamp.category) || '#3b82f6';
          const lat = parseFloat(stamp.latitude);
          const lng = parseFloat(stamp.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid coordinates:', lat, lng);
            return;
          }

          // Create circle marker with center dot for precision
          const marker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: markerColor,
            color: 'white',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8,
          });

          // Add precise center dot
          const centerDot = L.circleMarker([lat, lng], {
            radius: 2,
            fillColor: 'white',
            color: 'white',
            weight: 0,
            opacity: 1,
            fillOpacity: 1,
          });

          // Enhanced popup content with exact coordinates
          const popupContent = `
            <div style="
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              min-width: 260px;
              color: #333;
            ">
              <h3 style="
                font-weight: 700;
                margin: 0 0 10px 0;
                font-size: 16px;
                color: #000;
              ">${stamp.title || 'Untitled'}</h3>
              
              ${stamp.description ? `
                <p style="
                  margin: 0 0 10px 0;
                  font-size: 13px;
                  color: #666;
                  line-height: 1.5;
                ">${stamp.description}</p>
              ` : ''}
              
              ${stamp.address ? `
                <p style="
                  margin: 0 0 10px 0;
                  font-size: 12px;
                  color: #999;
                  font-weight: 500;
                ">📍 ${stamp.address}</p>
              ` : ''}
              
              <div style="
                margin: 10px 0 0 0;
                padding: 8px;
                background: #f5f5f5;
                border-radius: 6px;
                border-left: 3px solid ${markerColor};
              ">
                <p style="
                  margin: 0 0 4px 0;
                  font-size: 10px;
                  color: #999;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">Exact Coordinates</p>
                <p style="
                  margin: 0;
                  font-size: 12px;
                  color: #333;
                  font-family: 'Monaco', 'Courier New', monospace;
                  font-weight: 600;
                ">📌 ${lat.toFixed(7)}° N, ${lng.toFixed(7)}° E</p>
                <p style="
                  margin: 4px 0 0 0;
                  font-size: 9px;
                  color: #999;
                ">Accuracy: ±10 meters</p>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'stamp-popup',
          });

          centerDot.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'stamp-popup',
          });

          // Click event for both markers
          if (onStampClick) {
            marker.on('click', () => {
              onStampClick(stamp);
            });
            centerDot.on('click', () => {
              onStampClick(stamp);
            });
          }

          marker.addTo(markerLayerGroupRef.current);
          centerDot.addTo(markerLayerGroupRef.current);
          markersRef.current.push(marker, centerDot);
          bounds.extend([lat, lng]);
        } catch (markerErr) {
          console.error('Error adding marker:', markerErr);
        }
      });

      // Fit bounds with better zoom level for accuracy
      if (markersRef.current.length > 0) {
        setTimeout(() => {
          try {
            if (mapInstanceRef.current && bounds.isValid()) {
              // Use higher maxZoom for single stamps to show precise location
              const maxZoomLevel = stamps.length === 1 ? 16 : 14;
              
              mapInstanceRef.current.fitBounds(bounds, {
                padding: [100, 100],
                maxZoom: maxZoomLevel,
                animate: true,
              });
            }
          } catch (boundsErr) {
            console.error('Error fitting bounds:', boundsErr);
          }
        }, 200);
      }
    } catch (err) {
      console.error('Error updating markers:', err);
      setError(`Failed to load markers: ${err.message}`);
    }
  }, [stamps, onStampClick]);

  if (error) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-lg bg-gray-800 flex items-center justify-center text-red-400 flex-col gap-4">
        <div className="text-center p-6">
          <p className="text-lg font-semibold mb-2">⚠️ Map Error</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden bg-gray-900 border border-gray-700 flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50 rounded-lg">
          <div className="text-center">
            <Loader />
            <p className="text-gray-400 mt-4 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="flex-1 w-full h-full relative" 
        style={{ minHeight: '500px' }}
      />
      
      {/* Map info */}
      {stamps && stamps.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 text-xs text-gray-300 pointer-events-none z-10">
          <p className="font-semibold mb-1">📍 {stamps.length} stamp{stamps.length !== 1 ? 's' : ''} on map</p>
          <p className="text-gray-400">💡 Zoom in for precise locations</p>
        </div>
      )}
    </div>
  );
};

export default MapView;