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
      const result = await apiRequest("/api/auth/register", {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Signup Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
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

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or Sign Up With</span>
                  </div>
                </div>

                {/* Social Signup Buttons */}
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
              alt="Signup Illustration"
              className="w-full max-w-lg h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}