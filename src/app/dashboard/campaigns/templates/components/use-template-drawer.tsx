'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Loader2, Gift, Plus, Trash2, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

const rewardSchema = z.object({
  name: z.string().min(2, 'Reward name must be at least 2 characters'),
  description: z.string().min(10, 'Reward description must be at least 10 characters'),
  imageUrl: z.string().optional(),
  icon: z.string().optional(),
  value: z.string().optional(),
  quantity: z.coerce.number().int().min(1).optional(),
  tier: z.string().optional(),
})

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  maxParticipants: z.string().optional(),
  rewards: z.array(rewardSchema).optional(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
)

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: any
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string; campaign?: any }>
}

export function UseTemplateDrawer({ open, onOpenChange, template, onSubmit }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      maxParticipants: '',
      rewards: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rewards',
  })

  useEffect(() => {
    if (template) {
      form.reset({
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        description: template.description || '',
        startDate: template.startDate ? new Date(template.startDate) : new Date(),
        endDate: template.endDate ? new Date(template.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxParticipants: '',
        rewards: template.rewardsTemplate || [],
      })
    }
  }, [template, form])

  const handleSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const result = await onSubmit({
        name: values.name,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : undefined,
        rewards: values.rewards || [],
      })

      if (result.success) {
        toast({
          title: 'Campaign created',
          description: 'Campaign has been created successfully from template.',
        })
        form.reset()
        onOpenChange(false)
        // Navigate to the campaign detail page
        router.push(`/dashboard/campaigns/gamified/${result.campaign.id}`)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to create campaign',
        })
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-xl overflow-y-auto border-0 shadow-none">
        <SheetHeader>
          <SheetTitle>Create Campaign from Template</SheetTitle>
          <SheetDescription>
            Using template: <strong>{template?.name}</strong>
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
              <div className="text-sm">
                <p className="font-medium">Template Details:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• {template?._count?.templateTasks || 0} tasks included</li>
                  <li>• Difficulty: {template?.difficulty}</li>
                  {template?.estimatedDuration && (
                    <li>• Duration: {template.estimatedDuration} hours</li>
                  )}
                  {template?.minPointsToQualify > 0 && (
                    <li>• Min points to qualify: {template.minPointsToQualify}</li>
                  )}
                </ul>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly Fitness Challenge - Jan 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional custom description for this campaign"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty to use template description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited participants
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rewards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Gift className="h-4 w-4 text-pink-500" />
                    পুরস্কার ও প্রাইজ
                  </Label>
                  <p className="text-sm text-neutral-400">
                    ঐচ্ছিক: বিজয়ীদের জন্য পুরস্কার যোগ করুন
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    append({
                      name: '',
                      description: '',
                      imageUrl: '',
                      icon: '',
                      value: '',
                      quantity: 1,
                      tier: '',
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reward
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed rounded-lg bg-neutral-900/20">
                  <Gift className="h-10 w-10 mx-auto mb-2 text-neutral-700" />
                  <p className="text-sm text-neutral-500 mb-1">
                    No rewards added. Add prizes to motivate participants!
                  </p>
                  <p className="text-xs text-neutral-600">
                    Template rewards will be used if you don't add custom ones
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative overflow-hidden bg-neutral-900/40 border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center gap-2 text-white">
                            <Sparkles className="h-4 w-4 text-pink-500" />
                            Reward {index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`rewards.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-white">Reward Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 1st Prize"
                                    className="bg-neutral-900/60 border-white/20 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`rewards.${index}.tier`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-white">Tier / Position</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 1st Place"
                                    className="bg-neutral-900/60 border-white/20 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`rewards.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-white">Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe what the winner receives..."
                                  rows={2}
                                  className="resize-none bg-neutral-900/60 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-3">
                          <FormField
                            control={form.control}
                            name={`rewards.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-white">Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., $100, BDT 5000"
                                    className="bg-neutral-900/60 border-white/20 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`rewards.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-white">Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    className="bg-neutral-900/60 border-white/20 text-white"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`rewards.${index}.icon`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-white">Icon</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 🏆"
                                    className="bg-neutral-900/60 border-white/20 text-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Campaign
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
