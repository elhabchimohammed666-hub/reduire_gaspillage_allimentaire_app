import React, { useState, useEffect, useCallback } from 'react';
import { LeafletMap } from '../features/map/LeafletMap';
import { FoodCard } from '../features/listings/FoodCard';
import { ListingFilters } from '../features/listings/ListingFilters';
import { ReservationModal } from '../features/reservations/ReservationModal';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Map, List, AlertCircle, Sparkles } from 'lucide-react';

export const ExplorePage = () => {
  const { addToast } = useToast();

  // Position par défaut (Paris centre) si l'utilisateur refuse la géoloc
  const [userPosition, setUserPosition] = useState({ lat: 48.8566, lng: 2.3522 });
  const [isLocating, setIsLocating] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    radius: 10,
    category: 'all',
    priceType: 'all',
    search: '',
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [reservationListing, setReservationListing] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'map', 'list' (pour mobile)

  // 🌍 Récupération de la position HTML5 de l'utilisateur
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      addToast('La géolocalisation n’est pas supportée par votre navigateur.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
        addToast('Position GPS actualisée avec succès !', 'success');
      },
      (err) => {
        console.warn('Geolocation warning/error:', err.message);
        setIsLocating(false);
        addToast('Impossible de récupérer votre position précise. Position par défaut utilisée.', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [addToast]);

  // Déclencher la géolocalisation au premier chargement
  useEffect(() => {
    locateUser();
  }, [locateUser]);

  // 📡 Appel API pour récupérer les offres à proximité
  const fetchNearbyListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: userPosition.lat,
        lng: userPosition.lng,
        radius: filters.radius,
      });

      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.priceType === 'free') {
        params.append('isFree', 'true');
      } else if (filters.priceType === 'discounted') {
        params.append('isFree', 'false');
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const res = await api.get(`/listings/nearby?${params.toString()}`);
      if (res.success && res.data) {
        setListings(res.data.listings || []);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Erreur lors du chargement des offres', 'error');
    } finally {
      setLoading(false);
    }
  }, [userPosition, filters, addToast]);

  useEffect(() => {
    fetchNearbyListings();
  }, [fetchNearbyListings]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      radius: 10,
      category: 'all',
      priceType: 'all',
      search: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-eco-900 via-eco-800 to-stone-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-eco-500/20 text-eco-300 border border-eco-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Zéro Gaspillage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Surplus Alimentaires Disponibles
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Découvrez les paniers invendus sauvés du gaspillage autour de vous.
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-white/10 p-1 rounded-xl self-start sm:self-auto backdrop-blur-md">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'both' : 'map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'map' ? 'bg-white text-stone-900' : 'text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Carte
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'both' : 'list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'list' ? 'bg-white text-stone-900' : 'text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Liste
          </button>
        </div>
      </div>

      {/* Main Grid: Filters + Map + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-3">
          <div className="sticky top-20">
            <ListingFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              onLocateMe={locateUser}
              isLocating={isLocating}
            />
          </div>
        </div>

        {/* Middle & Right: Interactive Map & Cards */}
        <div className="lg:col-span-9 space-y-6">
          {/* Interactive Leaflet Map */}
          {(viewMode === 'both' || viewMode === 'map') && (
            <div className="h-[420px] w-full rounded-2xl overflow-hidden shadow-md">
              <LeafletMap
                userPosition={userPosition}
                listings={listings}
                selectedListing={selectedListing}
                onSelectListing={(listing) => setSelectedListing(listing)}
                onReserve={(listing) => setReservationListing(listing)}
                radiusKm={filters.radius}
              />
            </div>
          )}

          {/* Listings List Header */}
          {(viewMode === 'both' || viewMode === 'list') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900">
                  {loading
                    ? 'Recherche des surplus en cours...'
                    : `${listings.length} offre${listings.length > 1 ? 's' : ''} trouvée${
                        listings.length > 1 ? 's' : ''
                      } dans un rayon de ${filters.radius} km`}
                </h2>
              </div>

              {/* Listings Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3 p-4 bg-white rounded-2xl border border-stone-200">
                      <Skeleton className="h-44 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">
                    Aucune offre trouvée à proximité
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Essayez d'augmenter le rayon de recherche avec le curseur ci-contre ou modifiez
                    vos critères de filtres.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map((listing) => (
                    <FoodCard
                      key={listing._id}
                      listing={listing}
                      isSelected={selectedListing?._id === listing._id}
                      onSelectOnMap={(item) => {
                        setSelectedListing(item);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      onReserve={(item) => setReservationListing(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reservation Modal with Unique Pickup Code */}
      <ReservationModal
        isOpen={!!reservationListing}
        onClose={() => setReservationListing(null)}
        listing={reservationListing}
        onReservationComplete={() => {
          fetchNearbyListings();
        }}
      />
    </div>
  );
};
