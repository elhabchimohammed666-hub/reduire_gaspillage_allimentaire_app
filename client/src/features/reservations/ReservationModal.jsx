import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  QrCode,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const ReservationModal = ({ isOpen, onClose, listing, onReservationComplete }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);

  if (!listing) return null;

  const handleConfirmReservation = async () => {
    if (!isAuthenticated) {
      addToast('Veuillez vous connecter pour réserver ce surplus.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reservations', {
        listingId: listing._id,
        notes,
      });

      if (res.success && res.data) {
        setReservationResult(res.data);
        addToast('Réservation confirmée avec succès ! 🎉', 'success');
        if (onReservationComplete) {
          onReservationComplete(res.data);
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReservationResult(null);
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        reservationResult
          ? 'Votre Bon de Retrait (Reçu)'
          : 'Confirmer votre réservation'
      }
      maxWidth="max-w-md"
    >
      {reservationResult ? (
        // Confirmation View with Pickup Code
        <div className="space-y-6 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-stone-900">
              Réservation Validée !
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Présentez ce code de retrait au commerçant lors de la récupération.
            </p>
          </div>

          {/* Ticket / Reçu de retrait avec Code Unique */}
          <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
              Code de Retrait Unique
            </div>
            <div className="text-3xl font-black text-eco-700 tracking-wider font-mono">
              {reservationResult.pickupCode}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-200 text-xs text-stone-600">
              <QrCode className="w-4 h-4 text-stone-400" />
              <span>Listing : {listing.title}</span>
            </div>
          </div>

          <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 shrink-0" />
              Créneau de retrait impératif :
            </p>
            <p>
              Avant le {new Date(listing.pickupEnd).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-[11px] text-amber-700 font-medium pt-1">
              Adresse : {listing.address?.formattedAddress || 'Voir sur la carte'}
            </p>
          </div>

          <Button variant="primary" onClick={handleClose} className="w-full">
            Fermer et voir mes réservations
          </Button>
        </div>
      ) : (
        // Initial Booking Form
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
            {listing.images && listing.images[0] && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-stone-900 truncate">
                {listing.title}
              </h4>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Store className="w-3.5 h-3.5 text-stone-400" />
                {listing.donor?.organizationName || listing.donor?.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-black text-eco-700">
                  {listing.isFree ? 'GRATUIT' : `${listing.discountedPrice?.toFixed(2)}€`}
                </span>
                <span className="text-[11px] text-stone-400">
                  Quantité : {listing.quantity}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-600 bg-eco-50/60 border border-eco-200/50 p-3 rounded-xl">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-eco-600 shrink-0" />
              <span>
                {listing.address?.formattedAddress ||
                  `${listing.address?.street || ''}, ${listing.address?.city || ''}`}
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-eco-600 shrink-0" />
              <span>
                Fin de retrait :{' '}
                {new Date(listing.pickupEnd).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 block">
              Remarque éventuelle (allergies, heure d'arrivée...) :
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : J'arrive à 18h30 avec mon propre sac isotherme."
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleConfirmReservation}
            >
              <span>Confirmer la réservation</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
