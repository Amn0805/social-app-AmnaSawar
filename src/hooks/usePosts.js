// hooks/usePosts.js
import { useState, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';

// Centralizes every post/like/comment mutation so components never
// touch storage.js directly for this data. Call refresh() after any
// mutation made elsewhere if you need this hook's `posts` to catch up.
export function usePosts() {
  const [posts, setPosts] = useState(() => storage.getPosts());

  const refresh = useCallback(() => setPosts(storage.getPosts()), []);

  function createPost({ authorId, description, image, isPublic, isDraft }) {
    const newPost = {
      id: generateId('post'),
      authorId,
      description,
      image: image || null,
      isPublic,
      isDraft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [...storage.getPosts(), newPost];
    const success = storage.setPosts(next);
    if (!success) {
      throw new Error(
        'Could not save the post — the image may be too large for browser storage. Try a smaller image.'
      );
    }
    setPosts(next);
    return newPost;
  }

  function updatePost(postId, updates) {
    const next = storage.getPosts().map((p) =>
      p.id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    const success = storage.setPosts(next);
    if (!success) {
      throw new Error(
        'Could not save the post — the image may be too large for browser storage. Try a smaller image.'
      );
    }
    setPosts(next);
  }

  function deletePost(postId) {
    const next = storage.getPosts().filter((p) => p.id !== postId);
    storage.setPosts(next);
    setPosts(next);

    // Clean up dependent comments/likes so localStorage doesn't accumulate orphans
    storage.setComments(storage.getComments().filter((c) => c.postId !== postId));
    storage.setLikes(storage.getLikes().filter((l) => l.postId !== postId));
  }

  function toggleLike(postId, userId) {
    const likes = storage.getLikes();
    const existing = likes.find((l) => l.postId === postId && l.userId === userId);

    if (existing) {
      storage.setLikes(likes.filter((l) => l.id !== existing.id));
    } else {
      storage.setLikes([
        ...likes,
        { id: generateId('like'), postId, userId, createdAt: new Date().toISOString() },
      ]);
    }
  }

  function isLikedBy(postId, userId) {
    if (!userId) return false;
    return storage.getLikes().some((l) => l.postId === postId && l.userId === userId);
  }

  function getLikeCount(postId) {
    return storage.getLikes().filter((l) => l.postId === postId).length;
  }

  function getCommentCount(postId) {
    return storage.getComments().filter((c) => c.postId === postId).length;
  }

  function addComment(postId, authorId, text) {
    const comment = {
      id: generateId('cmt'),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    };
    storage.setComments([...storage.getComments(), comment]);
    return comment;
  }

  function deleteComment(commentId) {
    storage.setComments(storage.getComments().filter((c) => c.id !== commentId));
  }

  return {
    posts,
    refresh,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    isLikedBy,
    getLikeCount,
    getCommentCount,
    addComment,
    deleteComment,
  };
}