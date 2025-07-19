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
import loginIllustration from "@/assets/login-illustration-new.png";

export default function ModernLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await apiRequest("/api/login", {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Urban Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* City Skyline SVG Background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            <polygon points="0,400 0,250 80,250 80,180 120,180 120,220 200,220 200,150 280,150 280,200 320,200 320,160 400,160 400,190 480,190 480,120 560,120 560,170 640,170 640,140 720,140 720,180 800,180 800,110 880,110 880,160 960,160 960,130 1040,130 1040,170 1120,170 1120,200 1200,200 1200,400" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Animated City Lights */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Three-Element Layout */}
        <div className="w-full max-w-7xl grid lg:grid-cols-3 gap-8 items-center">
          
          {/* Element 1: Brand/Logo Section */}
          <div className="hidden lg:flex flex-col items-center text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">FB</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FormBuilder
              </h1>
              <p className="text-xl text-blue-200 mb-8">Professional Form Creation Platform</p>
            </div>
            
            {/* Features */}
            <div className="space-y-4 w-full max-w-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-300">Lightning Fast</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-300">Secure</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-400 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-300">Professional</div>
              </div>
            </div>
          </div>

          {/* Element 2: Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
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

          {/* Element 3: Visual Elements */}
          <div className="hidden lg:flex flex-col items-center text-center text-white">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Modern Design</h2>
            </div>
            
            {/* Design Cards */}
            <div className="space-y-6 w-full max-w-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Premium</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c0 9 5 11 9 11s9-2 9-11l-.5-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Reliable</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Innovative</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}