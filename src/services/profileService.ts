import profiles from '../data/profiles.json';

// Types
export interface ProfileContact {
  email: string;
  phone: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    dribbble?: string;
    instagram?: string;
    medium?: string;
  };
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Profile {
  id: number;
  name: string;
  photo: string;
  shortBio: string;
  fullBio: string;
  address: string;
  latitude: number;
  longitude: number;
  contact: ProfileContact;
  interests: string[];
  skills: string[];
  education: Education[];
  company: string;
}

let profileData: Profile[] = [...profiles];

// Get all profiles
export const getAllProfiles = (): Promise<Profile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profileData);
    }, 500);
  });
};

// Get a single profile by ID
export const getProfileById = (id: number): Promise<Profile | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = profileData.find((p) => p.id === id);
      resolve(profile);
    }, 300);
  });
};

// Add a new profile
export const addProfile = (profile: Omit<Profile, 'id'>): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...profileData.map((p) => p.id), 0) + 1;
      const newProfile = { ...profile, id: newId };
      profileData = [...profileData, newProfile];
      resolve(newProfile);
    }, 500);
  });
};

// Update a profile
export const updateProfile = (id: number, updatedProfile: Partial<Profile>): Promise<Profile | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = profileData.findIndex((p) => p.id === id);
      if (index !== -1) {
        profileData[index] = { ...profileData[index], ...updatedProfile };
        resolve(profileData[index]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Delete a profile
export const deleteProfile = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = profileData.length;
      profileData = profileData.filter((p) => p.id !== id);
      resolve(profileData.length !== initialLength);
    }, 500);
  });
};

// Search profiles
export const searchProfiles = (query: string, filterBy?: string): Promise<Profile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      let results = profileData;
      
      if (query) {
        if (filterBy === 'name') {
          results = results.filter((p) => p.name.toLowerCase().includes(lowercaseQuery));
        } else if (filterBy === 'location') {
          results = results.filter((p) => p.address.toLowerCase().includes(lowercaseQuery));
        } else if (filterBy === 'skills') {
          results = results.filter((p) => 
            p.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
          );
        } else if (filterBy === 'interests') {
          results = results.filter((p) => 
            p.interests.some(interest => interest.toLowerCase().includes(lowercaseQuery))
          );
        } else if (filterBy === 'company') {
          results = results.filter((p) => p.company.toLowerCase().includes(lowercaseQuery));
        } else {
          // Search across multiple fields if no specific filter
          results = results.filter((p) =>
            p.name.toLowerCase().includes(lowercaseQuery) ||
            p.shortBio.toLowerCase().includes(lowercaseQuery) ||
            p.address.toLowerCase().includes(lowercaseQuery) ||
            p.company.toLowerCase().includes(lowercaseQuery) ||
            p.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
            p.interests.some(interest => interest.toLowerCase().includes(lowercaseQuery))
          );
        }
      }
      
      resolve(results);
    }, 300);
  });
};