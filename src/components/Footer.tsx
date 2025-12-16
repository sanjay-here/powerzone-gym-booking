import { Dumbbell, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="font-display text-2xl tracking-wider text-gradient">POWERZONE</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate fitness destination. Book slots, track progress, and achieve your fitness goals with our state-of-the-art facilities.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="font-display text-xl tracking-wide text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time Slot Booking</li>
              <li>• Workout Statistics & Analytics</li>
              <li>• Booking History Tracking</li>
              <li>• Capacity Management</li>
              <li>• Easy Cancellation</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-display text-xl tracking-wide text-foreground">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@powerzone.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 99430 *****</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>SRM Ramapuram, Chennai</span>
              </li>
            </ul>
          </div>

          {/* Developers Section */}
          <div className="space-y-4">
            <h3 className="font-display text-xl tracking-wide text-foreground">Developers</h3>
            <p className="text-sm text-muted-foreground">
              Sanjay A- RA2311008020159
            </p>
            <p className="text-sm text-muted-foreground">
              Monish M- RA231103000138
            </p>
            <p className="text-sm text-muted-foreground">
              Pravin S - RA231103000138
            </p>
            <p className="text-sm text-muted-foreground">
              Rahul Ramesh - RA231103000153
            </p>
            <p className="text-sm text-muted-foreground">
              Built with passion by the PowerZone team using modern web technologies. The Students of SRM Ramapuram.
            </p>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/in/sanjay-a-749a90223/" className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        
      </div>
    </footer>
  );
}
