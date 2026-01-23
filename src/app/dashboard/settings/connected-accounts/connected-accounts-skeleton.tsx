'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ConnectedAccountsSkeleton() {
  return (
    <div className='flex flex-1 flex-col'>
      {/* Section Header */}
      <div className='flex-none'>
        <Skeleton className='h-6 w-40 mb-2' />
        <Skeleton className='h-4 w-72' />
      </div>

      {/* Separator */}
      <div className='h-px bg-border my-4 flex-none' />

      {/* Content */}
      <div className='faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16'>
        <div className='lg:max-w-xl -mx-1 px-1.5'>
          <Card>
            <CardContent className='pt-6 space-y-4'>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                >
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-5 w-5 rounded-full' />
                      <Skeleton className='h-5 w-24' />
                    </div>
                    <Skeleton className='h-4 w-40' />
                  </div>
                  <Skeleton className='h-6 w-11' />
                </div>
              ))}

              {/* Info box */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
                <Skeleton className='h-4 w-64 mx-auto' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
