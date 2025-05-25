import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, getAllProfiles, addProfile, updateProfile, deleteProfile, searchProfiles } from '../services/profileService';

interface ProfileContextType {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterBy: string;
  searchResults: Profile[];
  addNewProfile: (profile: Omit<Profile, 'id'>) => Promise<Profile>;
  updateExistingProfile: (id: number, profile: Partial<Profile>) => Promise<Profile | undefined>;
  removeProfile: (id: number) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setFilterBy: (filter: string) => void;
  performSearch: () => void;
  refreshProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles();
      setProfiles(data);
      setSearchResults(data);
      setError(null);
    } catch (err) {
      setError('Failed to load profiles. Please try again later.');
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const refreshProfiles = async () => {
    await loadProfiles();
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const results = await searchProfiles(searchQuery, filterBy || undefined);
      setSearchResults(results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, filterBy]);

  const addNewProfile = async (profile: Omit<Profile, 'id'>) => {
    try {
      setLoading(true);
      const newProfile = await addProfile(profile);
      await refreshProfiles();
      return newProfile;
    } catch (err) {
      setError('Failed to add profile. Please try again.');
      console.error('Error adding profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingProfile = async (id: number, profile: Partial<Profile>) => {
    try {
      setLoading(true);
      const updatedProfile = await updateProfile(id, profile);
      if (updatedProfile) {
        await refreshProfiles();
      }
      return updatedProfile;
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProfile = async (id: number) => {
    try {
      setLoading(true);
      const success = await deleteProfile(id);
      if (success) {
        await refreshProfiles();
      }
      return success;
    } catch (err) {
      setError('Failed to delete profile. Please try again.');
      console.error('Error deleting profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profiles,
    loading,
    error,
    searchQuery,
    filterBy,
    searchResults,
    addNewProfile,
    updateExistingProfile,
    removeProfile,
    setSearchQuery,
    setFilterBy,
    performSearch,
    refreshProfiles,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};