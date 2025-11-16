/*
  # Create bookings table for hotel reservations

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key) - Unique booking identifier
      - `guest_name` (text) - Full name of the guest
      - `guest_email` (text) - Email address for booking confirmation
      - `guest_phone` (text) - Contact phone number
      - `room_type` (text) - Type of room booked (e.g., "Люкс", "Стандарт")
      - `check_in` (date) - Check-in date
      - `check_out` (date) - Check-out date
      - `guests_count` (integer) - Number of guests
      - `total_price` (numeric) - Total price for the booking
      - `payment_status` (text) - Payment status: 'pending', 'paid', 'failed'
      - `payment_intent_id` (text, nullable) - YooKassa payment intent ID
      - `special_requests` (text, nullable) - Any special requests from guest
      - `created_at` (timestamptz) - Booking creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for anyone to create bookings (anon users)
    - Add policy for anyone to view bookings (for now)
    - Add policy for anyone to update payment status

  3. Important Notes
    - Payment status defaults to 'pending' for new bookings
    - Total price is calculated on the frontend before submission
    - Guest email is used for booking lookup and confirmation
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  room_type text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests_count integer NOT NULL DEFAULT 1,
  total_price numeric(10, 2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update payment status"
  ON bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);