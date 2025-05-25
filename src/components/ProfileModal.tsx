import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import MapViewer from './MapViewer';
import { Profile } from '../services/profileService';

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  if (!profile) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slide-up"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Location Summary: {profile.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
              />
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-gray-600">{profile.company}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Address</h4>
              <p className="text-gray-700">{profile.address}</p>
            </div>
          </div>
          
          <div className="h-72">
            <MapViewer profiles={[profile]} selectedProfileId={profile.id} height="100%" />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Email: </span>
                <a href={`mailto:${profile.contact.email}`} className="text-primary-600 hover:underline">
                  {profile.contact.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500">Phone: </span>
                <a href={`tel:${profile.contact.phone}`} className="text-primary-600 hover:underline">
                  {profile.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;