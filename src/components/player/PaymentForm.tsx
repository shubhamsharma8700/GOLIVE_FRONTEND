import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { paymentApi, userApi } from '@/utils/api';
import { useMockApi } from '@/utils/mockApi';

// Check if using mock API
const isMockMode = useMockApi();

// Initialize Stripe - should be from environment variable (only if not in mock mode)
const stripePromise = !isMockMode && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

interface PaymentFormProps {
  eventId: string;
  amount: number;
  registrationData?: {
    name: string;
    email: string;
    organization?: string;
  };
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({
  eventId,
  amount,
  registrationData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createIntent = async () => {
      try {
        const intent = await paymentApi.createPaymentIntent(eventId, amount);
        setPaymentIntent(intent);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to initialize payment');
        onPaymentError(err.response?.data?.message || 'Failed to initialize payment');
      }
    };

    createIntent();
  }, [eventId, amount, onPaymentError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);
    setError(null);

    try {
      // In mock mode, skip Stripe and directly process payment
      if (isMockMode) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Register user for event
        if (registrationData) {
          await userApi.register({
            eventId,
            ...registrationData,
            paymentToken: `mock_payment_${Date.now()}`,
          });
        }

        onPaymentSuccess();
        return;
      }

      // Real Stripe flow
      if (!stripe || !elements || !paymentIntent) {
        setError('Payment system not initialized');
        setIsProcessing(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: registrationData?.name || '',
          email: registrationData?.email || '',
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Confirm payment with backend
      const confirmation = await paymentApi.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethod.id
      );

      if (confirmation.success) {
        // Register user for event
        if (registrationData) {
          await userApi.register({
            eventId,
            ...registrationData,
            paymentToken: paymentMethod.id,
          });
        }

        onPaymentSuccess();
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isMockMode ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Details (Mock Mode)</label>
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Card Number (e.g., 4242 4242 4242 4242)"
                className="font-mono"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="MM/YY"
                  className="font-mono"
                />
                <Input
                  type="text"
                  placeholder="CVV"
                  className="font-mono"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              In mock mode, any card details will work for testing.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Details</label>
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Event Access</span>
          <span className="text-sm font-medium">${amount.toFixed(2)}</span>
        </div>
        <div className="border-t border-blue-300 dark:border-blue-700 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isProcessing || (!isMockMode && !stripe)}>
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)} & Access Event
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Secure 256-bit SSL encrypted payment</span>
      </div>

      <p className="text-xs text-center text-gray-500">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const options = {
    appearance: {
      theme: 'stripe' as const,
    },
  };

  // In mock mode, render directly without Stripe Elements
  if (isMockMode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">Complete Payment</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Enter your payment details to access this event (Mock Mode)
          </p>
        </CardHeader>
        <CardContent>
          <PaymentFormContent {...props} />
        </CardContent>
      </Card>
    );
  }

  // Real Stripe mode
  if (!stripePromise) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl text-center">Complete Payment</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          Enter your payment details to access this event
        </p>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <PaymentFormContent {...props} />
        </Elements>
      </CardContent>
    </Card>
  );
};

