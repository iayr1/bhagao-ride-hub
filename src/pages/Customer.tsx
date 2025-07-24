import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, Phone, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationInput from "@/components/LocationInput";
import RideCard from "@/components/RideCard";
import heroImage from "@/assets/hero-image.jpg";

const Customer = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const rideTypes = [
    {
      id: "bhagao-mini",
      vehicleType: "Bhagao Mini",
      duration: "3 min",
      price: "₹120",
      rating: 4.8,
      capacity: "4 seats"
    },
    {
      id: "bhagao-sedan",
      vehicleType: "Bhagao Sedan",
      duration: "2 min",
      price: "₹180",
      rating: 4.9,
      capacity: "4 seats"
    },
    {
      id: "bhagao-suv",
      vehicleType: "Bhagao SUV",
      duration: "5 min",
      price: "₹250",
      rating: 4.7,
      capacity: "6 seats"
    }
  ];

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const canShowRides = pickup && dropoff;

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
            <span className="text-sm text-muted-foreground mr-2">
              Welcome, {profile?.full_name}
            </span>
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
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
              <h2 className="text-3xl font-bold mb-2">Book Your Ride</h2>
              <p className="text-lg opacity-90">Fast, Safe, Affordable</p>
            </div>
          </div>
        </div>

        {/* Location Search */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="text-center">Where are you going?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationInput
              placeholder="Enter pickup location"
              value={pickup}
              onChange={setPickup}
              onUseCurrentLocation={handleUseCurrentLocation}
            />
            <LocationInput
              placeholder="Enter drop-off location"
              value={dropoff}
              onChange={setDropoff}
            />
            
            {canShowRides && (
              <Button variant="hero" className="w-full mt-4" size="lg">
                Find Rides
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Available Rides */}
        {canShowRides && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Choose your ride</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rideTypes.map((ride) => (
                <RideCard
                  key={ride.id}
                  vehicleType={ride.vehicleType}
                  duration={ride.duration}
                  price={ride.price}
                  rating={ride.rating}
                  capacity={ride.capacity}
                  isSelected={selectedRide === ride.id}
                  onSelect={() => setSelectedRide(ride.id)}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Trip History</h3>
              <p className="text-sm text-muted-foreground">View past rides</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-sm text-muted-foreground">Get help 24/7</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customer;