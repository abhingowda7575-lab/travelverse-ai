export const getFollowers = async (): Promise<{uid: string; displayName: string; photoURL: string}[]> => {
  // Mock follower data; replace with real backend calls when Firebase is configured
  return [
    {
      uid: 'user_f1',
      displayName: 'Alice Wander',
      photoURL: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80'
    },
    {
      uid: 'user_f2',
      displayName: 'Bob Traveler',
      photoURL: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=150&q=80'
    },
    {
      uid: 'user_f3',
      displayName: 'Catherine Explorer',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];
};
