import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              email,
              full_name: email.split('@')[0], // Default name from email
              department: 'General',
              points: 0,
              level: 1,
            },
          ]);
        if (profileError) throw profileError;
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || (isSignUp ? 'Error creating account' : 'Invalid email or password'));
      // Set a timeout to re-enable the form
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000); // 5 second cooldown
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-blue-500" />
          <h1 className="ml-3 text-2xl font-bold">CogniTrain</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting
              ? 'Please wait...'
              : isSignUp
              ? 'Sign Up'
              : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => !isSubmitting && setIsSignUp(!isSignUp)}
              disabled={isSubmitting}
              className={`text-blue-500 hover:text-blue-600 text-sm ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;