import { useState } from 'react';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  // Configure Axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.defaults.baseURL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username) setErrorUsername('Username is required');
    if (!password) setErrorPassword('Password is required');

    if (!errorUsername && !errorPassword) {
      // Simulate API call
      try {
        // 1. First get Sanctum CSRF cookie
        await axios.get('/sanctum/csrf-cookie')
          .catch(error => {
            console.error('CSRF Error:', error);
          });

        // 2. Then send login request
        const response = await axios.post('/login', {
          name: username,
          password: password,
        });

        // 3. Handle successful login
        console.log('Login successful', response.data);

        // Redirect logic here (e.g., using react-router)
        window.location.replace("http://localhost:5173/");
      } catch (err) {
        if (err.response && err.response.data.message === 'Invalid credentials') setLoginError(err.response.data.message);
        else setLoginError('There is an internal server error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Login</h2>
          <p className="mt-1 text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Register here
            </a>
          </p>
        </div>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4 p-2">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errorUsername ? 'border-red-300' : 'border-gray-300'} ${loginError ? 'border-red-300' : ''} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition duration-150`}
                />
              </div>
              {errorUsername && <p className="mt-1 text-sm text-red-600">{errorUsername}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errorPassword ? 'border-red-300' : 'border-gray-300'} ${loginError ? 'border-red-300' : ''} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition duration-150`}
                />
              </div>
              {errorPassword && <p className="mt-1 text-sm text-red-600">{errorPassword}</p>}
            </div>
            {loginError && <p className="mt-1 text-center w-full text-sm text-red-600">{loginError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}