'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function NotFound() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '404',
        title: 'Oops! Page Not Found',
        description: (
          <>
            The page you&apos;re looking for doesn&apos;t exist <br />
            or might have been moved to a new location.
          </>
        ),
        secondaryButton: {
          label: 'Go Back',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'Back to Home',
          onClick: () => router.push('/'),
        },
      }}
    />
  )
}
