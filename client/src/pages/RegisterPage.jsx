import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Store, User, Mail, Lock, Phone, Building, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' ou 'beneficiary'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    street: '',
    city: 'Paris',
    postalCode: '75001',
    // Coordonnées par défaut (Paris)
    lng: 2.3522,
    lat: 48.8566,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        phone: formData.phone,
        organizationName: formData.organizationName || formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          formattedAddress: `${formData.street || ''}, ${formData.postalCode} ${formData.city}`,
        },
        location: {
          type: 'Point',
          // [longitude, latitude]
          coordinates: [parseFloat(formData.lng) || 2.3522, parseFloat(formData.lat) || 48.8566],
        },
      };

      await register(payload);
      addToast('Compte créé avec succès ! Bienvenue dans la communauté.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl border border-stone-200/80 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Rejoignez la communauté Zéro Déchet
          </h2>
          <p className="text-xs text-stone-500">
            Choisissez votre profil pour commencer à partager ou sauver des surplus
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition ${
              role === 'donor'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4 text-terracotta-500" />
            <span>Commerçant (Donneur)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('beneficiary')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition ${
              role === 'beneficiary'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 text-eco-600" />
            <span>Bénéficiaire / Particulier</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {role === 'donor' ? 'Nom du responsable' : 'Nom & Prénom'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                {role === 'donor' ? 'Nom du commerce / Enseigne' : 'Association ou Particulier'}
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder={role === 'donor' ? 'Boulangerie des Délices' : 'Optionnel'}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@commerce.com"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 caractères"
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-stone-700">Adresse</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="10 rue de la Paix"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Paris"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={loading}
          >
            <span>Créer mon compte</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-eco-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
