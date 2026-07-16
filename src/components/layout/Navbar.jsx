// components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEffect } from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  // Midnight slate is the app's default identity — darkMode starts true.
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/80 dark:bg-midnight/80 backdrop-blur-md border-b border-ink/5 dark:border-surface-border">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink dark:text-cream">
  Link<span className="text-brand-500">Up</span>
</Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/posts"
                className="hidden sm:inline text-sm font-medium text-ink/70 dark:text-paper/70 hover:text-brand-600 dark:hover:text-brand-400"
              >
                Dashboard
              </Link>
              <Link to={`/profile/${currentUser.id}`}>
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
