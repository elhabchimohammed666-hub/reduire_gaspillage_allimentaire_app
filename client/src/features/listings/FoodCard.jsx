import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MapPin, Store, Utensils, Croissant, Apple, Milk, Package, ArrowRight } from 'lucide-react';

export const FoodCard = ({ listing, onReserve, onSelectOnMap, isSelected = false }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'bakery':
        return <Croissant className="w-3.5 h-3.5" />;
      case 'produce':
        return <Apple className="w-3.5 h-3.5" />;
      case 'dairy':
        return <Milk className="w-3.5 h-3.5" />;
      case 'meals':
        return <Utensils className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  const categoryLabels = {
    bakery: 'Boulangerie',
    meals: 'Plat cuisiné',
    produce: 'Fruits & Légumes',
    dairy: 'Produits laitiers',
    groceries: 'Épicerie',
    beverages: 'Boissons',
    other: 'Divers',
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  const imageUrl =
    listing.images && listing.images.length > 0 ? listing.images[0] : defaultImage;

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
        isSelected
          ? 'border-eco-600 ring-2 ring-eco-500/30 shadow-lg'
          : 'border-stone-200/80 shadow-sm'
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-800 backdrop-blur-sm shadow-sm">
              {getCategoryIcon(listing.category)}
              {categoryLabels[listing.category] || listing.category}
            </span>

            {listing.distanceInKm !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900/85 text-white backdrop-blur-sm">
                <MapPin className="w-3 h-3 text-eco-400" />
                {listing.distanceInKm} km
              </span>
            )}
          </div>

          {/* Bottom Countdown in Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <CountdownTimer targetDate={listing.pickupEnd} />

            {listing.isFree ? (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500 text-white shadow-md animate-pulse-subtle">
                Gratuit
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5 bg-white/95 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                {listing.originalPrice > listing.discountedPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {listing.originalPrice.toFixed(2)}€
                  </span>
                )}
                <span className="text-sm font-extrabold text-eco-700">
                  {listing.discountedPrice.toFixed(2)}€
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          {/* Donor details */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium truncate">
            <Store className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">
              {listing.donor?.organizationName || listing.donor?.name || 'Commerçant Partenaire'}
            </span>
          </div>

          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-eco-600 transition">
            {listing.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {listing.description || 'Surplus alimentaire de qualité récupérable sur place.'}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
            <span className="font-medium text-stone-700">
              Quantité : <strong className="text-stone-900">{listing.quantity}</strong>
            </span>
            <span className="truncate max-w-[140px] text-stone-400">
              {listing.address?.city || 'Paris'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        {onSelectOnMap && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectOnMap(listing)}
            className="w-full text-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-eco-600" />
            Localiser
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onReserve(listing)}
          className={`w-full text-xs ${!onSelectOnMap ? 'col-span-2' : ''}`}
        >
          <span>Réserver</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
