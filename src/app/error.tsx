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
        title: 'কিছু ভুল হয়েছে',
        description: (
          <>
            আমরা একটি অপ্রত্যাশিত ত্রুটির সম্মুখীন হয়েছি। <br />
            অনুগ্রহ করে আবার চেষ্টা করুন অথবা সমস্যা চালু থাকলে সহায়তার সাথে যোগাযোগ করুন।
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
