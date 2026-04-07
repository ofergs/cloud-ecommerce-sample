import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getCurrentUsername, logout } from '../services/auth';
import { cartApi } from '../services/api';

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUsername().then(setUsername);
  }, []);

  const { data: cart } = useQuery('cart', cartApi.get, {
    enabled: !!username,
    retry: false,
  });

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  async function handleLogout() {
    await logout();
    setUsername(null);
    navigate('/login');
  }

  return (
    <header className="font-sans">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <nav className="bg-brand text-white">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-2 px-4 py-2">
          {/* Logo */}
          <Link
            to="/products"
            className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded"
          >
            <span className="text-2xl font-extrabold tracking-tight">
              Shop<span className="text-accent">Cloud</span>
            </span>
          </Link>

          {/* Deliver to */}
          <Link
            to="/products"
            className="hidden md:flex items-end px-2 py-1 border border-transparent hover:border-white rounded"
          >
            <svg className="w-5 h-5 mb-1 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="leading-tight">
              <div className="text-xs text-gray-300">Deliver to</div>
              <div className="text-sm font-bold">Your Location</div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex flex-1 mx-2 rounded overflow-hidden">
            <select className="bg-gray-100 text-gray-700 text-xs px-2 border-r border-gray-300 hidden sm:block">
              <option>All</option>
            </select>
            <input
              type="text"
              placeholder="Search ShopCloud"
              className="flex-1 px-3 py-2 text-gray-900 text-sm focus:outline-none"
            />
            <button
              className="bg-accent hover:bg-accent-dark px-4 flex items-center justify-center"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-brand-dark" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Account */}
          {username ? (
            <div className="hidden md:block px-2 py-1 border border-transparent hover:border-white rounded leading-tight">
              <div className="text-xs">Hello, {username.split('@')[0]}</div>
              <button onClick={handleLogout} className="text-sm font-bold hover:text-accent">
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block px-2 py-1 border border-transparent hover:border-white rounded leading-tight"
            >
              <div className="text-xs">Hello, sign in</div>
              <div className="text-sm font-bold">Account &amp; Lists</div>
            </Link>
          )}

          {/* Orders */}
          <Link
            to={username ? '/orders' : '/login'}
            className="hidden lg:block px-2 py-1 border border-transparent hover:border-white rounded leading-tight"
          >
            <div className="text-xs">Returns</div>
            <div className="text-sm font-bold">&amp; Orders</div>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-end px-2 py-1 border border-transparent hover:border-white rounded relative"
          >
            <div className="relative">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 left-5 text-accent font-bold text-sm">
                {cartCount}
              </span>
            </div>
            <span className="text-sm font-bold ml-1 mb-1 hidden sm:inline">Cart</span>
          </Link>
        </div>
      </nav>

      {/* ── Secondary nav ──────────────────────────────────────────── */}
      <nav className="bg-brand-light text-white text-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-1 px-4 py-1 overflow-x-auto">
          <button className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All
          </button>
          <Link to="/products" className="px-2 py-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Today's Deals
          </Link>
          <Link to="/products" className="px-2 py-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Customer Service
          </Link>
          <Link to="/products" className="px-2 py-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Registry
          </Link>
          <Link to="/products" className="px-2 py-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Gift Cards
          </Link>
          <Link to="/products" className="px-2 py-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Sell
          </Link>
        </div>
      </nav>
    </header>
  );
}
