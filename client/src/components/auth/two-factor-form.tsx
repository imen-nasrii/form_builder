import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield } from "lucide-react";

interface TwoFactorFormProps {
  onComplete: () => void;
}

export default function TwoFactorForm({ onComplete }: TwoFactorFormProps) {
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const verify2FAMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-2fa", { token });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Verification Successful",
          description: "Two-factor authentication completed.",
        });
        onComplete();
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "Invalid authentication code.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (!token || token.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit authentication code.",
        variant: "destructive",
      });
      return;
    }

    verify2FAMutation.mutate(token);
  };

  const handleTokenChange = (value: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setToken(numericValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Two-Factor Authentication</h3>
        <p className="text-slate-600 mt-1">Enter the code from your authenticator app</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="authCode">Authentication Code</Label>
          <Input
            id="authCode"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            className="text-center text-2xl font-mono tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-slate-500 text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <Button 
          onClick={handleVerify}
          disabled={verify2FAMutation.isPending || token.length !== 6}
          className="w-full enterprise-gradient"
        >
          {verify2FAMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </Button>
      </div>

      <div className="text-center">
        <Button variant="link" className="text-sm">
          Having trouble? Contact support
        </Button>
      </div>
    </div>
  );
}
