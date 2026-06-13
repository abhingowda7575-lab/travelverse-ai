import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/firebase';
import { Edit3, Camera, MapPin, Globe, Compass, Trash2, Calendar, DollarSign, ArrowRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Edit fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // States
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setName(user.displayName);
    setBio(user.bio);
    setAvatar(user.photoURL);

    const fetchTrips = async () => {
      try {
        const trips = await dbService.getSavedTrips();
        setSavedTrips(trips);
      } catch (err) {
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user, navigate]);

  // Profile Photo Upload (Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      // If not in editing mode, instantly update to DB
      if (!isEditing && user) {
        updateProfile(user.displayName, user.bio, base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(name, bio, avatar);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to delete this trip from your profile?')) return;
    try {
      const updated = await dbService.deleteTrip(tripId);
      setSavedTrips(updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. Header Profile Box */}
      <div className="rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Avatar Upload Column */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-xl relative">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.displayName}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Camera Overlay Icon */}
            <label className="absolute bottom-1 right-1 p-2 bg-gradient-to-r from-orange-500 to-sky-500 text-white rounded-full cursor-pointer hover:scale-105 transition-all shadow-md">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 max-w-md">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-orange-500 w-full"
                  required
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-orange-500 w-full h-16"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(user.displayName);
                      setBio(user.bio);
                      setAvatar(user.photoURL);
                      setIsEditing(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-black">{user.displayName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:text-orange-500 text-slate-400"
                    aria-label="Edit Profile"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {user.bio}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1"><MapPin className="h-3.5 w-3.5 text-orange-500" /> <span>USA</span></span>
                  <span className="flex items-center space-x-1"><Globe className="h-3.5 w-3.5 text-sky-500" /> <span>Member since 2026</span></span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/5 pt-6 md:pt-0 md:pl-8 text-center shrink-0 w-full md:w-auto">
          <div>
            <div className="text-xl md:text-2xl font-black text-orange-500">{user.tripsCount}</div>
            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-500">Trips</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-sky-500">{user.postsCount}</div>
            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-500">Posts</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-orange-500">{user.savedCount}</div>
            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-500">Saved</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-sky-500">{user.countriesCount}</div>
            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-500">Countries</div>
          </div>
        </div>
      </div>

      {/* 2. Saved Trips / Itineraries Feed */}
      <section className="mt-12">
        <h2 className="text-2xl font-black mb-6">Saved AI Travel Plans</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center max-w-xl mx-auto space-y-4">
            <Compass className="h-12 w-12 text-orange-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">No saved trips found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create and generate custom itineraries with our AI Planner and save them directly into your dashboard.
            </p>
            <button
              onClick={() => navigate('/planner')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 text-white font-bold text-xs uppercase shadow-md hover:scale-102 transition-all"
            >
              Go to AI Planner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-orange-500/10 to-transparent group-hover:scale-110 transition-transform" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{trip.destination}</h3>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center space-x-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>Saved: {trip.savedAt}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold">Duration</div>
                      <div className="text-sm font-black text-slate-800 dark:text-slate-200">{trip.days} Days</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold">Budget</div>
                      <div className="text-sm font-black text-orange-500 dark:text-orange-400 flex items-center"><DollarSign className="h-3.5 w-3.5 -ml-0.5" />{trip.totalEstimatedCost}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="font-semibold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-500">Trip Expenses</div>
                    <div className="flex justify-between"><span>Flights & Transit:</span> <b>${trip.transportCost}</b></div>
                    <div className="flex justify-between"><span>Hotels:</span> <b>${trip.accommodationCost}</b></div>
                    <div className="flex justify-between"><span>Food:</span> <b>${trip.foodCost}</b></div>
                    <div className="flex justify-between"><span>Activities:</span> <b>${trip.activitiesCost}</b></div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/planner?viewSaved=${trip.id}`)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 border border-slate-200/50 dark:border-white/5 text-xs font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Open Daily Schedule</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
