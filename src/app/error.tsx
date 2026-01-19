'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '500',
        title: 'Oops! Something Went Wrong!',
        description: (
          <>
            We encountered an unexpected error. <br />
            Please try again or contact support if the problem persists.
          </>
        ),
        secondaryButton: {
          label: 'Go Back',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'Try Again',
          onClick: reset,
        },
      }}
    />
  )
}
