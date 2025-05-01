import { useState, useEffect } from "react";
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface SiteStats {
  totalVisits: number;
  apiCalls: number;
  videosFetched: number;
  downloadsStarted: number;
  downloadsCompleted: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<SiteStats>("/api/admin/stats");
      setStats(response);
      setError(null);
    } catch (err) {
      setError("Failed to load stats. Please try again.");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up auto-refresh interval
    const intervalId = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleLogout = () => {
    // Clear admin authentication
    sessionStorage.removeItem("adminAuthenticated");
    // Redirect to login page
    setLocation("/admin-login");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchStats} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button 
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Visits"
          value={stats?.totalVisits || 0}
          description="Total page visits"
          loading={loading}
        />
        <StatsCard
          title="API Calls"
          value={stats?.apiCalls || 0}
          description="Backend API requests"
          loading={loading}
        />
        <StatsCard
          title="Videos Fetched"
          value={stats?.videosFetched || 0}
          description="Video info retrievals"
          loading={loading}
        />
        <StatsCard
          title="Downloads Started"
          value={stats?.downloadsStarted || 0}
          description="Download requests initiated"
          loading={loading}
        />
        <StatsCard
          title="Downloads Completed"
          value={stats?.downloadsCompleted || 0}
          description="Successful downloads"
          loading={loading}
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {stats?.lastUpdated ? formatDate(stats.lastUpdated) : "No data"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>How your application is performing</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricItem 
                    label="Conversion Rate" 
                    value={calculateRate(stats?.downloadsCompleted, stats?.videosFetched)} 
                    unit="%" 
                    description="Videos downloaded vs. info fetched"
                  />
                  <MetricItem 
                    label="Completion Rate" 
                    value={calculateRate(stats?.downloadsCompleted, stats?.downloadsStarted)} 
                    unit="%" 
                    description="Downloads completed vs. started"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  loading: boolean;
}

function StatsCard({ title, value, description, loading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricItemProps {
  label: string;
  value: number;
  unit: string;
  description: string;
}

function MetricItem({ label, value, unit, description }: MetricItemProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-2xl font-bold">
          {value.toFixed(1)}{unit}
        </div>
      </div>
    </div>
  );
}

function calculateRate(numerator?: number, denominator?: number): number {
  if (!numerator || !denominator || denominator === 0) return 0;
  return (numerator / denominator) * 100;
}