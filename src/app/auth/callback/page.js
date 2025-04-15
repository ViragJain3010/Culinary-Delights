'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const [message, setMessage] = useState('Processing your login...');
  const [processing, setProcessing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = useAuth();

  useEffect(() => {
    async function processOAuthCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setMessage(`Authentication error: ${error}`);
          setProcessing(false);
          return;
        }

        if (!code || !state) {
          setMessage('Missing required OAuth parameters');
          setProcessing(false);
          return;
        }

        // Process the OAuth callback
        await handleCallback(code, state);
        
        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('❌ OAuth callback processing failed:', error);
        setMessage('Authentication failed. Please try again.');
        setProcessing(false);
      }
    }

    processOAuthCallback();
  }, [router, searchParams, handleCallback]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-xl font-medium">{message}</h1>
      {processing && (
        <p className="mt-4">Please wait while we complete your authentication...</p>
      )}
      {!processing && (
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Login
        </button>
      )}
    </div>
  );
}