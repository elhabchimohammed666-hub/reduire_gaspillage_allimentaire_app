import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CountdownTimer } from '../features/listings/CountdownTimer';
import {
  PlusCircle,
  QrCode,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Store,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, isDonor } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(isDonor ? 'listings' : 'my_reservations');

  // État Donneur
  const [myListings, setMyListings] = useState([]);
  const [donorReservations, setDonorReservations] = useState([]);
  const [claimCode, setClaimCode] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  // Formulaire création offre (Donneur)
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: 'bakery',
    quantity: '3 paniers',
    originalPrice: 12,
    discountedPrice: 3.5,
    isFree: false,
    pickupDurationHours: 4,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'],
  });
  const [createLoading, setCreateLoading] = useState(false);

  // État Bénéficiaire
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des données selon le rôle
  const loadData = async () => {
    setLoading(true);
    try {
      if (isDonor) {
        const [listingsRes, resvRes] = await Promise.all([
          api.get('/listings/my-listings'),
          api.get('/reservations/donor'),
        ]);
        if (listingsRes.success) setMyListings(listingsRes.data || []);
        if (resvRes.success) setDonorReservations(resvRes.data || []);
      } else {
        const res = await api.get('/reservations/my');
        if (res.success) setMyReservations(res.data || []);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isDonor]);

  // Validation d'un code de retrait par le commerçant
  const handleClaimCode = async (e) => {
    e.preventDefault();
    if (!claimCode.trim()) return;

    setClaimLoading(true);
    try {
      const res = await api.post('/reservations/claim', { pickupCode: claimCode.trim() });
      if (res.success) {
        addToast('Code validé avec succès ! Panier remis au bénéficiaire. 🎉', 'success');
        setClaimCode('');
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setClaimLoading(false);
    }
  };

  // Création d'une nouvelle offre par le commerçant
  const handleCreateListing = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const now = new Date();
      const pickupEnd = new Date(now.getTime() + newListing.pickupDurationHours * 60 * 60 * 1000);

      const payload = {
        title: newListing.title,
        description: newListing.description,
        category: newListing.category,
        quantity: newListing.quantity,
        originalPrice: Number(newListing.originalPrice),
        discountedPrice: Number(newListing.discountedPrice),
        isFree: newListing.isFree || Number(newListing.discountedPrice) === 0,
        pickupStart: now.toISOString(),
        pickupEnd: pickupEnd.toISOString(),
        location: user?.location || {
          type: 'Point',
          coordinates: [2.3522, 48.8566],
        },
        address: user?.address || {
          formattedAddress: 'Paris, France',
        },
        images: newListing.images,
      };

      const res = await api.post('/listings', payload);
      if (res.success) {
        addToast('Votre offre de surplus est maintenant en ligne sur la carte ! 🚀', 'success');
        setActiveTab('listings');
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  // Annulation d'une réservation (Bénéficiaire)
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;

    try {
      const res = await api.patch(`/reservations/${reservationId}/cancel`);
      if (res.success) {
        addToast('Réservation annulée. Le surplus est de nouveau disponible.', 'info');
        loadData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / User Welcome */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-eco-600">
              Tableau de bord {isDonor ? 'Commerçant / Donneur' : 'Bénéficiaire'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mt-1">
            Bonjour, {user?.organizationName || user?.name} 👋
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Gérez vos annonces, suivez vos réservations et validez vos codes de retrait.
          </p>
        </div>

        {isDonor && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('create')}
              className="gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier un surplus</span>
            </Button>
          </div>
        )}
      </div>

      {/* RÔLE 1 : COMMERÇANT / DONATEUR */}
      {isDonor ? (
        <div className="space-y-6">
          {/* Onglets Commerçant */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'listings'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Mes Offres en cours ({myListings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'claim'
                  ? 'bg-eco-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Valider un code de retrait</span>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'reservations'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Réservations reçues ({donorReservations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nouvelle offre</span>
            </button>
          </div>

          {/* Tab 1 : Mes Offres */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          item.status === 'available'
                            ? 'success'
                            : item.status === 'reserved'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-bold text-eco-700">
                        {item.isFree ? 'GRATUIT' : `${item.discountedPrice}€`}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>{item.quantity}</span>
                      <CountdownTimer targetDate={item.pickupEnd} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2 : Valider un code de retrait (Commerçant) */}
          {activeTab === 'claim' && (
            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-lg space-y-6 text-center">
              <div className="w-14 h-14 bg-eco-100 text-eco-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <QrCode className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  Validation du Code de Retrait
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Saisissez le code alphanumérique unique présenté par le client ou l'association
                  (ex : FS-8X4K).
                </p>
              </div>

              <form onSubmit={handleClaimCode} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="FS-XXXXX"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                  className="w-full text-center text-2xl font-black font-mono tracking-widest py-3 border-2 border-stone-300 rounded-2xl focus:border-eco-600 focus:outline-none uppercase bg-stone-50"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full py-3"
                  isLoading={claimLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider et Clôturer le Don
                </Button>
              </form>
            </div>
          )}

          {/* Tab 3 : Réservations Reçues */}
          {activeTab === 'reservations' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-stone-100 font-bold text-stone-900 text-sm">
                Historique des Réservations
              </div>
              <div className="divide-y divide-stone-100">
                {donorReservations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">
                    Aucune réservation reçue pour le moment.
                  </div>
                ) : (
                  donorReservations.map((resv) => (
                    <div
                      key={resv._id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                            {resv.pickupCode}
                          </span>
                          <Badge
                            variant={
                              resv.status === 'claimed'
                                ? 'success'
                                : resv.status === 'cancelled'
                                ? 'danger'
                                : 'warning'
                            }
                          >
                            {resv.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-stone-900">
                          {resv.listingId?.title || 'Offre réservée'}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-stone-500">
                          <span>Bénéficiaire : {resv.beneficiaryId?.name}</span>
                          {resv.beneficiaryId?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {resv.beneficiaryId.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs text-stone-400">
                        {new Date(resv.createdAt).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4 : Formulaire Nouvelle Offre */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-900">
                  Créer une nouvelle offre de surplus
                </h3>
                <p className="text-xs text-stone-500">
                  Elle apparaîtra instantanément sur la carte interactive pour les bénéficiaires à
                  proximité.
                </p>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Titre de l'offre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5 Paniers viennoiseries et pains du jour"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Détaillez le contenu, conservation, etc."
                    value={newListing.description}
                    onChange={(e) =>
                      setNewListing({ ...newListing, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Catégorie</label>
                    <select
                      value={newListing.category}
                      onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500"
                    >
                      <option value="bakery">Boulangerie / Pâtisserie</option>
                      <option value="meals">Plats cuisinés</option>
                      <option value="produce">Fruits & Légumes</option>
                      <option value="dairy">Produits laitiers</option>
                      <option value="groceries">Épicerie</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Quantité</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 3 paniers de 2kg"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Prix Réduit (€)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newListing.discountedPrice}
                      onChange={(e) =>
                        setNewListing({ ...newListing, discountedPrice: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Prix Initial (€)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newListing.originalPrice}
                      onChange={(e) =>
                        setNewListing({ ...newListing, originalPrice: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Durée retrait (h)</label>
                    <input
                      type="number"
                      min="1"
                      max="48"
                      value={newListing.pickupDurationHours}
                      onChange={(e) =>
                        setNewListing({ ...newListing, pickupDurationHours: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={createLoading}
                  >
                    Mettre en ligne l'offre
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* RÔLE 2 : BÉNÉFICIAIRE / PARTICULIER */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-lg">
              Mes Réservations & Bons de Retrait ({myReservations.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-stone-400">
              Chargement de vos réservations...
            </div>
          ) : myReservations.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-bold text-stone-800 text-sm">Aucune réservation active</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explorez la carte pour trouver des surplus disponibles autour de chez vous et
                réservez votre premier panier !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myReservations.map((resv) => (
                <div
                  key={resv._id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Header ticket */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          resv.status === 'claimed'
                            ? 'success'
                            : resv.status === 'cancelled'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {resv.status === 'pending'
                          ? 'À RÉCUPÉRER'
                          : resv.status === 'claimed'
                          ? 'RÉCUPÉRÉ'
                          : 'ANNULÉ'}
                      </Badge>

                      <span className="text-xs text-stone-400">
                        {new Date(resv.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Code de Retrait Unique Mis en Avant */}
                    <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                        Code de Retrait à montrer au commerçant
                      </span>
                      <div className="text-2xl font-black font-mono tracking-widest text-eco-700">
                        {resv.pickupCode}
                      </div>
                    </div>

                    {/* Listing & Donor Info */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-stone-900 text-sm">
                        {resv.listingId?.title || 'Surplus alimentaire'}
                      </h4>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-stone-400" />
                        {resv.donorId?.organizationName || resv.donorId?.name}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {resv.donorId?.address?.formattedAddress || 'Adresse sur place'}
                      </p>
                    </div>

                    {/* Countdown */}
                    {resv.listingId?.pickupEnd && resv.status === 'pending' && (
                      <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                        <span className="text-stone-500">Temps restant :</span>
                        <CountdownTimer targetDate={resv.listingId.pickupEnd} />
                      </div>
                    )}
                  </div>

                  {resv.status === 'pending' && (
                    <div className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelReservation(resv._id)}
                        className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        Annuler la réservation
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
