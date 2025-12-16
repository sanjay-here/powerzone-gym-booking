import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface Slot {
  id: string;
  slot_date: string;
  slot_start_time: string;
  slot_end_time: string;
  current_bookings: number;
  max_capacity: number;
}

export function useSlots(date: Date) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("daily_slots")
      .select("*")
      .eq("slot_date", dateStr)
      .order("slot_start_time");

    if (error) {
      console.error("Error fetching slots:", error);
      return;
    }

    if (data && data.length > 0) {
      setSlots(data);
    } else {
      // Create slots for today if they don't exist
      await createDailySlots(dateStr);
    }
    
    setLoading(false);
  };

  const createDailySlots = async (dateStr: string) => {
    const slotTimes = [
      { start: "05:00:00", end: "07:00:00" },
      { start: "07:00:00", end: "09:00:00" },
      { start: "09:00:00", end: "11:00:00" },
      { start: "11:00:00", end: "13:00:00" },
      { start: "13:00:00", end: "15:00:00" },
      { start: "15:00:00", end: "17:00:00" },
      { start: "17:00:00", end: "19:00:00" },
      { start: "19:00:00", end: "21:00:00" },
      { start: "21:00:00", end: "23:00:00" },
    ];

    const slotsToInsert = slotTimes.map((time) => ({
      slot_date: dateStr,
      slot_start_time: time.start,
      slot_end_time: time.end,
      current_bookings: 0,
      max_capacity: 50,
    }));

    const { data, error } = await supabase
      .from("daily_slots")
      .insert(slotsToInsert)
      .select();

    if (error) {
      console.error("Error creating slots:", error);
    } else if (data) {
      setSlots(data);
    }
  };

  useEffect(() => {
    fetchSlots();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("slots-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_slots",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setSlots((prev) =>
              prev.map((slot) =>
                slot.id === payload.new.id ? { ...slot, ...payload.new } : slot
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date]);

  return { slots, loading, refetch: fetchSlots };
}
