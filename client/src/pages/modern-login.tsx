import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Github, Twitter, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import loginIllustration from "@/assets/login-illustration.png";

export default function ModernLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Login Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Potter@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-0 bg-cyan-50/50"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 bg-gray-50"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 bg-gray-400 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-cyan-300"
                    />
                    <Label htmlFor="remember" className="text-gray-600">
                      Remember Password
                    </Label>
                  </div>
                  <Link href="/forgot-password">
                    <button type="button" className="text-gray-600 hover:text-gray-900 underline">
                      Forget Password?
                    </button>
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-base"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-gray-600">
                  No account yet?{" "}
                  <Link href="/modern-signup">
                    <button type="button" className="text-gray-900 font-medium hover:underline">
                      Register
                    </button>
                  </Link>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or Login With</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300"
                  >
                    <Github className="w-5 h-5 text-gray-700" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-2 border-gray-200 rounded-xl hover:border-gray-300"
                  >
                    <FcGoogle className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex justify-center lg:justify-start">
          <div className="relative">
            <img
              src={loginIllustration}
              alt="Login Illustration"
              className="w-full max-w-lg h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}