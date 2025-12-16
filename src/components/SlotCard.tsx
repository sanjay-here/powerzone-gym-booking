import { Slot } from "@/hooks/useSlots";
import { Button } from "@/components/ui/button";
import { Clock, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slot: Slot;
  isBooked: boolean;
  onBook: () => void;
  loading?: boolean;
}

export function SlotCard({ slot, isBooked, onBook, loading }: SlotCardProps) {
  const available = slot.max_capacity - slot.current_bookings;
  const percentage = (available / slot.max_capacity) * 100;

  const getStatusClass = () => {
    if (percentage >= 70) return "slot-green";
    if (percentage >= 30) return "slot-yellow";
    return "slot-red";
  };

  const getStatusColor = () => {
    if (percentage >= 70) return "text-green-400";
    if (percentage >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const isFull = available <= 0;

  return (
    <div
      className={cn(
        "glass-card p-5 border-2 transition-all duration-300 hover:scale-[1.02] animate-fade-in",
        getStatusClass(),
        isBooked && "ring-2 ring-primary glow-effect"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-display text-xl tracking-wider">
            {formatTime(slot.slot_start_time)} - {formatTime(slot.slot_end_time)}
          </span>
        </div>
        {isBooked && (
          <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Booked</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className={cn("w-5 h-5", getStatusColor())} />
          <span className={cn("font-semibold", getStatusColor())}>
            {available} / {slot.max_capacity}
          </span>
          <span className="text-muted-foreground text-sm">spots left</span>
        </div>

        {!isBooked && (
          <Button
            onClick={onBook}
            disabled={isFull || loading}
            className={cn(
              "font-semibold",
              isFull && "opacity-50 cursor-not-allowed"
            )}
          >
            {isFull ? "Full" : "Book Now"}
          </Button>
        )}
      </div>

      {/* Capacity bar */}
      <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            percentage >= 70 && "bg-green-500",
            percentage >= 30 && percentage < 70 && "bg-yellow-500",
            percentage < 30 && "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
