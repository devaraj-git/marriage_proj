/*
  # Initial Schema Setup for Service Booking Platform

  1. New Tables
    - `profiles`
      - Stores user profile information for both vendors and customers
      - Links to Supabase auth.users
    - `services`
      - Stores service categories (e.g., Function Hall, DJ, Photographer)
    - `vendor_profiles`
      - Stores detailed vendor information
      - Links to profiles table
    - `vendor_services`
      - Junction table linking vendors to their offered services
    - `bookings`
      - Stores customer bookings
      
  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'customer',
  full_name text,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_profiles table
CREATE TABLE vendor_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  business_name text NOT NULL,
  description text,
  location text NOT NULL,
  latitude numeric(10,8),
  longitude numeric(11,8),
  photos text[] DEFAULT ARRAY[]::text[],
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendor_services junction table
CREATE TABLE vendor_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  price decimal(10,2),
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(vendor_id, service_id)
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id),
  vendor_service_id uuid REFERENCES vendor_services(id),
  booking_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for services
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for vendor_profiles
CREATE POLICY "Vendor profiles are viewable by everyone"
  ON vendor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Vendors can update own profile"
  ON vendor_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for vendor_services
CREATE POLICY "Vendor services are viewable by everyone"
  ON vendor_services FOR SELECT
  USING (true);

CREATE POLICY "Vendors can manage their own services"
  ON vendor_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM vendor_profiles
      WHERE id = auth.uid()
      AND vendor_services.vendor_id = id
    )
  );

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = customer_id OR
    EXISTS (
      SELECT 1 FROM vendor_services vs
      WHERE vs.id = vendor_service_id
      AND vs.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Insert default services
INSERT INTO services (name, description) VALUES
  ('Function Hall', 'Venues for events and functions'),
  ('DJ Services', 'Professional DJs for events'),
  ('Photography', 'Professional photography services'),
  ('Catering', 'Food and beverage services'),
  ('Decoration', 'Event decoration services');