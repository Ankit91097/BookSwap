import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
    setIsMenuOpen(false); // Close mobile menu after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Title */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold hover:text-blue-200 transition"
            onClick={closeMenu}
          >
            BookSwap
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/my-books"
                  className="hover:text-blue-200 transition font-medium"
                >
                  My Books
                </Link>
                <Link
                  to="/my-requests"
                  className="hover:text-blue-200 transition font-medium"
                >
                  My Requests
                </Link>
                <Link
                  to="/received-requests"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Received Requests
                </Link>
                <span className="text-blue-200 text-sm">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white"
            aria-label="Toggle menu"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-500">
              {user ? (
                <>
                  <div className="px-3 py-2 text-blue-200 text-sm font-medium">
                    Welcome, {user.name}
                  </div>
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/my-books"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    My Books
                  </Link>
                  <Link
                    to="/my-requests"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    My Requests
                  </Link>
                  <Link
                    to="/received-requests"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    Received Requests
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
