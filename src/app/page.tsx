import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Home,
  Sparkles,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Check,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'

export default async function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with role-based access control and user management.',
      color: 'text-blue-500',
    },
    {
      icon: Sparkles,
      title: 'Modern UI Components',
      description: 'Beautiful, responsive components built with shadcn/ui and Tailwind CSS.',
      color: 'text-pink-500',
    },
    {
      icon: Zap,
      title: 'Fast & Performant',
      description: 'Built with Next.js 15, React 19, and optimized for speed and SEO.',
      color: 'text-amber-500',
    },
    {
      icon: MessageSquare,
      title: 'Blog System',
      description: 'Built-in blog with categories, tags, comments, and SEO optimization.',
      color: 'text-green-500',
    },
  ]

  const benefits = [
    'Role-based admin dashboard',
    'User management with invite system',
    'Email campaigns and notifications',
    'Support ticket system',
    'Activity logging and analytics',
    'Stripe integration for payments',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next.js Admin Template</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build Modern Apps,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Faster Than Ever
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A production-ready Next.js template with authentication, admin dashboard,
              blog, and everything you need to launch your next project.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                <Link href={ROUTES.signUpSimple.href}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                <Link href={ROUTES.blog.href}>View Blog</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-3xl font-bold">Next.js 15</div>
                <div className="text-sm text-muted-foreground">Latest Version</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">React 19</div>
                <div className="text-sm text-muted-foreground">UI Library</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">TypeScript</div>
                <div className="text-sm text-muted-foreground">Type Safe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Build Fast
            </h2>
            <p className="text-lg text-muted-foreground">
              Packed with features to help you build production-ready applications in record time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-background to-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Why Use This Template?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Save weeks of development time with a battle-tested template that includes
                  authentication, admin features, and more out of the box.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button asChild size="lg" className="group">
                    <Link href={ROUTES.signUpSimple.href}>
                      Start Building Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Card className="shadow-2xl border-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
                        <Zap className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">Production Ready</h3>
                      <p className="text-muted-foreground">
                        Deploy immediately and start building your features
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Authentication</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Admin Dashboard</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Blog System</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">API Routes</span>
                        <span className="font-semibold">Ready</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12 md:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Build Your Next Project?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Start with a solid foundation and focus on what makes your product unique.
                Get started in minutes, not days.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-base h-12 px-8"
                >
                  <Link href={ROUTES.signUpSimple.href}>
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base h-12 px-8 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Link href={ROUTES.signIn.href}>Sign In</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Open source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Production ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">My App</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern Next.js template for building production-ready applications.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href={ROUTES.blog.href} className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href={ROUTES.helpCenter.href} className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href={ROUTES.pricing.href} className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href={ROUTES.signIn.href} className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href={ROUTES.signUp.href} className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link href={ROUTES.settings.href} className="hover:text-foreground transition-colors">Settings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href={ROUTES.terms.href} className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href={ROUTES.privacy.href} className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href={ROUTES.contact.href} className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
