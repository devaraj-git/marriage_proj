import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  special_requests: string;
  vendor_service: {
    service: {
      name: string;
    };
    vendor_profile: {
      business_name: string;
    };
  };
  customer: {
    full_name: string;
    email: string;
  };
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchBookings(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const query = supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          status,
          special_requests,
          vendor_service:vendor_services (
            service:services (name),
            vendor_profile:vendor_profiles (business_name)
          ),
          customer:profiles (full_name, email)
        `);

      if (profile?.role === 'vendor') {
        query.eq('vendor_service.vendor_profiles.id', userId);
      } else {
        query.eq('customer_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Please log in to view your dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Bookings
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {booking.vendor_service.service.name} with {booking.vendor_service.vendor_profile.business_name}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        Status: {booking.status}
                      </div>
                      {booking.special_requests && (
                        <div className="flex items-start text-gray-500">
                          <MessageSquare className="w-4 h-4 mr-2 mt-1" />
                          <p>{booking.special_requests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;