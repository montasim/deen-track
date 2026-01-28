'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function Forbidden() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '403',
        title: 'দুঃখিত, এখানে ঢোকা যাবে না',
        description: (
          <>
            এই পেজটি শুধুমাত্র বিশেষ ব্যবহারকারীদের জন্য। <br />
            আপনার ড্যাশবোর্ডে অন্য সব কিছু দেখুন!
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'ড্যাশবোর্ডে যান',
          onClick: () => router.push('/dashboard'),
        },
      }}
    />
  )
}
