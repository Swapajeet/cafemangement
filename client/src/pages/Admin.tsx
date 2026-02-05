import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { Loader2, Store, Users, CalendarCheck, CalendarX, LogOut } from "lucide-react";
import { format } from "date-fns";

// Login Component
function AdminLogin() {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    login(
      { 
        username: formData.get("username") as string, 
        password: formData.get("password") as string 
      }, 
      { onError: (err) => setError(err.message) }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Staff Portal</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input name="username" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input name="password" type="password" required className="bg-background" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Component
export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  
  const updateSettings = useUpdateSettings();
  const updateBooking = useUpdateBookingStatus();

  if (authLoading || settingsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  // Stats
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0;
  const todayBookings = bookings?.filter(b => b.date === new Date().toISOString().split('T')[0]).length || 0;

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your cafe status and reservations.</p>
          </div>
          
          <Card className="flex items-center p-4 gap-4 bg-card border-border/50 shadow-sm">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Cafe Status</p>
              <p className="text-xs text-muted-foreground">
                {settings?.isOpen ? "Currently Open" : "Currently Closed"}
              </p>
            </div>
            <Switch 
              checked={settings?.isOpen} 
              onCheckedChange={(checked) => updateSettings.mutate({ isOpen: checked })}
            />
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <CalendarCheck className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Requires action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Today's Guests</CardTitle>
              <Store className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayBookings}</div>
              <p className="text-xs text-muted-foreground">Expected today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1 rounded-lg">
            <TabsTrigger value="bookings" className="rounded-md">Reservations</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-md">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>View and manage reservation requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                    {bookings?.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.name}</div>
                          <div className="text-xs text-muted-foreground">{booking.email}</div>
                          <div className="text-xs text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">{booking.time}</div>
                        </TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'accepted' ? 'default' : 
                            booking.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateBooking.mutate({ id: booking.id, status: 'accepted' })}
                                disabled={updateBooking.isPending}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateBooking.mutate({ id: booking.id, status: 'rejected' })}
                                disabled={updateBooking.isPending}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {booking.status !== 'pending' && (
                            <span className="text-xs text-muted-foreground">
                              Processed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Admin Configuration</CardTitle>
                <CardDescription>Update your contact info and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification Email</label>
                  <div className="flex gap-2">
                    <Input 
                      defaultValue={settings?.adminEmail} 
                      placeholder="admin@brunecafe.com"
                      onBlur={(e) => {
                        if (e.target.value !== settings?.adminEmail) {
                          updateSettings.mutate({ adminEmail: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">We'll send booking notifications here.</p>
                </div>
                
                <div className="h-px bg-border" />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  {/* Password change form could go here - simplified for now */}
                  <p className="text-sm text-muted-foreground">
                    To change your password, please contact the system administrator or use the secure password reset flow (not implemented in MVP).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
