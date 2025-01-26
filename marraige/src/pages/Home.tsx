import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Music2, Home as HomeIcon, Utensils, Palette } from 'lucide-react';

const services = [
  {
    name: 'Function Halls',
    icon: HomeIcon,
    description: 'Find the perfect venue for your special occasion',
  },
  {
    name: 'DJ Services',
    icon: Music2,
    description: 'Professional DJs to make your event memorable',
  },
  {
    name: 'Photography',
    icon: Camera,
    description: 'Capture your precious moments',
  },
  {
    name: 'Catering',
    icon: Utensils,
    description: 'Delicious food for all occasions',
  },
  {
    name: 'Decoration',
    icon: Palette,
    description: 'Beautiful decorations for your events',
  },
];

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your One-Stop Solution for Event Services
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Find and book the best vendors for your special occasions. From venues
            to photographers, we've got you covered.
          </p>
          <div className="mt-10">
            <Link
              to="/services"
              className="inline-block bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 rounded-md"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need for your perfect event
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <Link to={`/services?category=${service.name}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {service.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;