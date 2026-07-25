// pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { useAI } from '../hooks/useAI';
import { storage } from '../utils/storage';
import { getFriendsOf, areFriends } from '../utils/friendHelpers';
import {
  getConversations,
  isOnline,
  getAiSettings,
  setAiSettings,
} from '../utils/chatHelpers';
import Avatar from '../components/ui/Avatar';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import AISuggestionChips from '../components/chat/AISuggestionChips';
import AIChatBanner from '../components/chat/AIChatBanner';
import TypingIndicator from '../components/chat/TypingIndicator';
import MessageSearch from '../components/chat/MessageSearch';
import AIPersonalitySelector from '../components/chat/AIPersonalitySelector';

const PERSONALITY_LABELS = {
  friendly: 'Friendly',
  professional: 'Professional',
  casual: 'Casual',
  funny: 'Funny',
};

export default function ChatPage() {
  const { userId: friendId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { suggestReplies, generateAutoReply } = useAI();
  const messagesEndRef = useRef(null);
  const lastProcessedMessageId = useRef(null);

  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(!!friendId);
  const [draftText, setDraftText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState([]);

  const [aiSettingsState, setAiSettingsState] = useState(() => getAiSettings(currentUser.id));
  const aiMode = aiSettingsState.aiChatEnabled ? 'auto' : aiSettingsState.aiMode || 'suggest';
  const personality = aiSettingsState.aiPersonality || 'friendly';

  const [suggestions, setSuggestions] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [autoReplyError, setAutoReplyError] = useState('');

  const friends = getFriendsOf(currentUser.id);
  const conversations = getConversations(currentUser.id, friends);
  const friend = friendId ? storage.getUsers().find((u) => u.id === friendId) : null;

  const { messages, sendMessage, markRead, toggleReaction } = useChat(currentUser.id, friendId);

  useEffect(() => {
    if (friendId && friend && !areFriends(currentUser.id, friendId)) {
      navigate('/friends', { state: { message: 'You can only message friends' } });
    }
  }, [friendId, friend, currentUser.id, navigate]);

  useEffect(() => {
    if (friendId) {
      markRead();
      setShowMobileChat(true);
      setSuggestions([]);
      setSearchOpen(false);
      lastProcessedMessageId.current = null;
    }
  }, [friendId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!searchOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, searchOpen]);

  useEffect(() => {
    if (!friend || messages.length === 0 || aiMode === 'off') return;

    const last = messages[messages.length - 1];

    if (last.senderId === currentUser.id) {
      setSuggestions([]);
      return;
    }

    if (last.id === lastProcessedMessageId.current) return;
    lastProcessedMessageId.current = last.id;

    const recent = messages.slice(-5).map((m) => ({
      senderName: m.senderId === currentUser.id ? currentUser.name : friend.name,
      content: m.type === 'text' ? m.content : `[${m.type}]`,
    }));

    if (aiMode === 'suggest') {
      suggestReplies({
        userName: currentUser.name,
        friendName: friend.name,
        recentMessages: recent,
        personality,
      })
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }

    if (aiMode === 'auto') {
      setIsAiThinking(true);
      const timer = setTimeout(async () => {
        try {
          const reply = await generateAutoReply({
            userName: currentUser.name,
            friendName: friend.name,
            recentMessages: recent,
            personality,
          });
          sendMessage({ type: 'text', content: reply, aiGenerated: true });
        } catch (err) {
          setAutoReplyError('AI reply failed — please reply manually');
          setTimeout(() => setAutoReplyError(''), 4000);
        } finally {
          setIsAiThinking(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages, friend, aiMode, personality, currentUser.id, currentUser.name]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectConversation(id) {
    navigate(`/chat/${id}`);
  }

  function handleSend({ type, content, aiGenerated = false }) {
    sendMessage({ type, content, aiGenerated });
  }

  function handleSelectAiMode(mode) {
    const next = { ...aiSettingsState, aiChatEnabled: mode === 'auto', aiMode: mode };
    setAiSettingsState(next);
    setAiSettings(currentUser.id, next);
    setAiMenuOpen(false);
    setSuggestions([]);
  }

  function handlePersonalityChange(value) {
    const next = { ...aiSettingsState, aiPersonality: value };
    setAiSettingsState(next);
    setAiSettings(currentUser.id, next);
  }

  const friendOnline = friend ? isOnline(friend) : false;

  return (
   <div className="max-w-5xl mx-auto h-[calc(100vh-6.5rem)] sm:h-[calc(100vh-4rem)] flex border-t border-ink/5 dark:border-surface-border">
      <aside
        className={clsx(
          'w-full sm:w-72 border-r border-ink/5 dark:border-surface-border flex-col',
          showMobileChat && friendId ? 'hidden sm:flex' : 'flex'
        )}
      >
        <div className="px-4 py-4 border-b border-ink/5 dark:border-surface-border">
          <h1 className="font-display text-lg font-semibold text-ink dark:text-paper">Chat</h1>
        </div>
        <ConversationList
          conversations={conversations}
          activeFriendId={friendId}
          onSelect={handleSelectConversation}
        />
      </aside>

      <section
        className={clsx(
          'flex-1 flex flex-col',
          !showMobileChat || !friendId ? 'hidden sm:flex' : 'flex'
        )}
      >
        {!friend ? (
          <div className="flex-1 grid place-items-center text-mutedLight dark:text-muted text-sm">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-ink/5 dark:border-surface-border">
              <button
                onClick={() => setShowMobileChat(false)}
                className="sm:hidden text-ink dark:text-paper mr-1"
                aria-label="Back to conversations"
              >
                ←
              </button>
              <Link to={`/profile/${friend.id}`} className="relative">
                <Avatar src={friend.avatar} name={friend.name} size="sm" />
                {friendOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-surface" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${friend.id}`}
                  className="font-display font-semibold text-sm text-ink dark:text-paper hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {friend.name}
                </Link>
                <p className="text-xs text-mutedLight dark:text-muted">
                  {friendOnline ? 'Online' : 'Offline'}
                  {aiMode !== 'off' && ` · AI: ${PERSONALITY_LABELS[personality]}`}
                </p>
              </div>

              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search messages"
                className="w-8 h-8 grid place-items-center rounded-full text-mutedLight dark:text-muted hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              <div className="relative">
                <button
                  onClick={() => setAiMenuOpen((v) => !v)}
                  className="text-sm px-3 py-1.5 rounded-lg text-mutedLight dark:text-muted hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
                >
                  ✨ AI
                </button>
                {aiMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 max-w-[90vw] bg-white dark:bg-surface border border-ink/10 dark:border-surface-border rounded-xl shadow-card py-1 z-10 animate-fadeUp">
                    <button
                      onClick={() => handleSelectAiMode('suggest')}
                      className={clsx(
                        'w-full text-left px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-white/5',
                        aiMode === 'suggest'
                          ? 'text-brand-600 dark:text-brand-400 font-medium'
                          : 'text-ink dark:text-paper'
                      )}
                    >
                      Suggest replies only
                    </button>
                    <button
                      onClick={() => handleSelectAiMode('auto')}
                      className={clsx(
                        'w-full text-left px-3 py-2 text-sm hover:bg-ink/5 dark:hover:bg-white/5',
                        aiMode === 'auto'
                          ? 'text-brand-600 dark:text-brand-400 font-medium'
                          : 'text-ink dark:text-paper'
                      )}
                    >
                      Let AI reply for me
                    </button>
                    <button
                      onClick={() => handleSelectAiMode('off')}
                      className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-ink/5 dark:hover:bg-white/5"
                    >
                      Turn off AI
                    </button>

                    <AIPersonalitySelector value={personality} onChange={handlePersonalityChange} />
                  </div>
                )}
              </div>
            </div>

            {aiMode === 'auto' && <AIChatBanner onDisable={() => handleSelectAiMode('suggest')} />}

            {autoReplyError && (
              <div className="text-center text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border-b border-rose-500/20 py-1.5 animate-fadeUp">
                {autoReplyError}
              </div>
            )}

            {searchOpen && (
              <MessageSearch
                messages={messages}
                onClose={() => {
                  setSearchOpen(false);
                  setHighlightedIds([]);
                }}
                onHighlightIds={setHighlightedIds}
              />
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-mutedLight dark:text-muted mt-8">
                  Say hello to {friend.name} 👋
                </p>
              ) : (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUser.id}
                    friendAvatar={friend.avatar}
                    friendName={friend.name}
                    isHighlighted={highlightedIds.includes(message.id)}
                    currentUserId={currentUser.id}
                    onToggleReaction={toggleReaction}
                  />
                ))
              )}

              {isAiThinking && (
                <div className="flex items-end gap-2 mb-1">
                  <Avatar src={friend.avatar} name={friend.name} size="sm" />
                  <TypingIndicator />
                </div>
              )}

              {suggestions.length > 0 && (
                <AISuggestionChips
                  suggestions={suggestions}
                  onSelect={(text) => {
                    setDraftText(text);
                    setSuggestions([]);
                  }}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            <MessageInput
              text={draftText}
              onTextChange={setDraftText}
              onSend={handleSend}
              disabled={isAiThinking}
            />
          </>
        )}
      </section>
    </div>
  );
}