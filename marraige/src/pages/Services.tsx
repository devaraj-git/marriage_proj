import React, { useEffect, useState } from 'react';
import { Camera, Music2, Home as HomeIcon, Utensils, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Vendor {
  id: string;
  business_name: string;
  description: string;
  location: string;
  service: {
    name: string;
    description: string;
  };
}

const serviceIcons = {
  'Function Hall': HomeIcon,
  'DJ Services': Music2,
  'Photography': Camera,
  'Catering': Utensils,
  'Decoration': Palette,
};

const Services = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, [selectedService]);

  const fetchVendors = async () => {
    try {
      const query = supabase
        .from('vendor_services')
        .select(`
          id,
          vendor_profiles (
            id,
            business_name,
            description,
            location
          ),
          services (
            name,
            description
          )
        `);

      if (selectedService) {
        query.eq('services.name', selectedService);
      }

      const { data, error } = await query;

      if (error) throw error;

      setVendors(data?.map(item => ({
        id: item.vendor_profiles.id,
        business_name: item.vendor_profiles.business_name,
        description: item.vendor_profiles.description,
        location: item.vendor_profiles.location,
        service: item.services
      })) || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Our Services
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Find the perfect service provider for your special occasion
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(serviceIcons).map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => setSelectedService(name)}
              className={`flex items-center px-4 py-2 rounded-full ${
                selectedService === name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border shadow-sm transition-colors`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading vendors...
          </div>
        ) : vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {vendor.business_name}
                </h3>
                <p className="text-gray-600 mb-4">{vendor.description}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  {vendor.location}
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => {/* TODO: Implement booking flow */}}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No vendors found for the selected service.
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;