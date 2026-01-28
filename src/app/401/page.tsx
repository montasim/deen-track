'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '401',
        title: 'লগইন করুন!',
        description: (
          <>
            এই পেজটি দেখতে আপনাকে আগে লগইন করতে হবে। <br />
            চিন্তা করবেন না - এটা একদম ফ্রি!
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: '🔑 লগইন করুন',
          onClick: () => router.push('/auth/sign-in'),
        },
      }}
    />
  )
}
