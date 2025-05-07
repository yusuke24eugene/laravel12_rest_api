// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Configure Axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.defaults.baseURL = 'http://localhost:8000';

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie');
    axios.get('/user')
    .then(response => {
      setIsAuthenticated(true); // User is logged in
      setUser(response.data.name);
      navigate('/');
    })
    .catch(error => {
      setIsAuthenticated(false); // User is not logged in
      navigate('/login');
    });
  }, [isAuthenticated]);

  const logout = async (e) => {
    e.preventDefault();
    // Simulate API call
    try {
      // 1. First get Sanctum CSRF cookie
      await axios.get('/sanctum/csrf-cookie')
      .catch(error => {
        console.error('CSRF Error:', error);
      });

      // 2. Then send login request
      const response = await axios.post('/logout');

      // 3. Handle successful login
      if (response) console.log(response);

      // Redirect logic here (e.g., using react-router)
      navigate('/login');
 
    } catch (err) {
      console.log(err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold hover:text-yellow-400">
            <Link to="/">Grocery</Link>
        </div>
        
        <ul className="flex space-x-6">
          {
            isAuthenticated ? (
              <div className='flex space-x-6'>
                <p className='font-semibold'>{ user }</p>
                <li className="hover:text-yellow-400 cursor-pointer" onClick={logout}>Logout</li>  
              </div>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-yellow-400">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-yellow-400">Register</Link>
                </li> 
              </>
            )
          }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
