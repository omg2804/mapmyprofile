import React, { useState } from 'react';
import { useProfiles } from '../contexts/ProfileContext';
import MapViewer from '../components/MapViewer';
import SearchFilter from '../components/SearchFilter';
import Loader from '../components/Loader';
import { Profile } from '../services/profileService';
import { MapPin, User, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapView: React.FC = () => {
  const { searchResults, loading, error } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<number | undefined>(undefined);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const selectedProfile = selectedProfileId
    ? searchResults.find((p) => p.id === selectedProfileId)
    : undefined;
  
  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    
    // On mobile, hide the sidebar when a profile is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Map Explorer</h1>
        <p className="text-gray-600">View all profiles on an interactive map.</p>
      </div>
      
      <SearchFilter />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="large" text="Loading map data..." />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-error-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Map</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden" style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}>
          {/* Sidebar toggle button for mobile */}
          <button 
            className="absolute top-2 left-2 z-10 md:hidden bg-white p-2 rounded-full shadow-md"
            onClick={toggleSidebar}
          >
            {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {/* Sidebar with profile list */}
          <div 
            className={`${
              showSidebar ? 'w-full md:w-1/3 lg:w-1/4' : 'w-0 md:w-0'
            } transition-all duration-300 bg-gray-50 overflow-hidden`}
          >
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">
                {searchResults.length} {searchResults.length === 1 ? 'Profile' : 'Profiles'} Found
              </h2>
            </div>
            
            <div className="overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No profiles found
                </div>
              ) : (
                searchResults.map((profile) => (
                  <div 
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedProfileId === profile.id 
                        ? 'bg-primary-50 border-l-4 border-l-primary-500' 
                        : 'hover:bg-gray-100 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={profile.photo} 
                        alt={profile.name} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{profile.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{profile.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Main map area */}
          <div className={`${showSidebar ? 'md:w-2/3 lg:w-3/4' : 'w-full'} relative`}>
            <MapViewer 
              profiles={searchResults} 
              selectedProfileId={selectedProfileId} 
              height="100%" 
            />
            
            {/* Selected profile overlay */}
            {selectedProfile && (
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 border-t shadow-md">
                <div className="flex items-start">
                  <img 
                    src={selectedProfile.photo}
                    alt={selectedProfile.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-900">{selectedProfile.name}</h3>
                    <div className="text-sm text-gray-600 flex items-center mb-1">
                      <Briefcase size={14} className="mr-1" />
                      {selectedProfile.company}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {selectedProfile.address}
                    </div>
                  </div>
                  <Link 
                    to={`/profile/${selectedProfile.id}`}
                    className="btn btn-primary text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;