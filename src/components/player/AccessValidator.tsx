import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Key, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { eventApi, userApi } from '@/utils/api';
import { useUser } from '@/context/UserContext';

export type AccessMode = 'open' | 'email' | 'password' | 'payment';

interface EventConfig {
  id: string;
  name: string;
  accessMode: AccessMode;
  password?: string;
  paymentAmount?: number;
  streamUrl?: string;
}

interface AccessValidatorProps {
  eventId: string;
  onAccessGranted: (streamUrl: string) => void;
  onPaymentRequired?: (amount: number, eventId: string) => void;
}

export const AccessValidator: React.FC<AccessValidatorProps> = ({
  eventId,
  onAccessGranted,
  onPaymentRequired,
}) => {
  const { hasEventAccess, grantEventAccess } = useUser();
  const [loading, setLoading] = useState(true);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadEventConfig();
  }, [eventId]);

  const loadEventConfig = async () => {
    try {
      setLoading(true);
      const config = await eventApi.getEvent(eventId);
      setEventConfig(config);

      // Check if user already has access
      if (hasEventAccess(eventId)) {
        onAccessGranted(config.streamUrl);
        return;
      }

      // Open access - grant immediately
      if (config.accessMode === 'open') {
        grantEventAccess(eventId);
        onAccessGranted(config.streamUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await userApi.login({
        eventId,
        email,
      });

      if (response.accessGranted && response.streamUrl) {
        grantEventAccess(eventId);
        onAccessGranted(response.streamUrl);
      } else {
        setError('Access denied. Please check your email.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify access');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasswordAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await userApi.login({
        eventId,
        password,
      });

      if (response.accessGranted && response.streamUrl) {
        grantEventAccess(eventId);
        onAccessGranted(response.streamUrl);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid password');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentAccess = () => {
    if (!eventConfig || !eventConfig.paymentAmount) return;
    if (onPaymentRequired) {
      onPaymentRequired(eventConfig.paymentAmount, eventId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!eventConfig) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Event not found or unavailable'}
        </AlertDescription>
      </Alert>
    );
  }

  // Render access form based on mode
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{eventConfig.name}</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {eventConfig.accessMode === 'email' && 'Enter your email to access this event'}
            {eventConfig.accessMode === 'password' && 'Enter the password to access this event'}
            {eventConfig.accessMode === 'payment' && 'Complete payment to access this event'}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Access */}
          {eventConfig.accessMode === 'email' && (
            <form onSubmit={handleEmailAccess} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Access Event
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Password Access */}
          {eventConfig.accessMode === 'password' && (
            <form onSubmit={handlePasswordAccess} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Access Event
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Payment Access */}
          {eventConfig.accessMode === 'payment' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${eventConfig.paymentAmount?.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    One-time payment for event access
                  </p>
                </div>
              </div>
              <Button
                onClick={handlePaymentAccess}
                className="w-full"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>
              <p className="text-xs text-center text-gray-500">
                Secure payment processed by Stripe
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

