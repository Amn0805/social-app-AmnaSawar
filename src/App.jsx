// App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RequireAuth from './components/layout/RequireAuth';

const FeedPage = lazy(() => import('./pages/FeedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'));
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'));
const EditPost = lazy(() => import('./pages/dashboard/EditPost'));
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'));
const SavedPostsPage = lazy(() => import('./pages/dashboard/SavedPostsPage'));

const PeoplePage = lazy(() => import('./pages/PeoplePage'));
const FriendRequestsPage = lazy(() => import('./pages/FriendRequestsPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

function PageLoader() {
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            <Route
              path="/people"
              element={
                <RequireAuth>
                  <PeoplePage />
                </RequireAuth>
              }
            />
            <Route
              path="/requests"
              element={
                <RequireAuth>
                  <FriendRequestsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/friends"
              element={
                <RequireAuth>
                  <FriendsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />
            <Route
              path="/chat/:userId"
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<PostsDashboard />} />
              <Route path="posts" element={<PostsDashboard />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:postId" element={<EditPost />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="saved" element={<SavedPostsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}