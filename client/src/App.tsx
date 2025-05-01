import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HowItWorks from "@/pages/how-it-works";
import FAQ from "@/pages/faq";
import Legal from "@/pages/legal";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import { AdminRoute } from "@/components/admin-route";
import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/faq" component={FAQ} />
      <Route path="/legal" component={Legal} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard">
        {() => (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin">
        {() => {
          window.location.href = "/admin-login";
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 container mx-auto py-6 px-4">
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
