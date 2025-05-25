import React, { useState, useEffect } from 'react';
import { Profile } from '../services/profileService';
import { X, Plus, Trash } from 'lucide-react';

interface AdminFormProps {
  profile?: Profile;
  onSubmit: (profileData: Omit<Profile, 'id'> | Partial<Profile>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const emptyProfile: Omit<Profile, 'id'> = {
  name: '',
  photo: '',
  shortBio: '',
  fullBio: '',
  address: '',
  latitude: 0,
  longitude: 0,
  contact: {
    email: '',
    phone: '',
    social: {
      twitter: '',
      linkedin: '',
      github: '',
    },
  },
  interests: [],
  skills: [],
  education: [{ degree: '', institution: '', year: '' }],
  company: '',
};

const AdminForm: React.FC<AdminFormProps> = ({
  profile,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Omit<Profile, 'id'> | Partial<Profile>>(
    profile || emptyProfile
  );
  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        [name]: value,
      },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        social: {
          ...prev.contact!.social,
          [name]: value,
        },
      },
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education!];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education!,
        { degree: '', institution: '', year: '' },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education!];
      updatedEducation.splice(index, 1);
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const addInterest = () => {
    if (interestInput.trim() === '') return;
    setFormData((prev) => ({
      ...prev,
      interests: [...prev.interests!, interestInput.trim()],
    }));
    setInterestInput('');
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests!.filter((i) => i !== interest),
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() === '') return;
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills!, skillInput.trim()],
    }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills!.filter((s) => s !== skill),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.photo) errors.photo = 'Photo URL is required';
    if (!formData.shortBio) errors.shortBio = 'Short bio is required';
    if (!formData.fullBio) errors.fullBio = 'Full bio is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.latitude) errors.latitude = 'Latitude is required';
    if (!formData.longitude) errors.longitude = 'Longitude is required';
    if (!formData.company) errors.company = 'Company is required';
    if (!formData.contact?.email) errors['contact.email'] = 'Email is required';
    if (!formData.contact?.phone) errors['contact.phone'] = 'Phone is required';
    
    if (formData.skills?.length === 0) errors.skills = 'At least one skill is required';
    if (formData.interests?.length === 0) errors.interests = 'At least one interest is required';
    
    if (formData.education?.length === 0 || !formData.education?.[0].degree || !formData.education?.[0].institution) {
      errors.education = 'At least one education entry is required';
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input w-full ${formErrors.name ? 'border-error-500' : ''}`}
              />
              {formErrors.name && <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL*
              </label>
              <input
                type="text"
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                className={`input w-full ${formErrors.photo ? 'border-error-500' : ''}`}
              />
              {formErrors.photo && <p className="mt-1 text-sm text-error-500">{formErrors.photo}</p>}
              {formData.photo && (
                <div className="mt-2">
                  <img
                    src={formData.photo}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company*
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`input w-full ${formErrors.company ? 'border-error-500' : ''}`}
              />
              {formErrors.company && <p className="mt-1 text-sm text-error-500">{formErrors.company}</p>}
            </div>
            
            <div>
              <label htmlFor="shortBio" className="block text-sm font-medium text-gray-700 mb-1">
                Short Bio* (displayed on cards)
              </label>
              <textarea
                id="shortBio"
                name="shortBio"
                rows={2}
                value={formData.shortBio}
                onChange={handleChange}
                className={`input w-full ${formErrors.shortBio ? 'border-error-500' : ''}`}
              />
              {formErrors.shortBio && <p className="mt-1 text-sm text-error-500">{formErrors.shortBio}</p>}
            </div>
            
            <div>
              <label htmlFor="fullBio" className="block text-sm font-medium text-gray-700 mb-1">
                Full Bio*
              </label>
              <textarea
                id="fullBio"
                name="fullBio"
                rows={4}
                value={formData.fullBio}
                onChange={handleChange}
                className={`input w-full ${formErrors.fullBio ? 'border-error-500' : ''}`}
              />
              {formErrors.fullBio && <p className="mt-1 text-sm text-error-500">{formErrors.fullBio}</p>}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Location & Contact</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`input w-full ${formErrors.address ? 'border-error-500' : ''}`}
              />
              {formErrors.address && <p className="mt-1 text-sm text-error-500">{formErrors.address}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude*
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className={`input w-full ${formErrors.latitude ? 'border-error-500' : ''}`}
                />
                {formErrors.latitude && <p className="mt-1 text-sm text-error-500">{formErrors.latitude}</p>}
              </div>
              
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude*
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className={`input w-full ${formErrors.longitude ? 'border-error-500' : ''}`}
                />
                {formErrors.longitude && <p className="mt-1 text-sm text-error-500">{formErrors.longitude}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.contact?.email}
                onChange={handleContactChange}
                className={`input w-full ${formErrors['contact.email'] ? 'border-error-500' : ''}`}
              />
              {formErrors['contact.email'] && <p className="mt-1 text-sm text-error-500">{formErrors['contact.email']}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.contact?.phone}
                onChange={handleContactChange}
                className={`input w-full ${formErrors['contact.phone'] ? 'border-error-500' : ''}`}
              />
              {formErrors['contact.phone'] && <p className="mt-1 text-sm text-error-500">{formErrors['contact.phone']}</p>}
            </div>
            
            <h4 className="font-medium text-gray-700 mt-6">Social Media</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  placeholder="@username"
                  value={formData.contact?.social?.twitter || ''}
                  onChange={handleSocialChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  placeholder="username"
                  value={formData.contact?.social?.linkedin || ''}
                  onChange={handleSocialChange}
                  className="input w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  id="github"
                  name="github"
                  placeholder="username"
                  value={formData.contact?.social?.github || ''}
                  onChange={handleSocialChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  placeholder="username"
                  value={formData.contact?.social?.instagram || ''}
                  onChange={handleSocialChange}
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Skills & Interests</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills*
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="input rounded-r-none flex-grow"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn btn-primary rounded-l-none"
                >
                  <Plus size={16} />
                </button>
              </div>
              {formErrors.skills && <p className="mt-1 text-sm text-error-500">{formErrors.skills}</p>}
              
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills?.map((skill, index) => (
                  <div key={index} className="badge badge-primary flex items-center gap-1">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-primary-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                Interests*
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="interests"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="input rounded-r-none flex-grow"
                  placeholder="Add an interest"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="btn btn-primary rounded-l-none"
                >
                  <Plus size={16} />
                </button>
              </div>
              {formErrors.interests && <p className="mt-1 text-sm text-error-500">{formErrors.interests}</p>}
              
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.interests?.map((interest, index) => (
                  <div key={index} className="badge badge-secondary flex items-center gap-1">
                    {interest}
                    <button 
                      type="button" 
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-secondary-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education*</h3>
            <button 
              type="button" 
              onClick={addEducation}
              className="btn btn-outline text-sm"
            >
              <Plus size={16} className="mr-1" /> Add Education
            </button>
          </div>
          
          {formErrors.education && <p className="text-sm text-error-500 mb-2">{formErrors.education}</p>}
          
          {formData.education?.map((edu, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4 relative">
              <button
                type="button"
                onClick={() => removeEducation(index)}
                disabled={formData.education!.length === 1}
                className={`absolute top-2 right-2 text-gray-500 hover:text-error-500 ${
                  formData.education!.length === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button 
          type="button" 
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;