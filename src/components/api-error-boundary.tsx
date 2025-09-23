'use client'

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ApiErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ApiErrorBoundary({ error, reset }: ApiErrorBoundaryProps) {
  const isApiError = error.message.includes('API') || error.message.includes('fetch');
  
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {isApiError ? 'API Connection Error' : 'Something went wrong'}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              {isApiError 
                ? 'Unable to connect to the backend API. Please ensure the API server is running on localhost:8080.'
                : error.message
              }
            </p>
            {isApiError && (
              <p className="text-sm">
                Check that your backend server is started and accessible.
              </p>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}