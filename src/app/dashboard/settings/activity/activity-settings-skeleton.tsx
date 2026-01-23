'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function ActivitySettingsSkeleton() {
  return (
    <div className='flex flex-1 flex-col'>
      {/* Section Header */}
      <div className='flex-none'>
        <Skeleton className='h-6 w-24 mb-2' />
        <Skeleton className='h-4 w-80' />
      </div>

      {/* Separator */}
      <div className='h-px bg-border my-4 flex-none' />

      {/* Content */}
      <div className='faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16'>
        <div className='lg:max-w-4xl -mx-1 px-1.5 space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className='p-6'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </Card>
            ))}
          </div>

          {/* Filters Section */}
          <Card className='p-6'>
            <div className='space-y-4'>
              <Skeleton className='h-5 w-32' />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <div className='space-y-6'>
            {/* Timeline Group 1 */}
            <div>
              <div className='flex items-center gap-4 mb-4'>
                <Skeleton className='h-5 w-24' />
                <div className='flex-1 h-px bg-border' />
              </div>
              <div className='space-y-3'>
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className='p-4'>
                    <div className='flex items-start gap-4'>
                      <Skeleton className='h-10 w-10 rounded-lg' />
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='h-5 w-32' />
                          <Skeleton className='h-4 w-24' />
                        </div>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-48' />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Timeline Group 2 */}
            <div>
              <div className='flex items-center gap-4 mb-4'>
                <Skeleton className='h-5 w-32' />
                <div className='flex-1 h-px bg-border' />
              </div>
              <div className='space-y-3'>
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className='p-4'>
                    <div className='flex items-start gap-4'>
                      <Skeleton className='h-10 w-10 rounded-lg' />
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='h-5 w-40' />
                          <Skeleton className='h-4 w-20' />
                        </div>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-56' />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
