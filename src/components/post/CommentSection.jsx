// components/post/CommentSection.jsx handles comments to load, display , add and delete 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

//postid ki base py jo prop milti h 
export default function CommentSection({ postId }) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { addComment, deleteComment } = usePosts();

  const [comments, setComments] = useState(() =>
    storage
      .getComments()       //read comments 
      .filter((c) => c.postId === postId)     //filter current comment 
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //comment sort according to time  
  );
  const [text, setText] = useState('');    //comment input state 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null); // which comment shows Yes/No


  //read comments again from local storage 
  function refresh() {
    setComments(
      storage
        .getComments()
        .filter((c) => c.postId === postId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
  }

  function handleAddComment(e) {
    e.preventDefault();      //comment submit hony pr brwoser reload hota h us ko stop krny ky liye 
    const trimmed = text.trim();
    if (!trimmed) return;


    //loading state 
    setIsSubmitting(true);
    addComment(postId, currentUser.id, trimmed);
    setText('');   //after submission input empty 
    refresh();   //  update ui
    setIsSubmitting(false);   // loading stop 
  }


  function handleDeleteConfirmed(commentId) {
    deleteComment(commentId);
    setConfirmingId(null);
    refresh();
  }

  //users ko easliy finable objects m convert krta h 
  const authorsById = Object.fromEntries(storage.getUsers().map((u) => [u.id, u]));

  return (
    <div className="mt-6">
      <h2 className="font-display text-base font-semibold text-ink dark:text-paper mb-4">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* Add comment */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex items-start gap-3 mb-6">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-ink/10 dark:border-surface-border bg-white dark:bg-surface px-4 py-2 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
            />
            <Button type="submit" size="sm" disabled={!text.trim()} isLoading={isSubmitting}>
              Post
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => navigate('/login', { state: { message: 'Login to comment' } })}
          className="w-full text-center text-sm text-mutedLight dark:text-muted bg-ink/5 dark:bg-white/5 rounded-xl py-3 mb-6 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          Login to comment
        </button>
      )}

      {/* Comment list create ui block for each comment  */ }   
      <div className="space-y-4">
        {comments.map((comment) => {
          const author = authorsById[comment.authorId];
          if (!author) return null;
          const isOwn = currentUser?.id === comment.authorId; //chk comment is current login user or not agr true so show delete button if no then don't show 

          return (
            <div key={comment.id} className="flex items-start gap-3 animate-fadeUp">
              <Avatar src={author.avatar} name={author.name} size="sm" />
              <div className="flex-1 bg-ink/[0.03] dark:bg-white/[0.04] rounded-xl px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-ink dark:text-paper">
                    {author.name}
                  </span>
                  <span className="text-xs text-mutedLight dark:text-muted font-mono shrink-0">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-ink/90 dark:text-paper/90 mt-0.5 whitespace-pre-wrap">
                  {comment.text}
                </p>
                 
                 {/* delete permisiion only for own comments not for others  */}
                {isOwn && (
                  <div className="mt-2">
                    {confirmingId === comment.id ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-mutedLight dark:text-muted">Are you sure?</span>
                        <button
                          onClick={() => handleDeleteConfirmed(comment.id)}
                          className="text-rose-500 font-medium hover:underline"
                        >
                          Yes
                        </button>
                        <span className="text-mutedLight dark:text-muted">/</span>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="text-mutedLight dark:text-muted font-medium hover:underline"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(comment.id)}
                        className="text-xs text-mutedLight dark:text-muted hover:text-rose-500 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}