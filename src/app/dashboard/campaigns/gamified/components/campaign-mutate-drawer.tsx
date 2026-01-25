'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import { MDXEditorFormField } from '@/components/ui/mdx-editor-field'

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().optional(),
  disqualificationRules: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  maxParticipants: z.string().optional(),
  isActive: z.boolean().default(true),
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
  campaign?: any
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string; campaign?: any }>
  onSuccess?: () => void
}

export function CampaignMutateDrawer({ open, onOpenChange, campaign, onSubmit, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      disqualificationRules: '',
      startDate: new Date(),
      endDate: new Date(),
      maxParticipants: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name || '',
        description: campaign.description || '',
        rules: campaign.rules || '',
        disqualificationRules: campaign.disqualificationRules || '',
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        maxParticipants: campaign.maxParticipants?.toString() || '',
        isActive: campaign.isActive ?? true,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        rules: '',
        disqualificationRules: '',
        startDate: new Date(),
        endDate: new Date(),
        maxParticipants: '',
        isActive: true,
      })
    }
  }, [campaign, form])

  const handleSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const result = await onSubmit({
        name: values.name,
        description: values.description,
        rules: values.rules,
        disqualificationRules: values.disqualificationRules,
        startDate: values.startDate,
        endDate: values.endDate,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : undefined,
        isActive: values.isActive,
      })

      if (result.success) {
        toast({
          title: campaign ? 'Campaign updated' : 'Campaign created',
          description: campaign
            ? 'Campaign has been updated successfully.'
            : 'Campaign has been created successfully.',
        })
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || `Failed to ${campaign ? 'update' : 'create'} campaign`,
        })
      }
    } catch (error) {
      console.error(`Error ${campaign ? 'updating' : 'creating'} campaign:`, error)
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
          <SheetTitle>{campaign ? 'Edit Campaign' : 'Create Campaign'}</SheetTitle>
          <SheetDescription>
            {campaign
              ? 'Update campaign details and settings'
              : 'Create a new campaign with tasks and rewards'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly Fitness Challenge" {...field} />
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this campaign is about..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MDXEditorFormField
              name="rules"
              label="Campaign Rules"
              description="Optional rules for the campaign"
              placeholder="Enter the campaign rules in Markdown format..."
              minHeight="150px"
            />

            <MDXEditorFormField
              name="disqualificationRules"
              label="Disqualification Rules"
              description="Optional disqualification rules for the campaign"
              placeholder="Enter disqualification rules in Markdown format..."
              minHeight="150px"
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active Campaign</FormLabel>
                    <FormDescription className="text-xs">
                      Active campaigns are visible to users and can be joined
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {campaign ? 'Save Changes' : 'Create Campaign'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
