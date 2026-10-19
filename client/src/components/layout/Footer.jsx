import React from 'react';
import { UtensilsCrossed, Heart, Leaf } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-eco-600 flex items-center justify-center text-white">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              Food<span className="text-eco-400">Surplus</span>
            </span>
          </div>
          <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
            Plateforme communautaire citoyenne et solidaire. Nous réduisons le gaspillage
            alimentaire en reliant commerces locaux, associations caritatives et particuliers.
          </p>
          <div className="flex items-center gap-2 text-xs text-eco-400 font-medium">
            <Leaf className="w-4 h-4" />
            <span>Chaque panier sauvé représente en moyenne 1.5 kg de CO₂ évité.</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <a href="/explore" className="hover:text-eco-400 transition">
                Carte des surplus
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-eco-400 transition">
                Devenir commerçant donneur
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-eco-400 transition">
                Espace associations
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
            Impact
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Projet conçu avec amour pour notre planète et nos communautés locales.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
            <span>Fait avec</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>pour le zéro déchet</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Food Surplus & Community Share. Tous droits réservés.
      </div>
    </footer>
  );
};
