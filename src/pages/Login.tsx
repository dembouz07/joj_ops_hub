import { useState, FormEvent } from 'react';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  return (
    <div className="h-screen bg-green-900 flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <div className="mb-3 flex items-center gap-4">
            <img 
              src="/JOH.png" 
              alt="JOJ Logo" 
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-display font-bold text-center leading-tight mb-4 text-white drop-shadow-lg">
            JOJ OPS HUB
          </h1>
          <p className="text-green-100 text-xl text-center mb-2 drop-shadow-md">
            Jeux Olympiques de la Jeunesse
          </p>
          <p className="text-gold-300 text-lg font-semibold text-center mb-12 drop-shadow-md">
            Dakar 2026
          </p>
          <div className="grid grid-cols-3 gap-6 w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-300">8</p>
              <p className="text-green-100 text-sm">Sites</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-300">94K+</p>
              <p className="text-green-100 text-sm">Visiteurs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-300">7</p>
              <p className="text-green-100 text-sm">Modules</p>
            </div>
          </div>
          {/* <div className="mt-16 flex gap-2 items-center">
            <div className="w-8 h-2 rounded-full bg-green-400/60" />
            <div className="w-8 h-2 rounded-full bg-gold-400/60" />
            <div className="w-8 h-2 rounded-full bg-senred-400/60" />
          </div>
          <p className="mt-3 text-green-100 text-sm drop-shadow-md">République du Sénégal</p> */}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-sand-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img 
              src="/JOH.png" 
              alt="JOJ Logo" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold text-green-900">JOJ OPS HUB</h2>
              <p className="text-sm text-green-600">Dakar 2026</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-green-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-500">
              Accédez au centre de contrôle opérationnel des JOJ.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                placeholder="votre@email.sn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-senred-50 border border-senred-200 text-senred-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-5 h-1.5 rounded-full bg-green-600" />
            <div className="w-5 h-1.5 rounded-full bg-gold-500" />
            <div className="w-5 h-1.5 rounded-full bg-senred-500" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Système sécurisé — JOJ Dakar 2026
          </p>
        </div>
      </div>
    </div>
  );
}
