"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = customIcon;

export default function ShipmentMap({ origin, dest }: { origin: string, dest: string }) {
  const [coords, setCoords] = useState<{ origin: [number, number] | null, dest: [number, number] | null }>({ origin: null, dest: null });

  useEffect(() => {
    async function fetchCoords() {
      try {
        const fetchCity = async (city: string) => {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
          const data = await res.json();
          if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
          }
          return null;
        };

        const [originCoords, destCoords] = await Promise.all([
          fetchCity(origin),
          fetchCity(dest)
        ]);

        setCoords({ origin: originCoords, dest: destCoords });
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }
    fetchCoords();
  }, [origin, dest]);

  if (!coords.origin || !coords.dest) {
    return <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center text-zinc-500 font-medium text-sm">
      <div className="w-6 h-6 border-2 border-[#C70E20] border-t-transparent rounded-full animate-spin mb-3"></div>
      Locating coordinates via satellite...
    </div>;
  }

  const bounds = L.latLngBounds([coords.origin, coords.dest]);

  return (
    <MapContainer bounds={bounds} boundsOptions={{ padding: [50, 50] }} style={{ width: "100%", height: "100%", zIndex: 10 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords.origin}>
        <Popup><b>Origin:</b> {origin}</Popup>
      </Marker>
      <Marker position={coords.dest}>
        <Popup><b>Destination:</b> {dest}</Popup>
      </Marker>
      <Polyline positions={[coords.origin, coords.dest]} color="#C70E20" weight={4} dashArray="10, 10" />
    </MapContainer>
  );
}
