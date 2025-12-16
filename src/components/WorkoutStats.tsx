import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { format, subDays, parseISO, startOfDay, differenceInDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3, TrendingUp, Clock, Calendar, Loader2 } from "lucide-react";

interface StatsData {
  totalWorkouts: number;
  totalHours: number;
  avgPerWeek: number;
  chartData: { date: string; workouts: number; hours: number }[];
}

export function WorkoutStats() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats30, setStats30] = useState<StatsData | null>(null);
  const [stats365, setStats365] = useState<StatsData | null>(null);

  const fetchStats = async (days: number): Promise<StatsData> => {
    const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
    
    const { data: bookings } = await supabase
      .from("bookings")
      .select(`
        id,
        created_at,
        slot:daily_slots(slot_date, slot_start_time, slot_end_time)
      `)
      .eq("user_id", user?.id)
      .gte("created_at", startDate)
      .order("created_at", { ascending: true });

    if (!bookings || bookings.length === 0) {
      return {
        totalWorkouts: 0,
        totalHours: 0,
        avgPerWeek: 0,
        chartData: [],
      };
    }

    const totalWorkouts = bookings.length;
    const totalHours = totalWorkouts * 2; // Each slot is 2 hours
    const weeks = days / 7;
    const avgPerWeek = Math.round((totalWorkouts / weeks) * 10) / 10;

    // Group by date for chart
    const groupedByDate: Record<string, number> = {};
    
    bookings.forEach((booking) => {
      const slot = booking.slot as { slot_date: string } | null;
      if (slot) {
        const date = slot.slot_date;
        groupedByDate[date] = (groupedByDate[date] || 0) + 1;
      }
    });

    // Create chart data with proper intervals
    const chartData: { date: string; workouts: number; hours: number }[] = [];
    const interval = days > 60 ? 7 : 1; // Weekly for 365 days, daily for 30 days
    
    for (let i = days; i >= 0; i -= interval) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      let workouts = 0;
      
      if (interval === 1) {
        workouts = groupedByDate[date] || 0;
      } else {
        // Sum up the week
        for (let j = 0; j < 7; j++) {
          const checkDate = format(subDays(new Date(), i + j), "yyyy-MM-dd");
          workouts += groupedByDate[checkDate] || 0;
        }
      }
      
      chartData.push({
        date: days > 60 ? format(subDays(new Date(), i), "MMM d") : format(subDays(new Date(), i), "MMM d"),
        workouts,
        hours: workouts * 2,
      });
    }

    return { totalWorkouts, totalHours, avgPerWeek, chartData };
  };

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      Promise.all([fetchStats(30), fetchStats(365)]).then(([s30, s365]) => {
        setStats30(s30);
        setStats365(s365);
        setLoading(false);
      });
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          View Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Workout Statistics
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="30days" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
              <TabsTrigger value="365days">Last 365 Days</TabsTrigger>
            </TabsList>

            <TabsContent value="30days" className="space-y-6">
              {stats30 && <StatsView stats={stats30} />}
            </TabsContent>

            <TabsContent value="365days" className="space-y-6">
              {stats365 && <StatsView stats={stats365} />}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatsView({ stats }: { stats: StatsData }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="font-display text-3xl text-primary">{stats.totalWorkouts}</div>
          <div className="text-muted-foreground text-sm">Total Workouts</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="font-display text-3xl text-primary">{stats.totalHours}</div>
          <div className="text-muted-foreground text-sm">Total Hours</div>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="font-display text-3xl text-primary">{stats.avgPerWeek}</div>
          <div className="text-muted-foreground text-sm">Avg/Week</div>
        </div>
      </div>

      {stats.chartData.length > 0 ? (
        <div className="glass-card p-4">
          <h3 className="font-display text-lg mb-4">Workout Frequency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Workouts"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center text-muted-foreground">
          No workout data available for this period.
        </div>
      )}

      {stats.chartData.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-display text-lg mb-4">Hours Spent</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                  name="Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
