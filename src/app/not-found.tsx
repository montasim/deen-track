'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function NotFound() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '404',
        title: 'ওহ! পৃষ্ঠা পাওয়া যায়নি',
        description: (
          <>
            আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নয় <br />
            অথবা নতুন অবস্থানে সরানো হয়েছে।
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'হোমে ফিরে যান',
          onClick: () => router.push('/'),
        },
      }}
    />
  )
}
