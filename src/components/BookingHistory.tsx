import { useBookings } from "@/hooks/useBookings";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Hash, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BookingHistory() {
  const { bookings, loading, cancelBooking } = useBookings();

  const handleCancel = async (bookingId: string, bookingCode: string) => {
    const { error } = await cancelBooking(bookingId);
    if (error) {
      toast.error("Failed to cancel booking");
    } else {
      toast.success(`Booking ${bookingCode} cancelled`);
    }
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-primary" />
        <h2 className="font-display text-2xl tracking-wide">Booking History</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No bookings yet. Book a slot to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="font-mono font-bold text-primary">
                      {booking.booking_code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(parseISO(booking.slot.slot_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(booking.slot.slot_start_time)} -{" "}
                      {formatTime(booking.slot.slot_end_time)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleCancel(booking.id, booking.booking_code)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
