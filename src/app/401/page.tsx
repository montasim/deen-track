'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '401',
        title: 'প্রমাণীকরণ প্রয়োজন',
        description: (
          <>
            এই পৃষ্ঠায় অ্যাক্সেস করতে আপনাকে সাইন ইন করতে হবে। <br />
            চালিয়ে যেতে আপনার অ্যাকাউন্টে লগ ইন করুন।
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'সাইন ইন করুন',
          onClick: () => router.push('/auth/sign-in'),
        },
      }}
    />
  )
}
