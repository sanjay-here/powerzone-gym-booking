import { useState } from "react";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { SlotCard } from "@/components/SlotCard";
import { BookingHistory } from "@/components/BookingHistory";
import { WorkoutStats } from "@/components/WorkoutStats";
import { useSlots } from "@/hooks/useSlots";
import { useBookings } from "@/hooks/useBookings";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [selectedDate] = useState(new Date());
  const { slots, loading: slotsLoading } = useSlots(selectedDate);
  const { userSlotIds, bookSlot, refetch } = useBookings();
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  const handleBook = async (slotId: string) => {
    setBookingSlotId(slotId);
    const { error } = await bookSlot(slotId);

    if (error) {
      if (error.message.includes("duplicate")) {
        toast.error("You have already booked this slot");
      } else {
        toast.error("Failed to book slot. Please try again.");
      }
    } else {
      toast.success("Slot booked successfully!");
      refetch();
    }

    setBookingSlotId(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 pb-12 flex-1">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Slots Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="font-display text-2xl tracking-wide">
                  Available Slots
                </h2>
                <span className="text-muted-foreground hidden sm:inline">
                  — {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <WorkoutStats />
            </div>

            <div className="mb-6 p-4 glass-card">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>70%+ Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span>30-70% Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span>Less than 30%</span>
                </div>
              </div>
            </div>

            {slotsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    isBooked={userSlotIds.includes(slot.id)}
                    onBook={() => handleBook(slot.id)}
                    loading={bookingSlotId === slot.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="lg:col-span-1">
            <BookingHistory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
