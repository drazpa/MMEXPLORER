import React, { useState } from 'react';
import { X, ExternalLink, Crown, Star } from 'lucide-react';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface FeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeaturedTokenData) => void;
}

export interface FeaturedTokenData {
  tokenName: string;
  issuer: string;
  socialLink: string;
  featureType: 'premium' | 'top10';
}

const FEATURE_PRICES = {
  premium: 25,
  top10: 10
};

export const FeaturedModal: React.FC<FeaturedModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [tokenName, setTokenName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [featureType, setFeatureType] = useState<'premium' | 'top10'>('top10');
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSuccess = (details: any) => {
    onSubmit({ 
      tokenName, 
      issuer, 
      socialLink,
      featureType 
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTokenName('');
    setIssuer('');
    setSocialLink('');
    setFeatureType('top10');
    setStep(1);
  };

  const FeatureOption = ({ 
    type, 
    price, 
    title, 
    description, 
    icon: Icon 
  }: { 
    type: 'premium' | 'top10';
    price: number;
    title: string;
    description: string;
    icon: any;
  }) => (
    <button
      onClick={() => setFeatureType(type)}
      className={`w-full p-4 rounded-lg border-2 transition-all ${
        featureType === type
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${
            featureType === type ? 'text-blue-500' : 'text-gray-400'
          } mr-2`} />
          <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        </div>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ${price}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
        {description}
      </p>
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="featured-modal" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity" 
             aria-hidden="true" 
             onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Get Featured Now
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your featuring option and boost your token's visibility
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <FeatureOption
                    type="premium"
                    price={25}
                    title="Premium Spot"
                    description="Get the exclusive top spot with advanced trading chart and detailed statistics"
                    icon={Crown}
                  />
                  <FeatureOption
                    type="top10"
                    price={10}
                    title="Top 10 Listing"
                    description="Feature your token in the top 10 section with enhanced visibility"
                    icon={Star}
                  />
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Token Name
                    </label>
                    <input
                      type="text"
                      id="tokenName"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Issuer Address
                    </label>
                    <input
                      type="text"
                      id="issuer"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="socialLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Social/Trading Link
                    </label>
                    <input
                      type="url"
                      id="socialLink"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Order Summary
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {featureType === 'premium' ? 'Premium Spot' : 'Top 10 Listing'}
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${FEATURE_PRICES[featureType]}
                    </span>
                  </div>
                </div>

                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: {
                          value: FEATURE_PRICES[featureType].toString()
                        },
                        payee: {
                          email_address: "divercityrecords@gmail.com"
                        }
                      }]
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order!.capture().then(handlePaymentSuccess);
                  }}
                  style={{ layout: "horizontal" }}
                />

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};