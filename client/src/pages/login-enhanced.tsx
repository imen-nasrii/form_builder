import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface LoginData {
  email: string;
  password: string;
  twoFactorToken?: string;
}

interface LoginResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  };
  require2FA?: boolean;
  requireEmailVerification?: boolean;
}

export default function LoginEnhanced() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    twoFactorToken: '',
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }) as LoginResponse;
    },
    onSuccess: (data) => {
      if (data.require2FA) {
        setShowTwoFactor(true);
        toast({
          title: "Code 2FA requis",
          description: "Entrez le code de votre application d'authentification",
        });
      } else if (data.requireEmailVerification) {
        setShowEmailVerification(true);
        toast({
          title: "Email non vérifié",
          description: "Vérifiez votre boîte email pour activer votre compte",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user?.email}`,
        });
        setLocation('/dashboard');
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Email envoyé",
        description: "Un nouveau lien de vérification a été envoyé",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Accédez à votre compte Form Builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>

            {showTwoFactor && (
              <div className="space-y-2">
                <Label htmlFor="twoFactorToken">Code d'authentification (6 chiffres)</Label>
                <Input
                  id="twoFactorToken"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.twoFactorToken}
                  onChange={(e) => handleInputChange('twoFactorToken', e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
                <Alert>
                  <AlertDescription>
                    Ouvrez votre application d'authentification (Google Authenticator, Authy, etc.) 
                    et entrez le code à 6 chiffres généré.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {showEmailVerification && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="space-y-2">
                  <p>Votre email n'est pas encore vérifié. Vérifiez votre boîte email.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resendVerificationMutation.mutate()}
                    disabled={resendVerificationMutation.isPending}
                  >
                    {resendVerificationMutation.isPending ? 'Envoi...' : 'Renvoyer l\'email'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setLocation('/register')}
              className="text-sm"
            >
              Créer un compte
            </Button>
            <br />
            <Button
              variant="link"
              onClick={() => setLocation('/forgot-password')}
              className="text-sm"
            >
              Mot de passe oublié ?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}