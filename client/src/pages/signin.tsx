import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEnhancedToast } from '@/hooks/use-enhanced-toast';
import { apiRequest } from '@/lib/queryClient';
import { Mail, Lock } from 'lucide-react';

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { showSuccess, showError } = useEnhancedToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showMascot, setShowMascot] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setShowMascot(true);
      setTimeout(() => setShowMascot(false), 3000);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await apiRequest('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      showSuccess("Success", "Signed in successfully!");
      
      // Redirect to dashboard/home after successful login
      window.location.href = '/';
    } catch (error: any) {
      showError("Login Error", error.message || "Invalid email or password");
      setShowMascot(true);
      setTimeout(() => setShowMascot(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative"
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      
      {/* 3D Error Mascot */}
      {showMascot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative animate-bounce">
            {/* 3D Mascot Character */}
            <div className="w-32 h-32 relative">
              {/* Main body */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 rounded-full shadow-2xl transform rotate-3 animate-pulse"
                   style={{
                     boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4), inset 0 -10px 20px rgba(0,0,0,0.2)'
                   }}>
              </div>
              
              {/* Eyes */}
              <div className="absolute top-6 left-6 w-6 h-6 bg-white rounded-full shadow-inner">
                <div className="w-4 h-4 bg-black rounded-full mt-1 ml-1 animate-ping"></div>
              </div>
              <div className="absolute top-6 right-6 w-6 h-6 bg-white rounded-full shadow-inner">
                <div className="w-4 h-4 bg-black rounded-full mt-1 ml-1 animate-ping"></div>
              </div>
              
              {/* Sad mouth */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-4 border-4 border-white border-t-0 rounded-b-full"></div>
              
              {/* Arms waving */}
              <div className="absolute top-12 -left-4 w-6 h-6 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-12 -right-4 w-6 h-6 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            </div>
            
            {/* Speech bubble */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-xl animate-fade-in border-4 border-red-200">
              <div className="text-red-600 font-bold text-sm text-center whitespace-nowrap">
                Oops! C'est faux! 😔
              </div>
              {Object.values(errors)[0] && (
                <div className="text-red-500 text-xs text-center mt-1">
                  {Object.values(errors)[0]}
                </div>
              )}
              {/* Speech bubble arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
            
            {/* Sparkles around mascot */}
            <div className="absolute -top-8 -left-8 animate-ping text-2xl">❌</div>
            <div className="absolute -top-4 -right-8 animate-pulse text-xl">💢</div>
            <div className="absolute -bottom-4 -left-6 animate-bounce text-lg" style={{ animationDelay: '0.5s' }}>⚠️</div>
            <div className="absolute -bottom-6 -right-4 animate-ping text-lg" style={{ animationDelay: '1s' }}>🚫</div>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </CardTitle>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Welcome back
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@formcraft.pro"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`h-12 pl-12 bg-blue-50 dark:bg-gray-700 ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-blue-200 dark:border-gray-600'}`}
                  required
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-red-500 text-xl animate-bounce">❌</div>
                  </div>
                )}
              </div>
              {errors.email && (
                <div className="text-red-500 text-xs mt-1 animate-fade-in">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`h-12 pl-12 bg-blue-50 dark:bg-gray-700 ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-blue-200 dark:border-gray-600'}`}
                  required
                />
                {errors.password && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-red-500 text-xl animate-bounce">❌</div>
                  </div>
                )}
              </div>
              {errors.password && (
                <div className="text-red-500 text-xs mt-1 animate-fade-in">
                  {errors.password}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setLocation('/forgot-password')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setLocation('/signup')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}