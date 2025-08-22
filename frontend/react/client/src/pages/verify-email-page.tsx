import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/verify-email/:token');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [canResend, setCanResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!params?.token) {
        setVerificationStatus('error');
        setIsLoading(false);
        return;
      }

      try {
        await apiRequest(`/api/auth/verify-email/${params.token}`, {
          method: 'POST'
        });
        setVerificationStatus('success');
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified!",
        });
      } catch (error: any) {
        if (error.message.includes('expired')) {
          setVerificationStatus('expired');
          setCanResend(true);
        } else {
          setVerificationStatus('error');
        }
        toast({
          title: "Verification Failed",
          description: error.message || "Failed to verify email",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [params?.token, toast]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail })
      });

      toast({
        title: "Verification Email Sent",
        description: "Check your email for a new verification link.",
      });
      setCanResend(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Email Verified!
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your email has been successfully verified. You can now access all features.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setLocation('/signin')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Continue to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'expired' && canResend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Verification Link Expired
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This verification link has expired. Enter your email to receive a new one.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full h-12 px-4 bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button
              onClick={handleResendVerification}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Send New Verification Email
            </Button>
            <div className="text-center">
              <button
                onClick={() => setLocation('/signin')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Verification Failed
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This verification link is invalid or has already been used.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setLocation('/signin')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Back to Sign In
          </Button>
          <div className="text-center">
            <button
              onClick={() => setLocation('/forgot-password')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Need help? Contact support
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}