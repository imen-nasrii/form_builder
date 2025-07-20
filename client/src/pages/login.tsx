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
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-3">Sign In</h1>
            <p className="text-gray-500 text-lg">Welcome back</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600 text-sm uppercase tracking-wide">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@formcraft.pro"
                        className="h-14 border-0 border-b-2 border-gray-200 rounded-none focus:border-gray-900 focus:ring-0 bg-transparent px-0 text-lg"
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
                    <FormLabel className="text-gray-600 text-sm uppercase tracking-wide">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-14 border-0 border-b-2 border-gray-200 rounded-none focus:border-gray-900 focus:ring-0 bg-transparent px-0 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-none font-normal text-lg uppercase tracking-wide"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-12 text-center">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/register" className="text-black font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}