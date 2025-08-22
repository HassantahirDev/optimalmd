import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe('pk_test_51QFBF9Ibcr1VQY2l0rPXH40tJKpXfK3dD9xJszb1VfYEdqsc2Szd31P5P1kAkifsRxHEasTMnc4M92pIcgPHgsH800kj5r83DP');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  amount: number | string;
  doctorName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  onPaymentSuccess: () => void;
}

interface PaymentFormProps {
  appointmentId: string;
  amount: number | string;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ appointmentId, amount, onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');

  // Helper function to safely convert amount to number
  const getAmount = () => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? 0 : numAmount;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const createPaymentIntentResponse = await fetch('http://localhost:3000/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          appointmentId,
          amount: getAmount(),
          currency: 'usd',
        }),
      });

      if (!createPaymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const responseData = await createPaymentIntentResponse.json();
      console.log('Payment intent response:', responseData);
      
      // Extract data from the wrapped response
      const { clientSecret, paymentIntentId } = responseData.data;
      
      if (!clientSecret) {
        throw new Error('Client secret not received from server');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const confirmPaymentResponse = await fetch('http://localhost:3000/api/stripe/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
          body: JSON.stringify({
            paymentIntentId,
            appointmentId,
          }),
        });

        if (!confirmPaymentResponse.ok) {
          const errorData = await confirmPaymentResponse.json();
          throw new Error(errorData.message || 'Failed to confirm payment');
        }

        const confirmData = await confirmPaymentResponse.json();
        console.log('Payment confirmation response:', confirmData);

        console.log('Setting payment status to success');
        setPaymentStatus('success');
        toast.success('Payment successful! Appointment booked.');
        
        // Wait a moment then close modal and trigger success callback
        setTimeout(() => {
          console.log('Calling onPaymentSuccess callback');
          onPaymentSuccess();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-400 mb-2">Payment Successful!</h3>
        <p className="text-gray-300">Your appointment has been booked successfully.</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="text-center py-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-400 mb-2">Payment Failed</h3>
        <p className="text-gray-300">Please try again or contact support.</p>
        <Button onClick={() => setPaymentStatus('pending')} className="mt-4 bg-red-500 text-white hover:bg-red-600">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Information
          </label>
          <div className="border border-gray-600 rounded-md p-3 bg-gray-700">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
        
        <div className="bg-gray-600 p-4 rounded-md border border-gray-500">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Amount:</span>
            <span className="font-semibold text-lg text-white">${getAmount().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-gray-600 text-white border-gray-500 hover:bg-gray-500"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-red-500 text-white hover:bg-red-600"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${getAmount().toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  amount,
  doctorName,
  serviceName,
  appointmentDate,
  appointmentTime,
  onPaymentSuccess,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5 text-red-500" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Summary */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-white">Appointment Summary</CardTitle>
              <CardDescription className="text-gray-300">Please review your appointment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Doctor:</span>
                <span className="font-medium text-white">{doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Service:</span>
                <span className="font-medium text-white">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Date:</span>
                <span className="font-medium text-white">{appointmentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time:</span>
                <span className="font-medium text-white">{appointmentTime}</span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-2">
                <span className="text-gray-300 font-medium">Total:</span>
                <span className="font-bold text-lg text-red-500">${(typeof amount === 'string' ? parseFloat(amount) : amount).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Elements stripe={stripePromise}>
            <PaymentForm
              appointmentId={appointmentId}
              amount={amount}
              onPaymentSuccess={onPaymentSuccess}
              onClose={onClose}
            />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
