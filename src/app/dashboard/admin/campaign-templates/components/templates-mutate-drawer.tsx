'use client'

import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Calendar as CalendarIcon, Trophy } from 'lucide-react'
import { createCampaignTemplate, updateCampaignTemplate } from '../../../gamified-campaigns/actions'
import { Loader2 } from 'lucide-react'
import { createTemplateSchema } from '@/lib/gamified-campaign/validation'
import { MDXEditorFormField } from '@/components/ui/mdx-editor-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const formSchema = createTemplateSchema
type TemplatesForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  template?: any
}

export function TemplatesMutateDrawer({ open, onOpenChange, onSuccess, template }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sponsors, setSponsors] = useState<Array<{id: string, name: string}>>([])
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(false)

  const form = useForm<TemplatesForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      disqualificationRules: '',
      termsOfService: '',
      category: '',
      estimatedDuration: undefined,
      difficulty: 'INTERMEDIATE',
      minPointsToQualify: 0,
      sponsorId: undefined,
      tasks: [],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tasks',
  })

  const addTask = () => {
    append({
      name: '',
      description: '',
      rules: '',
      disqualificationRules: '',
      points: 10,
    })
  }

  // Fetch sponsors on mount
  useEffect(() => {
    const fetchSponsors = async () => {
      setIsLoadingSponsors(true)
      try {
        const response = await fetch('/api/sponsors')
        if (response.ok) {
          const data = await response.json()
          setSponsors(data)
        }
      } catch (error) {
        console.error('Failed to fetch sponsors:', error)
      } finally {
        setIsLoadingSponsors(false)
      }
    }
    fetchSponsors()
  }, [])

  // Auto-calculate campaign dates from task dates
  useEffect(() => {
    const tasks = form.watch('tasks') || []
    if (tasks.length > 0) {
      const startDates = tasks
        .map(t => t.startDate ? new Date(t.startDate) : null)
        .filter((d): d is Date => d !== null)
      const endDates = tasks
        .map(t => t.endDate ? new Date(t.endDate) : null)
        .filter((d): d is Date => d !== null)

      if (startDates.length > 0) {
        const minStart = new Date(Math.min(...startDates.map(d => d.getTime())))
        form.setValue('startDate', minStart.toISOString())
      }
      if (endDates.length > 0) {
        const maxEnd = new Date(Math.max(...endDates.map(d => d.getTime())))
        form.setValue('endDate', maxEnd.toISOString())
      }
    }
  }, [form.watch('tasks')])

  // Auto-calculate duration from campaign dates
  useEffect(() => {
    const startDate = form.watch('startDate')
    const endDate = form.watch('endDate')
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
      if (hours > 0) {
        form.setValue('estimatedDuration', hours)
      }
    }
  }, [form.watch('startDate'), form.watch('endDate')])

  // Populate form when editing
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name || '',
        description: template.description || '',
        rules: template.rules || '',
        disqualificationRules: template.disqualificationRules || '',
        termsOfService: template.termsOfService || '',
        category: template.category || '',
        estimatedDuration: template.estimatedDuration || undefined,
        difficulty: template.difficulty || 'INTERMEDIATE',
        startDate: template.startDate ? new Date(template.startDate).toISOString() : undefined,
        endDate: template.endDate ? new Date(template.endDate).toISOString() : undefined,
        minPointsToQualify: template.minPointsToQualify || 0,
        sponsorId: template.sponsorId || undefined,
        tasks: template.templateTasks?.map((task: any) => ({
          name: task.name || '',
          description: task.description || '',
          rules: task.rules || '',
          disqualificationRules: task.disqualificationRules || '',
          points: task.points || 10,
          startDate: task.startDate ? new Date(task.startDate).toISOString() : undefined,
          endDate: task.endDate ? new Date(task.endDate).toISOString() : undefined,
          achievements: task.achievementsTemplate || [],
        })) || [],
      })
    } else {
      form.reset({
        name: '',
        description: '',
        rules: '',
        disqualificationRules: '',
        termsOfService: '',
        category: '',
        estimatedDuration: undefined,
        difficulty: 'INTERMEDIATE',
        minPointsToQualify: 0,
        sponsorId: undefined,
        tasks: [],
      })
    }
  }, [template, form])

  async function onSubmit(values: TemplatesForm) {
    setIsSubmitting(true)
    try {
      const isEditing = !!template
      const result = isEditing
        ? await updateCampaignTemplate({
            templateId: template.id,
            name: values.name,
            description: values.description || undefined,
            rules: values.rules || undefined,
            disqualificationRules: values.disqualificationRules || undefined,
            termsOfService: values.termsOfService || undefined,
            category: values.category || undefined,
            estimatedDuration: values.estimatedDuration || undefined,
            difficulty: values.difficulty,
            startDate: values.startDate ? new Date(values.startDate) : undefined,
            endDate: values.endDate ? new Date(values.endDate) : undefined,
            minPointsToQualify: values.minPointsToQualify || undefined,
            sponsorId: values.sponsorId || undefined,
          })
        : await createCampaignTemplate({
            name: values.name,
            description: values.description || undefined,
            rules: values.rules || undefined,
            disqualificationRules: values.disqualificationRules || undefined,
            termsOfService: values.termsOfService || undefined,
            category: values.category || undefined,
            estimatedDuration: values.estimatedDuration || undefined,
            difficulty: values.difficulty,
            startDate: values.startDate ? new Date(values.startDate) : undefined,
            endDate: values.endDate ? new Date(values.endDate) : undefined,
            minPointsToQualify: values.minPointsToQualify || undefined,
            sponsorId: values.sponsorId || undefined,
            tasks: values.tasks.map((task, index) => ({
              name: task.name,
              description: task.description,
              rules: task.rules,
              disqualificationRules: task.disqualificationRules,
              points: task.points,
              startDate: task.startDate ? new Date(task.startDate) : undefined,
              endDate: task.endDate ? new Date(task.endDate) : undefined,
              order: index,
              achievementsTemplate: task.achievements || undefined,
            })),
          })

      if (result.success) {
        toast({
          title: isEditing ? 'Template updated' : 'Template created',
          description: isEditing
            ? 'Campaign template has been updated successfully.'
            : 'Campaign template has been created successfully.',
        })
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || `Failed to ${isEditing ? 'update' : 'create'} template`,
        })
      }
    } catch (error) {
      console.error(`Error ${template ? 'updating' : 'creating'} template:`, error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-3xl overflow-y-auto border-0 shadow-none">
        <SheetHeader>
          <SheetTitle>{template ? 'Edit Campaign Template' : 'Create Campaign Template'}</SheetTitle>
          <SheetDescription>
            {template
              ? 'Update template information, tasks, rules, and achievement criteria.'
              : 'Create a reusable template with tasks, rules, and achievement criteria.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Template Details */}

              <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Template Name *</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="e.g., Weekly Fitness Challenge"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="e.g., Fitness, Learning, Social"
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
                    name="sponsorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger disabled={isLoadingSponsors}>
                              <SelectValue placeholder={isLoadingSponsors ? "Loading sponsors..." : "Select sponsor"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sponsors.map((sponsor) => (
                              <SelectItem key={sponsor.id} value={sponsor.id}>
                                {sponsor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Optional: Select a sponsor for this campaign</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <MDXEditorFormField
                      name="description"
                      label="Description"
                      placeholder="Describe what this template is for..."
                  />

                  <div className="grid grid-cols-3 gap-4">
                      <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Difficulty *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                                          <SelectItem value="EXPERT">Expert</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="estimatedDuration"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Duration (hours)</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="number"
                                          min="1"
                                          placeholder="Auto-calculated"
                                          {...field}
                                          readOnly
                                          className="bg-muted"
                                      />
                                  </FormControl>
                                  <FormDescription>
                                      Automatically calculated from start and end dates
                                  </FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="minPointsToQualify"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Min Points to Qualify</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="number"
                                          min="0"
                                          placeholder="0"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormDescription>
                                      Points needed to qualify
                                  </FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>Start Date</FormLabel>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <FormControl>
                                              <Button
                                                  variant="outline"
                                                  className="w-full justify-start text-left font-normal"
                                              >
                                                  {field.value ? (
                                                      format(new Date(field.value), 'PPP')
                                                  ) : (
                                                      <span>Auto-calculated from tasks</span>
                                                  )}
                                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                              </Button>
                                          </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                              mode="single"
                                              selected={field.value ? new Date(field.value) : undefined}
                                              onSelect={(date) => {
                                                  if (date) {
                                                      const today = new Date()
                                                      today.setHours(0, 0, 0, 0)
                                                      if (date < today) {
                                                          form.setError('startDate', { message: 'Start date cannot be in the past' })
                                                          return
                                                      }
                                                      field.onChange(date?.toISOString())
                                                      form.clearErrors('startDate')
                                                  }
                                              }}
                                              initialFocus
                                              disabled={{ date: (date) => {
                                                  const today = new Date()
                                                  today.setHours(0, 0, 0, 0)
                                                  return date < today
                                              }}}
                                          />
                                      </PopoverContent>
                                  </Popover>
                                  <FormDescription>Auto-calculated from earliest task start date</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>End Date</FormLabel>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <FormControl>
                                              <Button
                                                  variant="outline"
                                                  className="w-full justify-start text-left font-normal"
                                              >
                                                  {field.value ? (
                                                      format(new Date(field.value), 'PPP')
                                                  ) : (
                                                      <span>Auto-calculated from tasks</span>
                                                  )}
                                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                              </Button>
                                          </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                              mode="single"
                                              selected={field.value ? new Date(field.value) : undefined}
                                              onSelect={(date) => {
                                                  if (date) {
                                                      const today = new Date()
                                                      today.setHours(0, 0, 0, 0)
                                                      if (date < today) {
                                                          form.setError('endDate', { message: 'End date cannot be in the past' })
                                                          return
                                                      }
                                                      field.onChange(date?.toISOString())
                                                      form.clearErrors('endDate')
                                                  }
                                              }}
                                              initialFocus
                                              disabled={{ date: (date) => {
                                                  const today = new Date()
                                                  today.setHours(0, 0, 0, 0)
                                                  return date < today
                                              }}}
                                          />
                                      </PopoverContent>
                                  </Popover>
                                  <FormDescription>Auto-calculated from latest task end date</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>

                  <MDXEditorFormField
                      name="rules"
                      label="Campaign Rules"
                      description="General rules that apply to the entire campaign"
                      placeholder="Describe the overall campaign rules..."
                  />

                  <MDXEditorFormField
                      name="disqualificationRules"
                      label="Disqualification Rules"
                      description="Rules that would disqualify participants"
                      placeholder="Describe disqualification criteria..."
                  />

                  <MDXEditorFormField
                      name="termsOfService"
                      label="Terms of Service"
                      description="Legal terms and conditions for participants"
                      placeholder="Enter terms of service in markdown format..."
                  />
              </div>

            {/* Tasks */}
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tasks</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTask}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <CardDescription>
                  Define tasks with points, rules, and timeframes
                </CardDescription>
              </div>
              <div className="space-y-4 pt-6">
                {fields.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      No tasks added yet. Click &rdquo;Add Task&rdquo; to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Task {index + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Complete 5k run"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <MDXEditorFormField
                            name={`tasks.${index}.description`}
                            label="Task Description"
                            placeholder="Describe what the user needs to do..."
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`tasks.${index}.points`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Points *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="10"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${index}.startDate`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Start Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-start text-left font-normal"
                                        >
                                          {field.value ? (
                                            format(new Date(field.value), 'PPP')
                                          ) : (
                                            <span>Pick</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => {
                                          field.onChange(date?.toISOString())
                                        }}
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
                              name={`tasks.${index}.endDate`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>End Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-start text-left font-normal"
                                        >
                                          {field.value ? (
                                            format(new Date(field.value), 'PPP')
                                          ) : (
                                            <span>Pick</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => {
                                          field.onChange(date?.toISOString())
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <MDXEditorFormField
                            name={`tasks.${index}.rules`}
                            label="Task Rules"
                            placeholder="Rules and requirements for this task..."
                          />

                          <MDXEditorFormField
                            name={`tasks.${index}.disqualificationRules`}
                            label="Disqualification Rules"
                            placeholder="Conditions that would disqualify this task..."
                          />

                          {/* Achievements Section */}
                          <div className="space-y-3 pt-2 border-t">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <Label className="text-sm font-semibold">Achievements</Label>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const currentAchievements = form.watch(`tasks.${index}.achievements`) || []
                                  form.setValue(`tasks.${index}.achievements`, [
                                    ...currentAchievements,
                                    { name: '', description: '', points: 10, howToAchieve: '', icon: '' }
                                  ])
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Achievement
                              </Button>
                            </div>

                            {form.watch(`tasks.${index}.achievements`)?.map((_, achIndex) => (
                              <Card key={achIndex} className="bg-muted/50">
                                <CardContent className="pt-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Achievement {achIndex + 1}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentAchievements = form.watch(`tasks.${index}.achievements`) || []
                                        form.setValue(`tasks.${index}.achievements`,
                                          currentAchievements.filter((_, i) => i !== achIndex)
                                        )
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                      control={form.control}
                                      name={`tasks.${index}.achievements.${achIndex}.name`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Achievement Name</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g., Speed Champion" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`tasks.${index}.achievements.${achIndex}.points`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-xs">Points</FormLabel>
                                          <FormControl>
                                            <Input type="number" min="1" placeholder="10" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={form.control}
                                    name={`tasks.${index}.achievements.${achIndex}.icon`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-xs">Icon (emoji or icon name)</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g., 🏆 or trophy" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <MDXEditorFormField
                                    name={`tasks.${index}.achievements.${achIndex}.description`}
                                    label="Achievement Description"
                                    placeholder="Describe this achievement..."
                                    minHeight="100px"
                                  />

                                  <MDXEditorFormField
                                    name={`tasks.${index}.achievements.${achIndex}.howToAchieve`}
                                    label="How to Achieve"
                                    placeholder="Instructions on how to unlock this achievement..."
                                    minHeight="100px"
                                  />
                                </CardContent>
                              </Card>
                            ))}

                            {(!form.watch(`tasks.${index}.achievements`) ||
                              form.watch(`tasks.${index}.achievements`).length === 0) && (
                              <p className="text-xs text-muted-foreground text-center py-2">
                                No achievements added. Optional: Add achievements to reward users.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting || fields.length === 0}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {template ? 'Update Template' : 'Create Template'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
