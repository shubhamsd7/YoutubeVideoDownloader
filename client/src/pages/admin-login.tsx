import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// In a real application, this would be handled server-side
// This is just for demonstration purposes
const ADMIN_PASSWORD = "ZXC2025"; // Simple admin password

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const [_location, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    setError(null);

    // Simple password check - in a real app, this would be a server authentication
    setTimeout(() => {
      if (data.password === ADMIN_PASSWORD) {
        // Store authentication in sessionStorage
        sessionStorage.setItem("adminAuthenticated", "true");
        // Redirect to admin dashboard
        setLocation("/admin-dashboard");
      } else {
        setError("Invalid password. Please try again.");
      }
      setIsLoading(false);
    }, 800); // Simulate network delay
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter admin password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          This area is restricted to administrators only.
        </CardFooter>
      </Card>
    </div>
  );
}