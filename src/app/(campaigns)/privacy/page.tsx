import { Metadata } from 'next'
import { Shield, Sparkles, ArrowRight, Lock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import { LegalContentType } from '@prisma/client'
import { getSiteName } from '@/lib/utils/site-settings'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  return {
    title: `গোপনীয়তা নীতি - ${siteName}`,
    description: `${siteName} কিভাবে আপনার তথ্য ব্যবহার করে তা জানুন`,
  }
}

export default async function PrivacyPage() {
  const siteName = await getSiteName()
  let legalContent = null

  try {
    legalContent = await prisma.legalContent.findUnique({
      where: { type: LegalContentType.PRIVACY_POLICY },
      include: {
        lastUpdatedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching privacy content:', error)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Animated Background - matches root page exactly */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-violet-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ left: '20%', top: '10%' }} />
        <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/25 via-purple-600/20 to-pink-500/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ right: '15%', bottom: '20%' }} />
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ left: '50%', top: '50%' }} />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden py-24 lg:py-32">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 bottom-0 right-0 animate-pulse delay-1000" />
          </div>

          <div className="relative container mx-auto max-w-7xl px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">গোপনীয়তা</span>
              </div>

              <h1 className="flex items-center justify-center gap-1 text-5xl font-bold tracking-tight mb-8">
                <span className="text-white">আপনার</span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">গোপনীয়তা</span>
              </h1>

              <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                আপনার গোপনীয়তা আমাদের কাছে খুবই গুরুত্বপূর্ণ। এই নীতিতে বলা হয়েছে {siteName} ব্যবহার করার সময় আমরা কিভাবে আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষিত রাখি তা জানুন।
              </p>

              {legalContent?.effectiveDate && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    কার্যকর: {new Date(legalContent.effectiveDate).toLocaleDateString('bn-BD', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-12">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 lg:p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300">
                {legalContent?.content ? (
                  <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-emerald-400 prose-a:underline-offset-4 hover:prose-a:text-emerald-300 prose-strong:text-white prose-code:text-sm prose-code:rounded prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold prose-code:text-emerald-300 prose-pre:bg-neutral-900 prose-pre:text-neutral-50 prose-li:marker:text-neutral-500">
                    <MDXViewer content={legalContent.content} />
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-white/10 shadow-lg">
                      <Shield className="h-10 w-10 text-neutral-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">এখনো কিছু নেই</h3>
                    <p className="text-neutral-400 mb-2">গোপনীয়তা নীতি এখনো আপলোড করা হয়নি।</p>
                    <p className="text-sm text-neutral-500">পরে আবার দেখুন বা সাপোর্ট টিমের সাথে যোগাযোগ করুন।</p>
                  </div>
                )}
              </div>

              {legalContent?.content && (
                <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">আপনার গোপনীয়তা নিয়ে প্রশ্ন?</h4>
                      <p className="text-neutral-300 leading-relaxed">
                        এই গোপনীয়তা নীতি বা আমাদের তথ্য ব্যবহার সম্পর্কে আপনার কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। আমরা ৩০ দিনের মধ্যে উত্তর দেব।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalContent?.lastUpdatedBy && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-500">
                    সর্বশেষ আপডেট: {new Date(legalContent.updatedAt).toLocaleDateString('bn-BD', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })} | {legalContent.lastUpdatedBy.firstName} {legalContent.lastUpdatedBy.lastName} দ্বারা
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
