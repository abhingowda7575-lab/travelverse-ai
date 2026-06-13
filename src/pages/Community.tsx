import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/firebase';
import { Heart, MessageCircle, Send, PlusCircle, MapPin, Check, Bookmark, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Community: React.FC = () => {
  const { user } = useAuth();
  
  // Feed state
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post Form
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false);

  // Comment Modal state
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [commentText, setCommentText] = useState('');

  // Follow states
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [copyToast, setCopyToast] = useState('');

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const feed = await dbService.getStories();
        setStories(feed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const handleLike = async (storyId: string) => {
    try {
      const updated = await dbService.likeStory(storyId);
      setStories(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (storyId: string) => {
    try {
      const updated = await dbService.saveStory(storyId);
      setStories(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Log in to share a story.');
    setUploading(true);

    try {
      // Use sample images if url is empty
      const finalMedia = mediaUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
      await dbService.addStory(caption, finalMedia, mediaType, location);
      
      // Reload feed
      const refreshed = await dbService.getStories();
      setStories(refreshed);
      
      // Reset
      setCaption('');
      setMediaUrl('');
      setMediaType('photo');
      setLocation('');
      setShowUpload(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Log in to leave comments.');
    if (!commentText.trim()) return;

    try {
      const updated = await dbService.addComment(selectedStory.id, commentText);
      setStories(updated);
      
      // Update local modal view
      const freshStory = updated.find(s => s.id === selectedStory.id);
      setSelectedStory(freshStory);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = (username: string) => {
    setFollowedUsers(prev =>
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const handleShare = (storyId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/community?story=${storyId}`);
    setCopyToast('Link copied to clipboard!');
    setTimeout(() => setCopyToast(''), 2500);
  };

  // Custom File Uploader simulation (base64 reader for feed posts!)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'photo');

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const storyCircles = [
    { name: 'sophie', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', active: true },
    { name: 'alex', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', active: true },
    { name: 'amy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', active: false },
    { name: 'traveler_dan', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', active: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {copyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center space-x-2 border border-white/10"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{copyToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Instagram Stories Circles */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-sky-500 border-b border-slate-200 dark:border-white/5 no-scrollbar">
        {user && (
          <div
            onClick={() => setShowUpload(true)}
            className="flex flex-col items-center space-y-1 cursor-pointer shrink-0"
          >
            <div className="relative">
              <img
                src={user.photoURL}
                alt="Your Story"
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-300 dark:border-white/10"
              />
              <PlusCircle className="absolute bottom-0 right-0 h-5 w-5 text-orange-500 bg-white rounded-full fill-white" />
            </div>
            <span className="text-[10px] font-bold">New Post</span>
          </div>
        )}

        {storyCircles.map((circle, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1 cursor-pointer shrink-0">
            <div className={`p-[2.5px] rounded-full ${circle.active ? 'bg-gradient-to-tr from-orange-500 to-sky-400' : 'bg-slate-300 dark:bg-white/10'}`}>
              <img
                src={circle.avatar}
                alt={circle.name}
                className="h-15 w-15 rounded-full object-cover border-2 border-white dark:border-slate-950"
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{circle.name}</span>
          </div>
        ))}
      </div>

      {/* Feed Area */}
      <div className="space-y-8 max-w-xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">No stories uploaded. Be the first to share one!</div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 backdrop-blur-sm shadow-md overflow-hidden"
            >
              {/* Header: User, Location, Follow Button */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="h-9 w-9 rounded-full object-cover border border-orange-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{story.username}</span>
                      {user && user.displayName !== story.username && (
                        <button
                          onClick={() => toggleFollow(story.username)}
                          className="text-[10px] font-bold text-sky-500 dark:text-sky-400 focus:outline-none"
                        >
                          • {followedUsers.includes(story.username) ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span>{story.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Container */}
              <div className="w-full bg-slate-900 flex items-center justify-center min-h-[350px]">
                {story.mediaType === 'video' ? (
                  <video
                    src={story.mediaUrl}
                    controls
                    className="max-h-[500px] w-full object-contain"
                  />
                ) : (
                  <img
                    src={story.mediaUrl}
                    alt=""
                    className="max-h-[500px] w-full object-contain"
                  />
                )}
              </div>

              {/* Feed Actions */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <button
                      onClick={() => handleLike(story.id)}
                      className="flex items-center space-x-1.5 focus:outline-none group"
                    >
                      <Heart
                        className={`h-6 w-6 transition-transform group-active:scale-125 ${
                          story.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      />
                      <span className="text-xs font-bold">{story.likesCount}</span>
                    </button>
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex items-center space-x-1.5 focus:outline-none"
                    >
                      <MessageCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-bold">{story.commentsCount}</span>
                    </button>
                    <button
                      onClick={() => handleShare(story.id)}
                      className="focus:outline-none hover:text-sky-500 transition-colors"
                      title="Share story"
                    >
                      <Share2 className="h-5.5 w-5.5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSave(story.id)}
                    className="focus:outline-none"
                    title="Bookmark"
                  >
                    <Bookmark
                      className={`h-6 w-6 ${
                        story.isSaved ? 'text-orange-500 fill-orange-500' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Caption / Comments */}
                <div className="space-y-1.5">
                  <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                    <span className="font-bold mr-1.5 text-slate-950 dark:text-white">{story.username}</span>
                    {story.content}
                  </p>
                  {story.comments.length > 0 && (
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="text-[10px] text-slate-500 dark:text-slate-400 font-bold hover:underline"
                    >
                      View all {story.comments.length} comments
                    </button>
                  )}
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">{story.date}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowUpload(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100"
            >
              <h3 className="text-xl font-bold">Share Travel Story</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Choose Media</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20"
                  />
                  {mediaUrl && (
                    <div className="h-40 w-full mt-2 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} className="h-full object-contain" controls />
                      ) : (
                        <img src={mediaUrl} alt="" className="h-full object-contain" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Caption</label>
                  <textarea
                    placeholder="Write details of your escape..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-900 dark:text-white h-20 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Paris, France"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex space-x-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
                  >
                    {uploading ? 'Posting...' : 'Share Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Comments Sidebar / Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setSelectedStory(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md h-[450px] rounded-2xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900 p-5 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100"
            >
              <div>
                <h3 className="text-base font-bold border-b border-slate-200 dark:border-white/5 pb-2 mb-3">
                  Comments
                </h3>

                <div className="space-y-3 overflow-y-auto h-[290px] pr-2 no-scrollbar">
                  {selectedStory.comments.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 py-12">No comments yet. Be the first to reply!</div>
                  ) : (
                    selectedStory.comments.map((comment: any) => (
                      <div key={comment.id} className="flex items-start gap-2 text-xs">
                        <img
                          src={comment.userAvatar}
                          alt={comment.username}
                          className="h-7 w-7 rounded-full object-cover shrink-0 border"
                        />
                        <div>
                          <div className="leading-relaxed">
                            <span className="font-bold mr-1">{comment.username}</span>
                            <span className="text-slate-700 dark:text-slate-300">{comment.text}</span>
                          </div>
                          <div className="text-[8px] text-slate-400 uppercase mt-0.5">{comment.date}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 border-t border-slate-200 dark:border-white/5 pt-3 mt-2">
                <input
                  type="text"
                  placeholder="Type comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-white/5 focus:outline-none focus:border-orange-500 text-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-orange-500 text-white hover:opacity-90"
                  aria-label="Submit comment"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
