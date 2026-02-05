import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Button } from "@/components/ui/button";
import { Navigation2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default leaflet marker icon not loading
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

const cafeLocation = { lat: 12.9716, lng: 77.5946 }; // Example coords (Bangalore)
const cafeIcon = new Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export function MapLocation() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Calculate distance (Haversine formula simplified)
          const R = 6371; // km
          const dLat = (cafeLocation.lat - userPos.lat) * Math.PI / 180;
          const dLon = (cafeLocation.lng - userPos.lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userPos.lat * Math.PI / 180) * Math.cos(cafeLocation.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          setDistance(d.toFixed(1));
        },
        () => console.log("Geolocation permission denied")
      );
    }
  }, []);

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${cafeLocation.lat},${cafeLocation.lng}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-display font-bold">Find Us</h3>
          <p className="text-muted-foreground">
            {distance ? `You are ${distance} km away` : "Locate us on the map"}
          </p>
        </div>
        <Button onClick={openDirections} className="gap-2">
          <Navigation2 className="w-4 h-4" />
          Get Directions
        </Button>
      </div>
      
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-border z-0 relative">
        <MapContainer 
          center={[cafeLocation.lat, cafeLocation.lng]} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[cafeLocation.lat, cafeLocation.lng]} icon={cafeIcon}>
            <Popup>
              <div className="font-bold text-center">
                Brune Cafe<br/>
                <span className="text-xs text-muted-foreground">Come say hi!</span>
              </div>
            </Popup>
          </Marker>
          
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={cafeIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
