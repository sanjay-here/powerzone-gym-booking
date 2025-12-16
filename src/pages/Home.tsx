import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { 
  Dumbbell, 
  Calendar, 
  BarChart3, 
  Clock, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Slot Booking",
    description: "Book your workout slots in seconds with our intuitive booking system. Choose your preferred time and secure your spot."
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Monitor your workout statistics with detailed analytics. View hours worked out, session counts, and trends over time."
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    description: "See live slot availability with color-coded indicators. Green, yellow, and red show capacity at a glance."
  },
  {
    icon: Users,
    title: "Capacity Management",
    description: "Never worry about overcrowding. Our system ensures optimal gym capacity for the best workout experience."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your bookings are safe with us. Unique booking codes and secure authentication protect your data."
  },
  {
    icon: Zap,
    title: "Instant Cancellation",
    description: "Plans changed? Cancel your bookings instantly and free up slots for other members in real-time."
  }
];

const stats = [
  { value: "5 AM", label: "Opening Time" },
  { value: "11 PM", label: "Closing Time" },
  { value: "2 Hours", label: "Slot Duration" },
  { value: "50", label: "Max Capacity" }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20 glow-effect">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
              <span className="font-display text-3xl tracking-wider text-gradient">POWERZONE</span>
            </div>
            <Link to="/login">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/20">
                Login
              </Button>
            </Link>
          </nav>

          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="font-display text-5xl md:text-7xl tracking-wide leading-tight">
              BOOK YOUR <span className="text-gradient">WORKOUT</span> SLOTS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smart way to manage your gym sessions. Real-time booking, progress tracking, and seamless experience all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 glow-effect">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 border-border">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              POWERFUL <span className="text-gradient">FEATURES</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your fitness journey effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-primary/20 w-fit mb-4 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              HOW IT <span className="text-gradient">WORKS</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Login", desc: "Sign in with your credentials provided by the admin" },
                { step: "02", title: "Book Slot", desc: "Choose your preferred time slot and confirm booking" },
                { step: "03", title: "Work Out", desc: "Show your booking code and enjoy your session" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-6xl text-primary/30 mb-4">{item.step}</div>
                  <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto glow-effect">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              READY TO START YOUR <span className="text-gradient">FITNESS JOURNEY</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact your gym administrator to get your login credentials and start booking your workout slots today.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                Login Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
