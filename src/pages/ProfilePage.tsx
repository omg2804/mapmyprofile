import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin } from 'lucide-react';
import ProfileDetail from '../components/ProfileDetail';
import MapViewer from '../components/MapViewer';
import Loader from '../components/Loader';
import { getProfileById } from '../services/profileService';
import { Profile } from '../services/profileService';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getProfileById(parseInt(id));
          if (data) {
            setProfile(data);
            setError(null);
          } else {
            setError('Profile not found');
          }
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size="large" text="Loading profile..." />
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-error-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4">{error || 'Profile not found'}</h2>
        <p className="text-gray-600 mb-6">The profile you are looking for does not exist or could not be loaded.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to profiles
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to={`/admin/edit/${profile.id}`} className="btn btn-outline">
            <Edit size={16} className="mr-2" /> Edit Profile
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <ProfileDetail profile={profile} />
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <MapPin size={20} className="text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold">Location</h2>
        </div>
        <MapViewer profiles={[profile]} selectedProfileId={profile.id} height="400px" />
      </div>
    </div>
  );
};

export default ProfilePage;