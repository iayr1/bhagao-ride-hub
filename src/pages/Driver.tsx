import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Car, 
  Wallet, 
  History, 
  User, 
  MapPin, 
  Phone, 
  Star,
  DollarSign,
  Clock,
  Navigation
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Driver = () => {
  const { user, profile } = useAuth();
  const [driverData, setDriverData] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDriverData();
      fetchWallet();
      fetchRides();
      fetchWithdrawals();
    }
  }, [user]);

  const fetchDriverData = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching driver data:', error);
        return;
      }

      setDriverData(data);
      setIsAvailable(data?.is_available || false);
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const fetchWallet = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('driver_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching wallet:', error);
        return;
      }

      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching rides:', error);
        return;
      }

      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching withdrawals:', error);
        return;
      }

      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const toggleAvailability = async () => {
    if (!driverData) {
      toast.error('Please complete your driver registration first');
      return;
    }

    try {
      const newStatus = !isAvailable;
      const { error } = await supabase
        .from('drivers')
        .update({ is_available: newStatus })
        .eq('user_id', user?.id);

      if (error) {
        toast.error('Failed to update availability');
        return;
      }

      setIsAvailable(newStatus);
      toast.success(newStatus ? 'You are now online!' : 'You are now offline');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const requestWithdrawal = async () => {
    if (!wallet || wallet.balance <= 0) {
      toast.error('Insufficient balance for withdrawal');
      return;
    }

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          driver_id: user?.id,
          wallet_id: wallet.id,
          amount: wallet.balance
        });

      if (error) {
        toast.error('Failed to request withdrawal');
        return;
      }

      toast.success('Withdrawal request submitted successfully');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to request withdrawal');
    }
  };

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
              Bhagao Driver
            </h1>
          </div>
          
          {driverData && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {isAvailable ? 'Online' : 'Offline'}
                </span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={toggleAvailability}
                />
              </div>
              <Badge variant={driverData.status === 'approved' ? 'default' : 'secondary'}>
                {driverData.status}
              </Badge>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!driverData ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Driver Registration Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need to complete your driver registration to access the driver dashboard.
              </p>
              <Button variant="hero">
                Complete Registration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="rides">Rides</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="text-2xl font-bold">₹{wallet?.balance || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                        <Car className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Rides</p>
                        <p className="text-2xl font-bold">{driverData.total_rides}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-bold">{driverData.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  {rides.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No rides yet. Go online to start receiving ride requests!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rides.slice(0, 3).map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{ride.pickup_location}</p>
                              <p className="text-sm text-muted-foreground">to {ride.dropoff_location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{ride.final_fare || ride.estimated_fare}</p>
                            <Badge variant={
                              ride.status === 'completed' ? 'default' : 
                              ride.status === 'in_progress' ? 'secondary' : 'outline'
                            }>
                              {ride.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Wallet Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-3xl font-bold text-primary">₹{wallet?.balance || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold text-success">₹{wallet?.total_earned || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                      <p className="text-2xl font-bold text-muted-foreground">₹{wallet?.total_withdrawn || 0}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={requestWithdrawal}
                    variant="hero" 
                    className="w-full"
                    disabled={!wallet || wallet.balance <= 0}
                  >
                    Request Withdrawal
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  {withdrawals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No withdrawal requests yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {withdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">₹{withdrawal.amount}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(withdrawal.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            withdrawal.status === 'approved' ? 'default' : 
                            withdrawal.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {withdrawal.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Ride History</CardTitle>
                </CardHeader>
                <CardContent>
                  {rides.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No rides completed yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rides.map((ride) => (
                        <div key={ride.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{ride.pickup_location}</span>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{ride.dropoff_location}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{new Date(ride.created_at).toLocaleDateString()}</span>
                                {ride.distance_km && <span>{ride.distance_km} km</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">₹{ride.final_fare || ride.estimated_fare}</p>
                              <Badge variant={
                                ride.status === 'completed' ? 'default' : 
                                ride.status === 'in_progress' ? 'secondary' : 'outline'
                              }>
                                {ride.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Driver Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name</Label>
                        <p className="text-lg">{profile?.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-lg">{profile?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Vehicle Type</Label>
                        <p className="text-lg capitalize">{driverData?.vehicle_type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Vehicle Model</Label>
                        <p className="text-lg">{driverData?.vehicle_model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">License Number</Label>
                        <p className="text-lg">{driverData?.license_number}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={driverData?.status === 'approved' ? 'default' : 'secondary'}>
                          {driverData?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Driver;