import React, { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import SearchFilter from '../components/SearchFilter';
import ProfileModal from '../components/ProfileModal';
import Loader from '../components/Loader';
import { useProfiles } from '../contexts/ProfileContext';
import { Profile } from '../services/profileService';
import { Users } from 'lucide-react';

const Home: React.FC = () => {
  const { searchResults, loading, error } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  const handleSummaryClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };
  
  const closeModal = () => {
    setSelectedProfile(null);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Directory</h1>
        <p className="text-gray-600">Browse and search through our community of professionals.</p>
      </div>
      
      <SearchFilter />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="large" text="Loading profiles..." />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-error-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Profiles</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Profiles Found</h2>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSummaryClick={handleSummaryClick}
            />
          ))}
        </div>
      )}
      
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Home;