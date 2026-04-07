import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, confirmRegistration } from '../services/auth';

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      setStep('confirm');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmRegistration(email, code);
      navigate('/login');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {step === 'register' ? 'Create account' : 'Confirm your email'}
      </h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">{error}</p>}
        {step === 'register' ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              We sent a confirmation code to <strong>{email}</strong>. Enter it below.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Confirming…' : 'Confirm'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
