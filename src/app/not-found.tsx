'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error-page'

export default function NotFound() {
  const router = useRouter()

  return (
    <ErrorPage
      config={{
        code: '404',
        title: 'ওহ! পেজটি পাওয়া যায়নি',
        description: (
          <>
            দুঃখিত, আপনি যেটা খুঁজছেন সেটা আমরা খুঁজে পাইনি! <br />
            হোম পেজে গিয়ে চ্যালেঞ্জগুলো দেখুন!
          </>
        ),
        secondaryButton: {
          label: 'পিছনে যান',
          onClick: () => router.back(),
        },
        primaryButton: {
          label: 'হোমে যান',
          onClick: () => router.push('/'),
        },
      }}
    />
  )
}
