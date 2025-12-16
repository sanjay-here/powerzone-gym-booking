import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Booking {
  id: string;
  booking_code: string;
  created_at: string;
  slot: {
    slot_date: string;
    slot_start_time: string;
    slot_end_time: string;
  };
}

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSlotIds, setUserSlotIds] = useState<string[]>([]);

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_code,
        created_at,
        slot_id,
        slot:daily_slots(slot_date, slot_start_time, slot_end_time)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else if (data) {
      const formattedBookings = data.map((b) => ({
        id: b.id,
        booking_code: b.booking_code,
        created_at: b.created_at,
        slot: b.slot as { slot_date: string; slot_start_time: string; slot_end_time: string },
      }));
      setBookings(formattedBookings);
      setUserSlotIds(data.map((b) => b.slot_id));
    }
    
    setLoading(false);
  };

  const bookSlot = async (slotId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("bookings").insert([{
      user_id: user.id,
      slot_id: slotId,
      booking_code: "",
    }]);

    if (!error) {
      await fetchBookings();
    }

    return { error };
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    // Refetch both bookings list and trigger slot updates
    if (!error) {
      await fetchBookings();
    }

    return { error };
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  return { bookings, loading, userSlotIds, bookSlot, cancelBooking, refetch: fetchBookings };
}
