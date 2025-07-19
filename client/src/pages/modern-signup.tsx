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
import { Github, Twitter, Facebook, User, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import loginIllustration from "@/assets/login-illustration-new.png";

export default function ModernSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const signupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const result = await apiRequest("/api/register", {
        method: "POST",
        body: data,
      });
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Account Created",
        description: "Your account has been created successfully! Please login.",
      });
      setLocation("/modern-login");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        {/* Single Column Layout */}
        <div className="w-full max-w-md">
          <Card className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
                <p className="text-gray-600">Create your account to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="h-12 pl-12 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-0 bg-cyan-50/50"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="h-12 pl-12 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-0 bg-cyan-50/50"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="h-12 pl-12 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-0 bg-cyan-50/50"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 bg-gray-50"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 bg-gray-50"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="border-cyan-300 mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <button type="button" className="text-gray-900 hover:underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-gray-900 hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                </div>

                {/* Signup Button */}
                <Button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-base"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/modern-login">
                    <button type="button" className="text-gray-900 font-medium hover:underline">
                      Login
                    </button>
                  </Link>
                </div>


              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}