'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Mail, MessageSquare, Send, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'

const contactFormSchema = z.object({
  name: z.string().min(1, 'নাম লিখুন').max(100, 'নাম অনেক বড় হয়ে গেছে'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  subject: z.string().max(200, 'বিষয় অনেক বড় হয়ে গেছে').optional(),
  message: z.string().min(10, 'মেসেজ অন্তত ১০ অক্ষরের হতে হবে').max(5000, 'মেসেজ অনেক বড় হয়ে গেছে'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

interface SiteSettings {
  siteName: string
  supportEmail: string | null
  contactEmail: string | null
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  useEffect(() => {
    setMounted(true)
    fetch('/api/public/site/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.data)
      })
      .catch(console.error)
  }, [])

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: 'মেসেজ পাঠানো হয়েছে! ✅', description: data.message || 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।' })
        form.reset()
      } else {
        toast({ variant: 'destructive', title: 'মেসেজ পাঠাতে সমস্যা হয়েছে', description: data.message || 'আবার চেষ্টা করুন।' })
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'সমস্যা হয়েছে', description: 'আবার চেষ্টা করুন।' })
    } finally {
      setIsSubmitting(false)
    }
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
        <PageHeader
          badgeIcon={Mail}
          badgeText="যোগাযোগ করুন"
          badgeColor="cyan"
          title={
            <>
              <span className="text-white">আমাদের সাথে</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">কথা বলুন!</span>
            </>
          }
          description="কোনো প্রশ্ন আছে? মতামত দিতে চান? নাকি সাধারণ হ্যালো বলতে চান? আমরা শুনতে পছন্দ করবো! নিচের ফর্মটি পূরণ করুন আর আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।"
        />

      {/* Contact Section - NO white overlay, let gradient show through */}
      <section className="relative pb-12">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className={`p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">মেসেজ পাঠান</h2>
                        <p className="text-neutral-400">ফর্মটি পূরণ করুন, আমরা শীঘ্রই উত্তর দেব</p>
                      </div>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-300 font-medium">নাম *</FormLabel>
                              <FormControl>
                                <Input placeholder="আপনার নাম" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-300 font-medium">ইমেইল *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="subject" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300 font-medium">বিষয়</FormLabel>
                            <FormControl>
                              <Input placeholder="কি নিয়ে কথা বলতে চান?" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300 font-medium">মেসেজ *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="আপনার কথা লিখুন..." className="min-h-[150px] resize-y border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300">
                          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />পাঠানো হচ্ছে...</>) : (<><Send className="mr-2 h-4 w-4" />📨 মেসেজ পাঠান</>)}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>

                {/* Contact Info Cards */}
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">ইমেইল করুন</h3>
                    </div>

                    <div className="space-y-4">
                      {settings?.supportEmail && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">সাপোর্ট</div>
                          <a href={`mailto:${settings.supportEmail}`} className="text-white font-medium hover:text-cyan-400 transition-colors">{settings.supportEmail}</a>
                          <p className="text-sm text-neutral-400 mt-1">টেকনিক্যাল সাহায্য আর অ্যাকাউন্ট সমস্যার জন্য</p>
                        </div>
                      )}

                      {settings?.contactEmail && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">সাধারণ জিজ্ঞাসা</div>
                          <a href={`mailto:${settings.contactEmail}`} className="text-white font-medium hover:text-cyan-400 transition-colors">{settings.contactEmail}</a>
                          <p className="text-sm text-neutral-400 mt-1">বিজনেস আর সাধারণ প্রশ্নের জন্য</p>
                        </div>
                      )}

                      {!settings?.supportEmail && !settings?.contactEmail && (
                        <p className="text-sm text-neutral-400">এখন কোনো ইমেইল দেওয়া নেই।</p>
                      )}
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">⏰ উত্তরের সময়</h3>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">আমরা সাধারণত ১-২ দিনের মধ্যে উত্তর দেই। দ্রুত উত্তর পেতে মেসেজে বিস্তারিত লিখুন!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
