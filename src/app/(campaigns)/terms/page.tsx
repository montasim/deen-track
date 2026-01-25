import { Metadata } from 'next'
import { FileText, Sparkles, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import { LegalContentType } from '@prisma/client'
import { getSiteName } from '@/lib/utils/site-settings'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  return {
    title: `Terms of Service - ${siteName}`,
    description: `Terms of Service and conditions for using ${siteName} platform`,
  }
}

export default async function TermsPage() {
  const siteName = await getSiteName()
  let legalContent = null

  try {
    legalContent = await prisma.legalContent.findUnique({
      where: { type: LegalContentType.TERMS_OF_SERVICE },
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
    console.error('Error fetching terms content:', error)
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
        <section className="relative py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Legal</span>
              </div>

              <h1 className="flex items-center justify-center gap-1 text-5xl font-bold tracking-tight mb-8">
                <span className="text-white">Terms of</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">Service</span>
              </h1>

              <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Please read these terms carefully before using our platform. By accessing or using {siteName}, you agree to be bound by these terms.
              </p>

              {legalContent?.effectiveDate && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    Effective: {new Date(legalContent.effectiveDate).toLocaleDateString('en-US', {
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

        {/* Content Section - NO white overlay */}
        <section className="relative py-12">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 lg:p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300">
                {legalContent?.content ? (
                  <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:underline-offset-4 hover:prose-a:text-cyan-300 prose-strong:text-white prose-code:text-sm prose-code:rounded prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold prose-code:text-cyan-300 prose-pre:bg-neutral-900 prose-pre:text-neutral-50 prose-li:marker:text-neutral-500">
                    <MDXViewer content={legalContent.content} />
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-white/10 shadow-lg">
                      <FileText className="h-10 w-10 text-neutral-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Content Not Available</h3>
                    <p className="text-neutral-400 mb-2">Terms of Service content is not available at this time.</p>
                    <p className="text-sm text-neutral-500">Please check back later or contact support for more information.</p>
                  </div>
                )}
              </div>

              {legalContent?.content && (
                <div className="mt-8 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Important Notice</h4>
                      <p className="text-neutral-300 leading-relaxed">
                        By continuing to use {siteName}, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, please discontinue use of our platform.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalContent?.lastUpdatedBy && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-500">
                    Last updated: {new Date(legalContent.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })} by {legalContent.lastUpdatedBy.firstName} {legalContent.lastUpdatedBy.lastName}
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
