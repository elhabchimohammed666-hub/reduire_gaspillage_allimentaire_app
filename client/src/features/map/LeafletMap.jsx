import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../../components/ui/Button';
import { CountdownTimer } from '../listings/CountdownTimer';
import { ArrowRight, MapPin, Store } from 'lucide-react';

// Contrôleur pour recentrer la carte de manière fluide
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Générateur d'icône Leaflet SVG personnalisée par catégorie
const createCategoryIcon = (category, isSelected = false) => {
  const configs = {
    bakery: { color: '#f59e0b', emoji: '🥐' },
    meals: { color: '#ea580c', emoji: '🍲' },
    produce: { color: '#16a34a', emoji: '🍏' },
    dairy: { color: '#0284c7', emoji: '🧀' },
    groceries: { color: '#9333ea', emoji: '📦' },
    other: { color: '#64748b', emoji: '🍽️' },
  };

  const cfg = configs[category] || configs.other;
  const size = isSelected ? 46 : 38;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${cfg.color};
      color: white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      border: 3px solid white;
      transition: transform 0.2s ease;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: ${isSelected ? '18px' : '15px'};
      ">
        ${cfg.emoji}
      </span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-food-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Icône de géolocalisation de l'utilisateur avec halo animé
const userLocationIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative; width: 22px; height: 22px;">
      <div style="
        position: absolute;
        inset: -8px;
        background-color: #3b82f6;
        opacity: 0.35;
        border-radius: 50%;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 22px;
        height: 22px;
        background-color: #2563eb;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const LeafletMap = ({
  userPosition,
  listings = [],
  selectedListing,
  onSelectListing,
  onReserve,
  radiusKm = 10,
}) => {
  const defaultCenter = [48.8566, 2.3522]; // Paris par défaut
  const center = userPosition
    ? [userPosition.lat, userPosition.lng]
    : listings.length > 0 && listings[0].location?.coordinates
    ? [listings[0].location.coordinates[1], listings[0].location.coordinates[0]]
    : defaultCenter;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden shadow-inner border border-stone-200">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView
          center={
            selectedListing?.location?.coordinates
              ? [
                  selectedListing.location.coordinates[1],
                  selectedListing.location.coordinates[0],
                ]
              : center
          }
          zoom={selectedListing ? 15 : 13}
        />

        {/* Fond de carte OpenStreetMap clair et élégant */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueur et rayon de recherche de l'utilisateur */}
        {userPosition && (
          <>
            <Marker
              position={[userPosition.lat, userPosition.lng]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="p-1 text-center font-bold text-xs text-stone-800">
                  📍 Vous êtes ici
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userPosition.lat, userPosition.lng]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#16a34a',
                fillColor: '#22c55e',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 8',
              }}
            />
          </>
        )}

        {/* Marqueurs des offres alimentaires */}
        {listings.map((listing) => {
          if (!listing.location || !listing.location.coordinates) return null;
          // Note GeoJSON : [longitude, latitude] -> Leaflet : [latitude, longitude]
          const [lng, lat] = listing.location.coordinates;
          const isSelected = selectedListing?._id === listing._id;

          return (
            <Marker
              key={listing._id}
              position={[lat, lng]}
              icon={createCategoryIcon(listing.category, isSelected)}
              eventHandlers={{
                click: () => onSelectListing(listing),
              }}
            >
              <Popup className="food-listing-popup">
                <div className="w-64 p-1">
                  {listing.images && listing.images[0] && (
                    <div className="h-28 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-semibold text-stone-500 truncate flex items-center gap-1">
                      <Store className="w-3 h-3 text-stone-400" />
                      {listing.donor?.organizationName || listing.donor?.name}
                    </span>
                    {listing.isFree ? (
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Gratuit
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-eco-700">
                        {listing.discountedPrice?.toFixed(2)}€
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-stone-900 leading-tight mb-2">
                    {listing.title}
                  </h4>

                  <div className="mb-3">
                    <CountdownTimer targetDate={listing.pickupEnd} />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs py-1.5"
                    onClick={() => onReserve(listing)}
                  >
                    <span>Réserver ce panier</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
