import React from 'react';
import { Mail, Phone, MapPin, Briefcase, ExternalLink, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { Profile } from '../services/profileService';

interface ProfileDetailProps {
  profile: Profile;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="relative h-60 md:h-full">
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
              <h1 className="text-white text-2xl font-bold">{profile.name}</h1>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="hidden md:block mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2 text-gray-700">
              <Briefcase size={18} className="mr-2 text-primary-600" />
              <span>{profile.company}</span>
            </div>
            <div className="flex items-start mb-2 text-gray-700">
              <MapPin size={18} className="mr-2 mt-0.5 text-primary-600 flex-shrink-0" />
              <span>{profile.address}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">About</h2>
            <p className="text-gray-700">{profile.fullBio}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center text-gray-700">
                <Mail size={18} className="mr-2 text-primary-600" />
                <a href={`mailto:${profile.contact.email}`} className="hover:text-primary-600">
                  {profile.contact.email}
                </a>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone size={18} className="mr-2 text-primary-600" />
                <a href={`tel:${profile.contact.phone}`} className="hover:text-primary-600">
                  {profile.contact.phone}
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Education</h2>
            <div className="space-y-2">
              {profile.education.map((edu, index) => (
                <div key={index} className="text-gray-700">
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm">{edu.institution}, {edu.year}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="badge badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span key={index} className="badge badge-secondary">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Social</h2>
            <div className="flex gap-3">
              {profile.contact.social.twitter && (
                <a 
                  href={`https://twitter.com/${profile.contact.social.twitter.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <Twitter size={20} />
                </a>
              )}
              {profile.contact.social.linkedin && (
                <a 
                  href={`https://linkedin.com/in/${profile.contact.social.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile.contact.social.github && (
                <a 
                  href={`https://github.com/${profile.contact.social.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <Github size={20} />
                </a>
              )}
              {profile.contact.social.instagram && (
                <a 
                  href={`https://instagram.com/${profile.contact.social.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <Instagram size={20} />
                </a>
              )}
              {profile.contact.social.dribbble && (
                <a 
                  href={`https://dribbble.com/${profile.contact.social.dribbble}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <ExternalLink size={20} />
                </a>
              )}
              {profile.contact.social.medium && (
                <a 
                  href={`https://medium.com/${profile.contact.social.medium}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary-600"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;