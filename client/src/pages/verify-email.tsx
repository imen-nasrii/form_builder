import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailToken = urlParams.get('token');
    
    if (emailToken) {
      setToken(emailToken);
      verifyEmailMutation.mutate(emailToken);
    } else {
      setStatus('error');
    }
  }, []);

  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      return await apiRequest('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    onSuccess: () => {
      setStatus('success');
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
    },
    onError: (error: Error) => {
      if (error.message.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/resend-verification', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "A new verification link has been sent",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Verification in Progress...</CardTitle>
            <CardDescription>
              We are verifying your email
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Email Verified
            </CardTitle>
            <CardDescription>
              Your account is now activated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your email has been successfully verified. You can now 
                access all platform features.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setLocation('/dashboard')} 
                className="w-full"
              >
                Access Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/login')} 
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            {status === 'expired' ? 'Link Expired' : 'Verification Error'}
          </CardTitle>
          <CardDescription>
            {status === 'expired' 
              ? 'The verification link has expired'
              : 'Unable to verify your email'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {status === 'expired' 
                ? 'This verification link has expired. Request a new link.'
                : 'The verification link is invalid or has already been used.'
              }
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Button 
              onClick={() => resendVerificationMutation.mutate()}
              disabled={resendVerificationMutation.isPending}
              className="w-full"
            >
              {resendVerificationMutation.isPending 
                ? 'Sending...' 
                : 'Resend Verification Link'
              }
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation('/login')} 
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}