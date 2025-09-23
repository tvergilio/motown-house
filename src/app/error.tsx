'use client';

import ApiErrorBoundary from '@/components/api-error-boundary';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ApiErrorBoundary error={error} reset={reset} />;
}