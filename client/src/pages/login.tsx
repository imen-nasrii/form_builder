import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { showSuccess, showError } = useEnhancedToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      showSuccess("Login Successful", "You are now logged in.");
      setLocation("/");
    },
    onError: (error: any) => {
      showError("Login Error", error.message || "Invalid credentials");
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                <p className="text-gray-600">Welcome back</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="admin@formcraft.pro"
                            className="h-12 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 bg-gray-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-12 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 bg-gray-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-base"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-gray-900 font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}