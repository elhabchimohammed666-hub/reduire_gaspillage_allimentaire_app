import React from 'react';
import { Search, SlidersHorizontal, MapPin, Sparkles, RotateCcw } from 'lucide-react';

export const ListingFilters = ({
  filters,
  onChange,
  onReset,
  onLocateMe,
  isLocating = false,
}) => {
  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'bakery', label: '🥖 Boulangerie' },
    { id: 'meals', label: '🍲 Plats cuisinés' },
    { id: 'produce', label: '🍏 Fruits & Légumes' },
    { id: 'dairy', label: '🧀 Laiterie' },
    { id: 'groceries', label: '📦 Épicerie' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-eco-600" />
          <h3 className="font-bold text-stone-900 text-sm">Filtres de recherche</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser
        </button>
      </div>

      {/* Barre de recherche texte */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher croissant, plat chaud, fruits..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition"
        />
      </div>

      {/* Rayon de recherche (Geospatial Radius) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-eco-600" />
            Rayon de distance
          </span>
          <span className="px-2 py-0.5 rounded-md bg-eco-50 text-eco-700 font-bold">
            {filters.radius} km
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={filters.radius}
          onChange={(e) => onChange('radius', Number(e.target.value))}
          className="w-full accent-eco-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-medium">
          <span>1 km</span>
          <span>15 km</span>
          <span>30 km</span>
        </div>
      </div>

      {/* Bouton de relocalisation GPS */}
      {onLocateMe && (
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-eco-700 bg-eco-50 hover:bg-eco-100 rounded-xl transition border border-eco-200/60"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isLocating ? 'Localisation en cours...' : 'Centrer sur ma position GPS'}</span>
        </button>
      )}

      {/* Type de prix (Tous / Gratuit / Payant réduit) */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-stone-700 block">Prix</span>
        <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => onChange('priceType', 'all')}
            className={`py-1.5 rounded-lg transition ${
              filters.priceType === 'all'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tous
          </button>
          <button
            type="button"
            onClick={() => onChange('priceType', 'free')}
            className={`py-1.5 rounded-lg transition ${
              filters.priceType === 'free'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Gratuit
          </button>
          <button
            type="button"
            onClick={() => onChange('priceType', 'discounted')}
            className={`py-1.5 rounded-lg transition ${
              filters.priceType === 'discounted'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Réduit
          </button>
        </div>
      </div>

      {/* Catégories */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-stone-700 block">Catégories</span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange('category', cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg transition border font-medium ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
