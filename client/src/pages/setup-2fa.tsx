import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Shield, Smartphone, Key, CheckCircle } from 'lucide-react';

interface Setup2FAResponse {
  qrCode: string;
  manualEntryKey: string;
  message: string;
}

export default function Setup2FA() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState<Setup2FAResponse | null>(null);

  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }) as Setup2FAResponse;
    },
    onSuccess: (data) => {
      setQrCodeData(data);
      setStep('verify');
      toast({
        title: "Configuration 2FA initiée",
        description: "Scannez le QR code avec votre application d'authentification",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const enable2FAMutation = useMutation({
    mutationFn: async (token: string) => {
      return await apiRequest('/api/auth/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    },
    onSuccess: () => {
      setStep('complete');
      toast({
        title: "2FA activée",
        description: "L'authentification à deux facteurs est maintenant active",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Code incorrect",
        description: "Vérifiez le code et réessayez",
        variant: "destructive",
      });
    },
  });

  const handleSetup = () => {
    setup2FAMutation.mutate();
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      enable2FAMutation.mutate(verificationCode);
    } else {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
    }
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              2FA Activée
            </CardTitle>
            <CardDescription>
              Votre compte est maintenant sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                L'authentification à deux facteurs est maintenant active. 
                Vous devrez utiliser votre application d'authentification pour vous connecter.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setLocation('/dashboard')} 
                className="w-full"
              >
                Retour au tableau de bord
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
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">
              Authentification 2FA
            </CardTitle>
          </div>
          <CardDescription>
            Renforcez la sécurité de votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'setup' && (
            <div className="space-y-4">
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire. 
                  Vous aurez besoin d'une application comme Google Authenticator ou Authy.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <p className="font-medium">Applications recommandées :</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Google Authenticator</li>
                    <li>Microsoft Authenticator</li>
                    <li>Authy</li>
                    <li>1Password</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleSetup}
                  className="w-full"
                  disabled={setup2FAMutation.isPending}
                >
                  {setup2FAMutation.isPending ? 'Configuration...' : 'Configurer 2FA'}
                </Button>
              </div>
            </div>
          )}

          {step === 'verify' && qrCodeData && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-3">Étape 1: Scannez le QR code</h3>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img 
                    src={qrCodeData.qrCode} 
                    alt="QR Code pour 2FA" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Clé manuelle :</strong> {qrCodeData.manualEntryKey}
                  <br />
                  <small className="text-gray-600">
                    Utilisez cette clé si vous ne pouvez pas scanner le QR code
                  </small>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="code">Étape 2: Entrez le code de vérification</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-sm text-gray-600">
                  Entrez le code à 6 chiffres généré par votre application
                </p>
              </div>

              <Button 
                onClick={handleVerify}
                className="w-full"
                disabled={enable2FAMutation.isPending || verificationCode.length !== 6}
              >
                {enable2FAMutation.isPending ? 'Vérification...' : 'Activer 2FA'}
              </Button>

              <Button 
                variant="outline"
                onClick={() => setStep('setup')}
                className="w-full"
              >
                Retour
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}