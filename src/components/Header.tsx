import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="glass-card sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-wider text-gradient">
              POWERZONE GYM
            </h1>
            <p className="text-muted-foreground text-sm">Book Your Workout Session</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Button>
          )}
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
