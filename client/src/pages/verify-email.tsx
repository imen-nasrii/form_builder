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
        title: "Email vérifié",
        description: "Votre email a été vérifié avec succès",
      });
    },
    onError: (error: Error) => {
      if (error.message.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
      toast({
        title: "Erreur de vérification",
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
        title: "Email envoyé",
        description: "Un nouveau lien de vérification a été envoyé",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
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
            <CardTitle>Vérification en cours...</CardTitle>
            <CardDescription>
              Nous vérifions votre email
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
              Email vérifié
            </CardTitle>
            <CardDescription>
              Votre compte est maintenant activé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Votre email a été vérifié avec succès. Vous pouvez maintenant 
                accéder à toutes les fonctionnalités de la plateforme.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setLocation('/dashboard')} 
                className="w-full"
              >
                Accéder au tableau de bord
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/login')} 
                className="w-full"
              >
                Se connecter
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
            {status === 'expired' ? 'Lien expiré' : 'Erreur de vérification'}
          </CardTitle>
          <CardDescription>
            {status === 'expired' 
              ? 'Le lien de vérification a expiré'
              : 'Impossible de vérifier votre email'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {status === 'expired' 
                ? 'Ce lien de vérification a expiré. Demandez un nouveau lien.'
                : 'Le lien de vérification est invalide ou a déjà été utilisé.'
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
                ? 'Envoi...' 
                : 'Renvoyer le lien de vérification'
              }
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation('/login')} 
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}