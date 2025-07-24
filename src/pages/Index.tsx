import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, LogIn, UserPlus, Car, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      // Redirect based on user role
      if (profile.role === 'admin') {
        navigate('/admin');
      } else if (profile.role === 'driver') {
        navigate('/driver');
      } else {
        navigate('/customer');
      }
    }
  }, [user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Bhagao
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name}
                </span>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="hero" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img 
            src={heroImage} 
            alt="Bhagao ride-sharing" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-success/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Your Ride, Your Way</h2>
              <p className="text-lg opacity-90">Fast, Safe, Affordable Transportation</p>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate(user ? '/customer' : '/auth')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a Ride</h3>
              <p className="text-muted-foreground mb-4">
                Get a safe and comfortable ride to your destination
              </p>
              <Button variant="hero" className="w-full">
                {user ? 'Book Now' : 'Get Started'}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(user ? '/driver' : '/auth')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drive & Earn</h3>
              <p className="text-muted-foreground mb-4">
                Join our driver network and start earning money
              </p>
              <Button variant="outline" className="w-full">
                {user ? 'Driver Dashboard' : 'Become a Driver'}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(user ? '/admin' : '/auth')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
              <p className="text-muted-foreground mb-4">
                Manage drivers, rides, and platform operations
              </p>
              <Button variant="secondary" className="w-full">
                Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-center">Why Choose Bhagao?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track your ride in real-time with live GPS updates
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h4 className="font-semibold mb-2">Safe & Secure</h4>
                <p className="text-sm text-muted-foreground">
                  All drivers are verified with background checks
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Car className="h-6 w-6 text-warning" />
                </div>
                <h4 className="font-semibold mb-2">Multiple Options</h4>
                <p className="text-sm text-muted-foreground">
                  Choose from Mini, Sedan, or SUV based on your needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Easy Booking</h4>
                <p className="text-sm text-muted-foreground">
                  Book your ride in just a few taps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        {!user && (
          <Card className="shadow-card text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of satisfied customers and drivers on the Bhagao platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" onClick={() => navigate('/auth')}>
                  Sign Up Now
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/auth')}>
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;