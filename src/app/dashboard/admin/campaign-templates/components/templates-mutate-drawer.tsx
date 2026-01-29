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
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Trash2, Calendar as CalendarIcon, Trophy, Gift, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'
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

  // Track expanded/collapsed state for tasks and achievements
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set())
  const [expandedAchievements, setExpandedAchievements] = useState<Record<number, Set<number>>>({})

  const toggleTask = (index: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleAchievement = (taskIndex: number, achIndex: number) => {
    setExpandedAchievements(prev => {
      const taskAchievements = prev[taskIndex] || new Set()
      const next = new Set(taskAchievements)
      if (next.has(achIndex)) {
        next.delete(achIndex)
      } else {
        next.add(achIndex)
      }
      return { ...prev, [taskIndex]: next }
    })
  }

  const expandAllTasks = () => {
    const allIndices = Array.from({ length: fields.length }, (_, i) => i)
    setExpandedTasks(new Set(allIndices))
  }

  const collapseAllTasks = () => {
    setExpandedTasks(new Set())
  }

  const expandAllAchievements = (taskIndex: number) => {
    const achievements = form.watch(`tasks.${taskIndex}.achievements`) || []
    const allIndices = Array.from({ length: achievements.length }, (_, i) => i)
    setExpandedAchievements(prev => ({ ...prev, [taskIndex]: new Set(allIndices) }))
  }

  const collapseAllAchievements = (taskIndex: number) => {
    setExpandedAchievements(prev => ({ ...prev, [taskIndex]: new Set() }))
  }

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
      totalPoints: 0,
    },
    mode: 'all', // Validate on change, blur, and submit
  })

  // Calculate total points from tasks
  const totalPoints = form.watch('tasks')?.reduce((sum: number, task: any) => sum + (Number(task.points) || 0), 0) || 0

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tasks',
  })

  const { formState: { isValid, dirtyFields } } = form
  const hasChanges = Object.keys(dirtyFields).length > 0

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
  const calculateDatesFromTasks = (tasks: any[]) => {
    if (tasks && tasks.length > 0) {
      const startDates = tasks
        .map((t: any) => t.startDate ? new Date(t.startDate) : null)
        .filter((d): d is Date => d !== null)
      const endDates = tasks
        .map((t: any) => t.endDate ? new Date(t.endDate) : null)
        .filter((d): d is Date => d !== null)

      if (startDates.length > 0) {
        const minStart = new Date(Math.min(...startDates.map((d: Date) => d.getTime())))
        form.setValue('startDate', minStart.toISOString() as any, { shouldValidate: false, shouldDirty: false })
      } else {
        form.setValue('startDate', undefined as any, { shouldValidate: false, shouldDirty: false })
      }
      if (endDates.length > 0) {
        const maxEnd = new Date(Math.max(...endDates.map((d: Date) => d.getTime())))
        form.setValue('endDate', maxEnd.toISOString() as any, { shouldValidate: false, shouldDirty: false })
      } else {
        form.setValue('endDate', undefined as any, { shouldValidate: false, shouldDirty: false })
      }
    }
  }

  // Watch for task changes and auto-calculate
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'tasks' || type === 'change') {
        const tasks = value.tasks || []
        calculateDatesFromTasks(tasks)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Auto-calculate duration from campaign dates
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      const startDate = value.startDate
      const endDate = value.endDate

      // Calculate duration when dates change
      if ((name === 'startDate' || name === 'endDate' || name === 'tasks') && startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
        if (hours > 0) {
          form.setValue('estimatedDuration', hours, { shouldValidate: false, shouldDirty: false })
        } else {
          form.setValue('estimatedDuration', undefined as any, { shouldValidate: false, shouldDirty: false })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Populate form when editing
  useEffect(() => {
    if (template) {
      const taskData = template.templateTasks?.map((task: any) => ({
        name: task.name || '',
        description: task.description || '',
        rules: task.rules || '',
        disqualificationRules: task.disqualificationRules || '',
        points: task.points || 10,
        startDate: task.startDate ? new Date(task.startDate).toISOString() : undefined,
        endDate: task.endDate ? new Date(task.endDate).toISOString() : undefined,
        achievements: task.achievementsTemplate || [],
      })) || []

      // Calculate dates from tasks BEFORE form reset
      let calculatedStartDate: Date | undefined = undefined
      let calculatedEndDate: Date | undefined = undefined
      let calculatedTotalPoints: number = 0
      let calculatedDuration: number | undefined = undefined

      if (taskData.length > 0) {
        const startDates = taskData
          .map((t: any) => t.startDate ? new Date(t.startDate) : null)
          .filter((d): d is Date => d !== null)
        const endDates = taskData
          .map((t: any) => t.endDate ? new Date(t.endDate) : null)
          .filter((d): d is Date => d !== null)

        if (startDates.length > 0) {
          calculatedStartDate = new Date(Math.min(...startDates.map((d: Date) => d.getTime())))
        }
        if (endDates.length > 0) {
          calculatedEndDate = new Date(Math.max(...endDates.map((d: Date) => d.getTime())))
        }

        // Calculate duration from dates
        if (calculatedStartDate && calculatedEndDate) {
          const start = calculatedStartDate
          const end = calculatedEndDate
          const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
          if (hours > 0) {
            calculatedDuration = hours
          }
        }

        // Calculate total points
        calculatedTotalPoints = taskData.reduce((sum: number, task: any) => sum + (Number(task.points) || 0), 0)
      }

      form.reset({
        name: template.name || '',
        description: template.description || '',
        rules: template.rules || '',
        disqualificationRules: template.disqualificationRules || '',
        termsOfService: template.termsOfService || '',
        category: template.category || '',
        estimatedDuration: calculatedDuration,
        difficulty: template.difficulty || 'INTERMEDIATE',
        startDate: calculatedStartDate,
        endDate: calculatedEndDate,
        minPointsToQualify: template.minPointsToQualify || 0,
        sponsorId: template.sponsorId || undefined,
        totalPoints: calculatedTotalPoints,
        tasks: taskData,
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
        totalPoints: 0,
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
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Template Name <span className="text-destructive">*</span></FormLabel>
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

                  <div className="grid grid-cols-2 gap-4">
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
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>

                  <MDXEditorFormField
                      name="description"
                      label="Description"
                      placeholder="Describe what this template is for..."
                  />

                  <div className="grid grid-cols-4 gap-4">
                      <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Difficulty <span className="text-destructive">*</span></FormLabel>
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
                          name="totalPoints"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Total Points</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="number"
                                          min="0"
                                          placeholder="0"
                                          {...field}
                                          value={totalPoints}
                                          readOnly
                                          className="bg-muted"
                                      />
                                  </FormControl>
                                  <FormDescription>
                                      Sum of all task points
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
                                  <FormLabel>Start Date <span className="text-destructive">*</span></FormLabel>
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
                                              disabled={(date) => {
                                                  const today = new Date()
                                                  today.setHours(0, 0, 0, 0)
                                                  return date < today
                                              }}
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
                                  <FormLabel>End Date <span className="text-destructive">*</span></FormLabel>
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
                                              disabled={(date) => {
                                                  const today = new Date()
                                                  today.setHours(0, 0, 0, 0)
                                                  return date < today
                                              }}
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
                      placeholder="Describe the overall campaign rules..."
                  />

                  <MDXEditorFormField
                      name="disqualificationRules"
                      label="Disqualification Rules"
                      placeholder="Describe disqualification criteria..."
                  />

                  <MDXEditorFormField
                      name="termsOfService"
                      label="Terms of Service"
                      placeholder="Enter terms of service in markdown format..."
                  />
              </div>

            {/* Tasks */}
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tasks ({fields.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    {fields.length > 0 && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={expandAllTasks}
                        >
                          Expand All
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={collapseAllTasks}
                        >
                          Collapse All
                        </Button>
                      </>
                    )}
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
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleTask(index)}
                              >
                                {expandedTasks.has(index) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <CardTitle className="text-sm">Task {index + 1}</CardTitle>
                            </div>
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
                        {expandedTasks.has(index) && (
                          <CardContent className="space-y-4 pt-4">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task Name <span className="text-destructive">*</span></FormLabel>
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
                                <FormItem className="flex flex-col">
                                  <FormLabel>Points <span className="text-destructive">*</span></FormLabel>
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
                                  <FormLabel>Start Date <span className="text-destructive">*</span></FormLabel>
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
                                  <FormLabel>End Date <span className="text-destructive">*</span></FormLabel>
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
                                <Label className="text-sm font-semibold">
                                  Achievements ({form.watch(`tasks.${index}.achievements`)?.length || 0})
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                {((form.watch(`tasks.${index}.achievements`)?.length || 0) > 1) && (
                                  <>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => expandAllAchievements(index)}
                                    >
                                      Expand All
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => collapseAllAchievements(index)}
                                    >
                                      Collapse All
                                    </Button>
                                  </>
                                )}
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
                            </div>

                            {form.watch(`tasks.${index}.achievements`)?.map((_, achIndex) => {
                              const isExpanded = expandedAchievements[index]?.has(achIndex)
                              return (
                                <Card key={achIndex}>
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => toggleAchievement(index, achIndex)}
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </Button>
                                        <span className="text-sm font-medium">Achievement {achIndex + 1}</span>
                                      </div>
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
                                  </CardHeader>
                                  {isExpanded && (
                                    <CardContent className="space-y-3">
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

                                      <div className="grid grid-cols-2 gap-3">
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
                                      </div>

                                      <MDXEditorFormField
                                        name={`tasks.${index}.achievements.${achIndex}.description`}
                                        label="Achievement Description"
                                        placeholder="Describe this achievement..."
                                        minHeight="150px"
                                      />

                                      <MDXEditorFormField
                                        name={`tasks.${index}.achievements.${achIndex}.howToAchieve`}
                                        label="How to Achieve"
                                        placeholder="Instructions on how to unlock this achievement..."
                                        minHeight="150px"
                                      />
                                    </CardContent>
                                  )}
                                </Card>
                              )
                            })}

                            {(!form.watch(`tasks.${index}.achievements`) ||
                              (form.watch(`tasks.${index}.achievements`)?.length || 0) === 0) && (
                              <p className="text-xs text-muted-foreground text-center py-2">
                                No achievements added. Optional: Add achievements to reward users.
                              </p>
                            )}
                          </div>
                        </CardContent>
                        )}
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
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  fields.length === 0 ||
                  !isValid ||
                  (template ? !hasChanges : false)
                }
              >
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
