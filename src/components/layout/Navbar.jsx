// components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { storage } from '../../utils/storage';
import { getPendingReceivedCount } from '../../utils/friendHelpers';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import RequestBadge from '../friends/RequestBadge';

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated) return;

    function refreshBadges() {
      setPendingCount(getPendingReceivedCount(currentUser.id));
      const unread = storage
        .getMessages()
        .filter((m) => m.receiverId === currentUser.id && !m.read).length;
      setUnreadCount(unread);
    }

    refreshBadges();
    const interval = setInterval(refreshBadges, 2000);
    window.addEventListener('storage', refreshBadges);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refreshBadges);
    };
  }, [isAuthenticated, currentUser?.id]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/80 dark:bg-midnight/80 backdrop-blur-md border-b border-ink/5 dark:border-surface-border">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 gap-2">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink dark:text-paper shrink-0">
          Link<span className="text-brand-600 dark:text-brand-400">Up</span>
        </Link>

        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-ink/70 dark:text-paper/70">
            <Link to="/people" className="hover:text-brand-600 dark:hover:text-brand-400">
              People
            </Link>
            <Link to="/friends" className="hover:text-brand-600 dark:hover:text-brand-400">
              Friends
            </Link>
            <Link to="/chat" className="relative flex items-center hover:text-brand-600 dark:hover:text-brand-400">
              Chat
              <RequestBadge count={unreadCount} />
            </Link>
            <Link
              to="/requests"
              aria-label="Friend requests"
              className="relative flex items-center hover:text-brand-600 dark:hover:text-brand-400"
            >
              <BellIcon />
              <RequestBadge count={pendingCount} />
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0">
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

      {/* Mobile: friend/chat links + bell as a second row. Fixed height
          (h-10) so pages like ChatPage can reliably subtract the total
          navbar height (h-16 + h-10) in their viewport calculations. */}
      {isAuthenticated && (
        <div className="sm:hidden flex items-center gap-4 h-10 px-4 text-sm font-medium text-ink/70 dark:text-paper/70 overflow-x-auto">
          <Link to="/people" className="whitespace-nowrap hover:text-brand-600 dark:hover:text-brand-400">
            People
          </Link>
          <Link to="/friends" className="whitespace-nowrap hover:text-brand-600 dark:hover:text-brand-400">
            Friends
          </Link>
          <Link to="/chat" className="relative flex items-center whitespace-nowrap hover:text-brand-600 dark:hover:text-brand-400">
            Chat
            <RequestBadge count={unreadCount} />
          </Link>
          <Link to="/requests" aria-label="Friend requests" className="relative flex items-center whitespace-nowrap hover:text-brand-600 dark:hover:text-brand-400">
            <BellIcon />
            <RequestBadge count={pendingCount} />
          </Link>
        </div>
      )}
    </header>
  );
}