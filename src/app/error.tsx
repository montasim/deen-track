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
        title: 'উফ! কিছু সমস্যা হয়েছে',
        description: (
          <>
            আমাদের সিস্টেমে ছোট একটা সমস্যা হয়েছে। <br />
            আবার চেষ্টা করুন অথবা আমাদের সাথে যোগাযোগ করুন!
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'আবার চেষ্টা করুন',
          onClick: reset,
        },
      }}
    />
  )
}
