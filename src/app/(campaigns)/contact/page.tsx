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

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
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
        toast({ title: 'Message sent successfully!', description: data.message || 'We will get back to you soon.' })
        form.reset()
      } else {
        toast({ variant: 'destructive', title: 'Failed to send message', description: data.message || 'Please try again later.' })
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred. Please try again.' })
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
        <section className="relative py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Get in Touch</span>
              </div>

              <h1 className={`text-5xl font-bold tracking-tight mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-white">Let&apos;s Start a</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">Conversation</span>
              </h1>

              <p className={`text-lg text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Have questions, feedback, or just want to say hello? We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section - NO white overlay, let gradient show through */}
        <section className="relative py-12">
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
                        <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                        <p className="text-neutral-400">Fill out the form and we&apos;ll respond shortly</p>
                      </div>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-300 font-medium">Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neutral-300 font-medium">Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="subject" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300 font-medium">Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What is this regarding?" className="border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300 font-medium">Message *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us more about your inquiry..." className="min-h-[150px] resize-y border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 bg-neutral-900/60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300">
                          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4" />Send Message</>)}
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
                      <h3 className="text-lg font-bold text-white">Email Us</h3>
                    </div>

                    <div className="space-y-4">
                      {settings?.supportEmail && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Support</div>
                          <a href={`mailto:${settings.supportEmail}`} className="text-white font-medium hover:text-cyan-400 transition-colors">{settings.supportEmail}</a>
                          <p className="text-sm text-neutral-400 mt-1">For technical support and account-related issues</p>
                        </div>
                      )}

                      {settings?.contactEmail && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">General Inquiries</div>
                          <a href={`mailto:${settings.contactEmail}`} className="text-white font-medium hover:text-cyan-400 transition-colors">{settings.contactEmail}</a>
                          <p className="text-sm text-neutral-400 mt-1">For business inquiries and general questions</p>
                        </div>
                      )}

                      {!settings?.supportEmail && !settings?.contactEmail && (
                        <p className="text-sm text-neutral-400">No email contacts configured at this time.</p>
                      )}
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">Response Time</h3>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">We typically respond to all inquiries within 1-2 business days. For the fastest response, please include as much detail as possible in your message.</p>
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
