import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Leaf,
  Store,
  Users,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-eco-50/80 via-white to-stone-50 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eco-100/80 text-eco-800 text-xs font-bold border border-eco-200">
            <Sparkles className="w-3.5 h-3.5 text-eco-600" />
            <span>Sauvons la bonne nourriture du gaspillage ensemble</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-stone-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Connectez les surplus alimentaires aux <span className="text-eco-600 underline decoration-eco-300">bonnes personnes</span>.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Restaurants, boulangeries et supermarchés partagent leurs invendus du jour à prix réduits ou gratuitement pour les associations caritatives et particuliers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/explore">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg shadow-eco-600/30 gap-2">
                <MapPin className="w-5 h-5" />
                <span>Explorer la carte des surplus</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Store className="w-5 h-5 text-terracotta-500" />
                <span>Proposer des invendus (Donneur)</span>
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12 border-t border-stone-200/80 mt-12">
            <div>
              <div className="text-3xl font-black text-stone-900">100%</div>
              <div className="text-xs text-stone-500 mt-0.5">Surplus sauvés</div>
            </div>
            <div>
              <div className="text-3xl font-black text-eco-600">-70%</div>
              <div className="text-xs text-stone-500 mt-0.5">Ou Gratuit pour assos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-stone-900">&lt; 5 km</div>
              <div className="text-xs text-stone-500 mt-0.5">En moyenne autour de vous</div>
            </div>
            <div>
              <div className="text-3xl font-black text-terracotta-600">0 Déchet</div>
              <div className="text-xs text-stone-500 mt-0.5">Objectif Zéro Gaspillage</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-eco-600">
            Simplicité & Rapidité
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Comment fonctionne la plateforme ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-stone-900 text-lg">
              Le commerce publie ses surplus
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              En fin de journée ou de service, le boulanger ou restaurateur indique la quantité disponible, l'horaire de retrait et les coordonnées GPS.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-eco-50 text-eco-600 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-stone-900 text-lg">
              Vous géolocalisez & réservez
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Consultez la carte interactive, filtrez selon vos besoins (boulangerie, plats chauds, dons gratuits) et réservez votre panier en 1 clic.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-lg">
              Retrait sécurisé avec code unique
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Récupérez votre commande chez le commerçant en présentant votre code de retrait unique. Tout est fluide, traçable et respectueux.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-stone-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-eco-500/20 text-eco-400 border border-eco-500/30">
              Pour les professionnels
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Vous êtes commerçant, traiteur ou restaurateur ?
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Ne jetez plus vos invendus à la poubelle. Valorisez vos invendus, touchez une nouvelle clientèle de proximité et participez concrètement à l'économie circulaire solidaire.
            </p>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-eco-400" />
                <span>Validation instantanée des retraits par code unique</span>
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-eco-400" />
                <span>Bilan d'impact carbone et gaspillage évité</span>
              </li>
            </ul>
            <Link to="/register">
              <Button variant="primary" size="md" className="gap-2 mt-4">
                <span>Créer un compte Commerçant</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-terracotta-400" />
              <span>Associations caritatives & Particuliers</span>
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              Les associations ont un accès prioritaire aux dons 100% gratuits pour organiser des distributions aux personnes démunies. Les particuliers bénéficient de réductions jusqu’à -70%.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-rose-400 shrink-0" />
              <div className="text-xs text-stone-300">
                <strong className="text-white block font-semibold">Une communauté solidaire</strong>
                Des dizaines de repas distribués chaque soir aux associations locales.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
