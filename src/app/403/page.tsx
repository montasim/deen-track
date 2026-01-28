'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function Forbidden() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '403',
        title: 'অ্যাক্সেস অস্বীকার করা হয়েছে',
        description: (
          <>
            এই পৃষ্ঠায় অ্যাক্সেস করার অনুমতি নেই। <br />
            এই এলাকাটি শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য সীমাবদ্ধ।
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
