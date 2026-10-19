import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  MapPin,
  UtensilsCrossed,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  HeartHandshake,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isDonor } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-eco-400 flex items-center justify-center text-white shadow-md shadow-eco-500/20 group-hover:scale-105 transition">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 tracking-tight text-lg flex items-center gap-1">
              Food<span className="text-eco-600">Surplus</span>
            </span>
            <span className="block text-[10px] text-stone-400 font-medium -mt-1">
              & Community Share
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-eco-600 transition"
          >
            <MapPin className="w-4 h-4 text-eco-600" />
            Explorer la Carte
          </Link>
          <Link
            to="/about"
            className="text-sm font-semibold text-stone-600 hover:text-eco-600 transition"
          >
            Notre Mission
          </Link>
        </nav>

        {/* User Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4 text-eco-600" />
                  <span>Dashboard {isDonor && '(Commerçant)'}</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  Rejoindre
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-base font-medium text-stone-700"
          >
            <MapPin className="w-5 h-5 text-eco-600" />
            Explorer les surplus
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-stone-700"
              >
                <LayoutDashboard className="w-5 h-5 text-eco-600" />
                Tableau de bord
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 py-2 text-base font-medium text-rose-600 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Créer un compte
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
