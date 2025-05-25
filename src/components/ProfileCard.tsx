import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Profile } from '../services/profileService';

interface ProfileCardProps {
  profile: Profile;
  onSummaryClick: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSummaryClick }) => {
  return (
    <div className="card animate-fade-in group">
      <div className="relative overflow-hidden">
        <img 
          src={profile.photo} 
          alt={profile.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 p-2">
          <div className="badge badge-primary">
            ID: {profile.id}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl truncate">{profile.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2 text-sm">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{profile.address}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <Briefcase size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{profile.company}</span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{profile.shortBio}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge badge-secondary">
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="badge badge-secondary">+{profile.skills.length - 3}</span>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => onSummaryClick(profile)} 
            className="btn btn-outline text-sm"
          >
            Summary
          </button>
          
          <Link 
            to={`/profile/${profile.id}`} 
            className="btn btn-primary text-sm"
          >
            View Profile <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;