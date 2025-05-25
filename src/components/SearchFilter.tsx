import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useProfiles } from '../contexts/ProfileContext';

const SearchFilter: React.FC = () => {
  const { setSearchQuery, setFilterBy, searchQuery, filterBy, performSearch } = useProfiles();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    performSearch();
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setFilterBy('');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-slide-up">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            
            <input
              type="text"
              placeholder="Search profiles..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="input pl-10 w-full"
            />
            
            {localQuery && (
              <button 
                type="button" 
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-outline flex items-center gap-2"
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="filterBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by
                </label>
                <select
                  id="filterBy"
                  value={filterBy}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">All Fields</option>
                  <option value="name">Name</option>
                  <option value="location">Location</option>
                  <option value="skills">Skills</option>
                  <option value="interests">Interests</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;