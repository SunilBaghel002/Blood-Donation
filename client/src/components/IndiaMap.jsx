// src/components/IndiaMap.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { MapPin, Users, Building2 } from "lucide-react";

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Blood Drop Marker Icon
const createBloodDropIcon = (donorCount) => {
  const size = donorCount > 30000 ? 40 : donorCount > 20000 ? 35 : 30;

  return L.divIcon({
    className: "custom-blood-marker",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <svg 
          width="${size}" 
          height="${size}" 
          viewBox="0 0 24 24" 
          fill="#dc2626" 
          stroke="#991b1b" 
          stroke-width="1"
          style="
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
            animation: pulse 2s ease-in-out infinite;
          "
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        </style>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Component to handle map bounds
const FitBounds = ({ cities }) => {
  const map = useMap();

  useEffect(() => {
    if (cities.length > 0) {
      const bounds = cities.map((city) => [city.lat, city.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [cities, map]);

  return null;
};

const IndiaMap = () => {
  const indianCities = [
    {
      name: "Delhi NCR",
      lat: 28.6139,
      lng: 77.209,
      donors: 45200,
      banks: 87,
      state: "Delhi",
    },
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      donors: 38500,
      banks: 72,
      state: "Maharashtra",
    },
    {
      name: "Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      donors: 32800,
      banks: 65,
      state: "Karnataka",
    },
    {
      name: "Chennai",
      lat: 13.0827,
      lng: 80.2707,
      donors: 28200,
      banks: 58,
      state: "Tamil Nadu",
    },
    {
      name: "Kolkata",
      lat: 22.5726,
      lng: 88.3639,
      donors: 25800,
      banks: 54,
      state: "West Bengal",
    },
    {
      name: "Hyderabad",
      lat: 17.385,
      lng: 78.4867,
      donors: 24500,
      banks: 49,
      state: "Telangana",
    },
    {
      name: "Pune",
      lat: 18.5204,
      lng: 73.8567,
      donors: 22700,
      banks: 43,
      state: "Maharashtra",
    },
    {
      name: "Ahmedabad",
      lat: 23.0225,
      lng: 72.5714,
      donors: 19900,
      banks: 38,
      state: "Gujarat",
    },
    {
      name: "Surat",
      lat: 21.1702,
      lng: 72.8311,
      donors: 15200,
      banks: 28,
      state: "Gujarat",
    },
    {
      name: "Jaipur",
      lat: 26.9124,
      lng: 75.7873,
      donors: 14100,
      banks: 26,
      state: "Rajasthan",
    },
    {
      name: "Lucknow",
      lat: 26.8467,
      lng: 80.9462,
      donors: 13500,
      banks: 24,
      state: "Uttar Pradesh",
    },
    {
      name: "Kochi",
      lat: 9.9312,
      lng: 76.2673,
      donors: 12800,
      banks: 22,
      state: "Kerala",
    },
    {
      name: "Chandigarh",
      lat: 30.7333,
      lng: 76.7794,
      donors: 11500,
      banks: 20,
      state: "Punjab",
    },
    {
      name: "Visakhapatnam",
      lat: 17.6869,
      lng: 83.2185,
      donors: 10200,
      banks: 18,
      state: "Andhra Pradesh",
    },
    {
      name: "Indore",
      lat: 22.7196,
      lng: 75.8577,
      donors: 9800,
      banks: 16,
      state: "Madhya Pradesh",
    },
    {
      name: "Bhopal",
      lat: 23.2599,
      lng: 77.4126,
      donors: 9100,
      banks: 15,
      state: "Madhya Pradesh",
    },
    {
      name: "Patna",
      lat: 25.5941,
      lng: 85.1376,
      donors: 8500,
      banks: 14,
      state: "Bihar",
    },
    {
      name: "Thiruvananthapuram",
      lat: 8.5241,
      lng: 76.9366,
      donors: 7900,
      banks: 13,
      state: "Kerala",
    },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
          borderRadius: "1rem",
        }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Alternative: CartoDB Positron (Lighter theme) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        /> */}

        {/* Fit bounds to India */}
        <FitBounds cities={indianCities} />

        {/* City Markers */}
        {indianCities.map((city, index) => (
          <Marker
            key={index}
            position={[city.lat, city.lng]}
            icon={createBloodDropIcon(city.donors)}
          >
            <Popup className="custom-popup">
              <div className="p-4 min-w-[240px]">
                {/* City Header */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {city.name}
                    </h3>
                    <p className="text-xs text-gray-500">{city.state}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-600">Donors</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {city.donors.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Banks</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {city.banks}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                  Find Blood Banks →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000]">
        <h4 className="font-bold text-sm text-gray-900 mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-gray-700">Blood Bank Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Click for details</span>
          </div>
        </div>
      </div>

      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs text-gray-600">
          <strong className="text-gray-900">🗺️ Interactive Map</strong>
          <br />
          Scroll to zoom • Click markers for info
        </p>
      </div>
    </div>
  );
};

export default IndiaMap;
