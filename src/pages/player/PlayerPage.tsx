import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AccessValidator } from '@/components/player/AccessValidator';
import { VideoPlayer } from '@/components/player/VideoPlayerNew';
import { RegistrationForm } from '@/components/player/RegistrationForm';
import type { RegistrationData } from '@/components/player/RegistrationForm';
import { PaymentForm } from '@/components/player/PaymentForm';
import { useUser } from '@/context/UserContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { eventApi } from '@/utils/api';

type PaymentStep = 'registration' | 'payment' | 'complete';

export const PlayerPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { grantEventAccess } = useUser();

  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('registration');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // -------------------------
  // 🚀 FETCH EVENT DETAILS
  // -------------------------
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await eventApi.getEvent(eventId!);
        
        // Handle different response structures: { success: true, event: {...} } or direct event
        const event = data.event || data;

        // For open access events, try to get stream URL immediately
        // Extract CloudFront URL from various possible fields
        const cloudFrontUrl = event.cloudFrontUrl || event.cloudfrontUrl || event.cloudFront || event.streamUrl || event.playbackUrl;
        
        // If it's open access and we have a URL, set it directly
        if (event.accessMode === 'open' && cloudFrontUrl) {
          setStreamUrl(cloudFrontUrl);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId]);

  // -------------------------
  // ERROR: Invalid event
  // -------------------------
  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>Invalid event ID</AlertDescription>
        </Alert>
      </div>
    );
  }

  // -------------------------
  // PAYMENT HANDLERS
  // -------------------------
  const handlePaymentRequired = (amount: number) => {
    setPaymentAmount(amount);
    setShowPayment(true);
    setPaymentStep('registration');
  };

  const handleRegistrationSubmit = async (data: RegistrationData) => {
    setRegistrationData(data);
    setPaymentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    setShowPayment(false);
    grantEventAccess(eventId);
    window.location.reload();
  };

  // -------------------------
  // Show payment success message
  // -------------------------
  if (paymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Payment successful! You now have access to this event.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // -------------------------
  // PAYMENT FLOW UI
  // -------------------------
  if (showPayment) {
    if (paymentStep === 'registration') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <RegistrationForm
            onSubmit={handleRegistrationSubmit}
            error={null}
          />
        </div>
      );
    }

    if (paymentStep === 'payment' && registrationData) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <PaymentForm
            eventId={eventId}
            amount={paymentAmount}
            registrationData={registrationData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={(err) => console.error(err)}
          />
        </div>
      );
    }
  }

  // -------------------------
  // PLAYER WHEN STREAM URL IS READY
  // -------------------------
  if (streamUrl) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <VideoPlayer
            streamUrl={streamUrl}
            eventId={eventId}
            onReady={() => console.log('Player ready')}
            onError={(error) => console.error('Player error:', error)}
          />
        </div>
      </div>
    );
  }

  // For open access events without streamUrl, show loading or message
  // Don't show AccessValidator for open access

  // -------------------------
  // If access not yet granted → Validate
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AccessValidator
        eventId={eventId}
        onAccessGranted={(url) => setStreamUrl(url)}
        onPaymentRequired={handlePaymentRequired}
      />
    </div>
  );
};
