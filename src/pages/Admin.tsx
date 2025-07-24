import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Navigation,
  Eye,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    activeDrivers: 0,
    pendingApprovals: 0,
    totalEarnings: 0
  });
  const [drivers, setDrivers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchStats();
      fetchDrivers();
      fetchRides();
      fetchWithdrawals();
    }
  }, [user, profile]);

  const fetchStats = async () => {
    try {
      // Fetch total rides
      const { count: ridesCount } = await supabase
        .from('rides')
        .select('*', { count: 'exact', head: true });

      // Fetch active drivers
      const { count: activeDriversCount } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('is_available', true);

      // Fetch pending approvals
      const { count: pendingCount } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total earnings
      const { data: earningsData } = await supabase
        .from('rides')
        .select('final_fare')
        .eq('status', 'completed');

      const totalEarnings = earningsData?.reduce((sum, ride) => 
        sum + (ride.final_fare || 0), 0) || 0;

      setStats({
        totalRides: ridesCount || 0,
        activeDrivers: activeDriversCount || 0,
        pendingApprovals: pendingCount || 0,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          profiles!drivers_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching drivers:', error);
        return;
      }

      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

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
        .select(`
          *,
          profiles!withdrawals_driver_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching withdrawals:', error);
        return;
      }

      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const approveDriver = async (driverId: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status: 'approved' })
        .eq('id', driverId);

      if (error) {
        toast.error('Failed to approve driver');
        return;
      }

      toast.success('Driver approved successfully');
      fetchDrivers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve driver');
    }
  };

  const rejectDriver = async (driverId: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status: 'rejected' })
        .eq('id', driverId);

      if (error) {
        toast.error('Failed to reject driver');
        return;
      }

      toast.success('Driver rejected');
      fetchDrivers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject driver');
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) {
        toast.error('Failed to approve withdrawal');
        return;
      }

      toast.success('Withdrawal approved');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to approve withdrawal');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You don't have admin privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Bhagao Admin
            </h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Welcome, {profile?.full_name}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rides</p>
                  <p className="text-2xl font-bold">{stats.totalRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Drivers</p>
                  <p className="text-2xl font-bold">{stats.activeDrivers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="drivers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="rides">Rides</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="font-semibold">{driver.profiles?.full_name}</h3>
                            <Badge variant={
                              driver.status === 'approved' ? 'default' : 
                              driver.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {driver.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {driver.profiles?.email}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Vehicle:</span>
                              <p className="text-muted-foreground">{driver.vehicle_model}</p>
                            </div>
                            <div>
                              <span className="font-medium">Type:</span>
                              <p className="text-muted-foreground capitalize">{driver.vehicle_type}</p>
                            </div>
                            <div>
                              <span className="font-medium">License:</span>
                              <p className="text-muted-foreground">{driver.license_number}</p>
                            </div>
                            <div>
                              <span className="font-medium">Rating:</span>
                              <p className="text-muted-foreground">{driver.rating}</p>
                            </div>
                          </div>
                        </div>
                        
                        {driver.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveDriver(driver.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectDriver(driver.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rides" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rides.map((ride) => (
                    <div key={ride.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={
                              ride.status === 'completed' ? 'default' : 
                              ride.status === 'in_progress' ? 'secondary' : 'outline'
                            }>
                              {ride.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(ride.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium mb-1">{ride.pickup_location}</p>
                          <p className="text-sm text-muted-foreground mb-2">to {ride.dropoff_location}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Vehicle:</span>
                              <p className="text-muted-foreground capitalize">{ride.vehicle_type}</p>
                            </div>
                            {ride.distance_km && (
                              <div>
                                <span className="font-medium">Distance:</span>
                                <p className="text-muted-foreground">{ride.distance_km} km</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Fare:</span>
                              <p className="text-muted-foreground">₹{ride.final_fare || ride.estimated_fare}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="font-semibold">{withdrawal.profiles?.full_name}</h3>
                            <Badge variant={
                              withdrawal.status === 'approved' ? 'default' : 
                              withdrawal.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {withdrawal.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Amount:</span>
                              <p className="text-muted-foreground">₹{withdrawal.amount}</p>
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span>
                              <p className="text-muted-foreground">
                                {new Date(withdrawal.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {withdrawal.processed_at && (
                              <div>
                                <span className="font-medium">Processed:</span>
                                <p className="text-muted-foreground">
                                  {new Date(withdrawal.processed_at).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {withdrawal.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => approveWithdrawal(withdrawal.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and reporting features will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;