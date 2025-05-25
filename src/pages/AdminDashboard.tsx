import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash, User, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminForm from '../components/AdminForm';
import Loader from '../components/Loader';
import { useProfiles } from '../contexts/ProfileContext';
import { useToast } from '../components/ToastContainer';
import { Profile, getProfileById } from '../services/profileService';

const AdminDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, loading, addNewProfile, updateExistingProfile, removeProfile } = useProfiles();
  const { success, error } = useToast();
  
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  
  useEffect(() => {
    if (id) {
      const loadProfile = async () => {
        try {
          setProfileLoading(true);
          const profile = await getProfileById(parseInt(id));
          if (profile) {
            setSelectedProfile(profile);
            setMode('edit');
          } else {
            error('Profile not found');
            navigate('/admin');
          }
        } catch (err) {
          error('Failed to load profile');
          navigate('/admin');
        } finally {
          setProfileLoading(false);
        }
      };
      
      loadProfile();
    }
  }, [id, navigate]);
  
  const handleAddClick = () => {
    setMode('add');
    setSelectedProfile(null);
  };
  
  const handleEditClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setMode('edit');
  };
  
  const handleDeleteClick = (profileId: number) => {
    setConfirmDelete(profileId);
  };
  
  const handleConfirmDelete = async (profileId: number) => {
    try {
      await removeProfile(profileId);
      success('Profile deleted successfully');
      setConfirmDelete(null);
    } catch (err) {
      error('Failed to delete profile');
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  const handleFormCancel = () => {
    setMode('list');
    setSelectedProfile(null);
    navigate('/admin');
  };
  
  const handleFormSubmit = async (profileData: Omit<Profile, 'id'> | Partial<Profile>) => {
    try {
      if (mode === 'add') {
        await addNewProfile(profileData as Omit<Profile, 'id'>);
        success('Profile added successfully');
      } else if (mode === 'edit' && selectedProfile) {
        await updateExistingProfile(selectedProfile.id, profileData);
        success('Profile updated successfully');
      }
      setMode('list');
      setSelectedProfile(null);
      navigate('/admin');
    } catch (err) {
      error('Failed to save profile');
    }
  };
  
  const renderContent = () => {
    if (loading || profileLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader size="large" text={profileLoading ? 'Loading profile...' : 'Loading profiles...'} />
        </div>
      );
    }
    
    if (mode === 'add') {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex items-center">
            <button 
              onClick={handleFormCancel}
              className="mr-4 text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">Add New Profile</h2>
          </div>
          <AdminForm 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      );
    }
    
    if (mode === 'edit' && selectedProfile) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex items-center">
            <button 
              onClick={handleFormCancel}
              className="mr-4 text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">Edit Profile: {selectedProfile.name}</h2>
          </div>
          <AdminForm 
            profile={selectedProfile}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing
          />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Profiles</h2>
          <button 
            onClick={handleAddClick}
            className="btn btn-primary"
          >
            <Plus size={16} className="mr-2" /> Add Profile
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <User size={32} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No profiles found</p>
                    <p className="text-sm">Get started by adding a new profile</p>
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={profile.photo} 
                            alt={profile.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                          <div className="text-sm text-gray-500">{profile.contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{profile.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {confirmDelete === profile.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-gray-700 mr-2">Confirm delete?</span>
                          <button
                            onClick={() => handleConfirmDelete(profile.id)}
                            className="text-error-500 hover:text-error-700"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <AlertTriangle size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(profile)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(profile.id)}
                            className="text-error-500 hover:text-error-700"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage profiles and their information.</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;