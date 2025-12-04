import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-dark px-4 transition-colors duration-200">
            <div className="w-full space-y-8 p-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-light">
                        Sign in to your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 text-sm p-3 rounded-md text-center border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-light">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-orange hover:text-orange/80">
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
