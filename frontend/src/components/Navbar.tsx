import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUsername, logout } from '../services/auth';

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUsername().then(setUsername);
  }, []);

  async function handleLogout() {
    await logout();
    setUsername(null);
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/products" className="text-xl font-bold text-indigo-600">
          ShopCloud
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="text-gray-700 hover:text-indigo-600">
            Products
          </Link>
          {username && (
            <>
              <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
                Cart
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-indigo-600">
                Orders
              </Link>
            </>
          )}
          {username ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{username}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
