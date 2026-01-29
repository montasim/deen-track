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
import { CalendarIcon, Loader2, Gift, Plus, Trash2, Sparkles, ChevronDown, ChevronRight, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { MDXEditorFormField } from '@/components/ui/mdx-editor-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const rewardSchema = z.object({
  name: z.string().min(2, 'Reward name must be at least 2 characters'),
  description: z.string().min(10, 'Reward description must be at least 10 characters'),
  imageUrl: z.string().optional(),
  icon: z.string().optional(),
  value: z.string().optional(),
  quantity: z.coerce.number().int().min(1).optional(),
  tier: z.string().optional(),
})

const achievementSchema = z.object({
  name: z.string().min(3, 'Achievement name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  points: z.coerce.number().int().positive('Points must be positive'),
  icon: z.string().optional(),
  howToAchieve: z.string().min(10, 'Instructions must be at least 10 characters').optional(),
})

const taskSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().min(10, 'Rules must be at least 10 characters'),
  disqualificationRules: z.string().optional(),
  points: z.coerce.number().int().positive(),
  achievements: z.array(achievementSchema).optional(),
})

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  rules: z.string().optional(),
  disqualificationRules: z.string().optional(),
  termsOfService: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  estimatedDuration: z.coerce.number().int().positive().optional(),
  minPointsToQualify: z.coerce.number().int().min(0).optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  maxParticipants: z.string().optional(),
  tasks: z.array(taskSchema).min(1, 'At least one task is required'),
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

  // Track expanded/collapsed state for sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'details']))
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set())
  const [expandedAchievements, setExpandedAchievements] = useState<Record<number, Set<number>>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

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
    // Get the current task count from form
    const taskCount = form.watch('tasks')?.length || 0
    const allIndices = Array.from({ length: taskCount }, (_, i) => i)
    setExpandedTasks(new Set(allIndices))
  }

  const collapseAllTasks = () => {
    setExpandedTasks(new Set())
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      disqualificationRules: '',
      termsOfService: '',
      category: '',
      difficulty: 'INTERMEDIATE',
      estimatedDuration: undefined,
      minPointsToQualify: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      maxParticipants: '',
      tasks: [],
      rewards: [],
    },
  })

  const { formState: { isValid, errors } } = form

  const {
    fields: rewardFields,
    append: appendReward,
    remove: removeReward,
  } = useFieldArray({
    control: form.control,
    name: 'rewards',
  })

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control: form.control,
    name: 'tasks',
  })

  // Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('=== Form Validation Errors ===')
      console.log('Errors:', JSON.stringify(errors, null, 2))
      console.log('Is Valid:', isValid)
      console.log('=============================')
    }
  }, [errors, isValid])

  useEffect(() => {
    if (template) {
      // Prepare tasks with their achievements
      const tasksData = (template.templateTasks || []).map((task: any) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        rules: task.rules,
        disqualificationRules: task.disqualificationRules,
        points: task.points || 10,
        achievements: (task.achievementsTemplate || []).map((ach: any) => ({
          name: ach.name,
          description: ach.description,
          points: ach.points,
          icon: ach.icon || '',
          howToAchieve: ach.howToAchieve || undefined,
        })),
      }))

      form.reset({
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        description: template.description || '',
        rules: template.rules || '',
        disqualificationRules: template.disqualificationRules || '',
        termsOfService: template.termsOfService || '',
        category: template.category || '',
        difficulty: template.difficulty || 'INTERMEDIATE',
        estimatedDuration: template.estimatedDuration || undefined,
        minPointsToQualify: template.minPointsToQualify || 0,
        startDate: template.startDate ? new Date(template.startDate) : new Date(),
        endDate: template.endDate ? new Date(template.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxParticipants: '',
        tasks: tasksData,
        rewards: [], // Start with empty rewards, not prefilled from template
      })
    }
  }, [template, form])

  const handleSubmit = async (values: FormValues) => {
    console.log('=== Create Campaign from Template Submit ===')
    console.log('Form Values:', JSON.stringify(values, null, 2))
    console.log('Tasks:', values.tasks)
    console.log('Rewards:', values.rewards)
    console.log('========================================')

    setLoading(true)
    try {
      const result = await onSubmit({
        name: values.name,
        description: values.description,
        rules: values.rules,
        disqualificationRules: values.disqualificationRules,
        termsOfService: values.termsOfService,
        category: values.category,
        difficulty: values.difficulty,
        estimatedDuration: values.estimatedDuration,
        minPointsToQualify: values.minPointsToQualify,
        startDate: values.startDate,
        endDate: values.endDate,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : undefined,
        tasks: values.tasks || [],
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
      <SheetContent className="flex flex-col gap-6 sm:max-w-3xl overflow-y-auto border-0 shadow-none">
        <SheetHeader>
          <SheetTitle>Create Campaign from Template</SheetTitle>
          <SheetDescription>
            Using template: <strong>{template?.name}</strong> (ID: {template?.id})
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
              <div className="text-sm">
                <p className="font-medium">Template Details:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• {template?._count?.templateTasks || 0} tasks included</li>
                  <li>• Total Points: {template?.templateTasks?.reduce((sum: number, t: any) => sum + (t.points || 0), 0) || 0}</li>
                  <li>• Difficulty: {template?.difficulty}</li>
                  {template?.estimatedDuration && (
                    <li>• Duration: {template.estimatedDuration} hours</li>
                  )}
                  {template?.minPointsToQualify > 0 && (
                    <li>• Min points to qualify: {template.minPointsToQualify}</li>
                  )}
                  <li>• {template?.templateTasks?.reduce((sum: number, t: any) => sum + (t.achievementsTemplate?.length || 0), 0) || 0} total achievements across all tasks</li>
                </ul>
              </div>
            </div>

            {/* Basic Campaign Info */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('basic')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Campaign Details
                  </CardTitle>
                  {expandedSections.has('basic') ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.has('basic') && (
                <CardContent className="space-y-4 pt-4">
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Fitness, Learning" {...field} />
                          </FormControl>
                          <FormDescription>Optional category for organization</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration (hours)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Optional"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Estimated time to complete</FormDescription>
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
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                            />
                          </FormControl>
                          <FormDescription>Minimum points needed to qualify</FormDescription>
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
                </CardContent>
              )}
            </Card>

            {/* Rules and Terms */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('details')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Rules & Terms
                  </CardTitle>
                  {expandedSections.has('details') ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.has('details') && (
                <CardContent className="space-y-4 pt-4">
                  <MDXEditorFormField
                    name="rules"
                    label="Rules & Guidelines"
                    placeholder="Campaign rules and participation guidelines..."
                    minHeight="150px"
                  />

                  <MDXEditorFormField
                    name="disqualificationRules"
                    label="Disqualification Rules"
                    placeholder="Rules that may lead to disqualification..."
                    minHeight="150px"
                  />

                  <MDXEditorFormField
                    name="termsOfService"
                    label="Terms of Service"
                    placeholder="Terms and conditions for participation..."
                    minHeight="150px"
                  />
                </CardContent>
              )}
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader
                className="cursor-pointer transition-colors"
                onClick={() => toggleSection('tasks')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    Tasks ({taskFields?.length || 0})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        expandAllTasks()
                      }}
                    >
                      Expand All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        collapseAllTasks()
                      }}
                    >
                      Collapse All
                    </Button>
                    {expandedSections.has('tasks') ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedSections.has('tasks') && (
                <CardContent className="space-y-3 pt-4">
                  {taskFields.length > 0 ? (
                    taskFields.map((task, taskIndex) => (
                      <Card key={task.id} className="overflow-hidden">
                        <CardHeader
                          className="cursor-pointer transition-colors"
                          onClick={() => toggleTask(taskIndex)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {taskIndex + 1}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-sm">Task {taskIndex + 1}</CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <FormField
                                    control={form.control}
                                    name={`tasks.${taskIndex}.points`}
                                    render={({ field }) => (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          className="w-20 h-7 text-xs"
                                          min="1"
                                          {...field}
                                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 10)}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span>points</span>
                                        <span>•</span>
                                        <span>{form.watch(`tasks.${taskIndex}.achievements`)?.length || 0} achievements</span>
                                      </div>
                                    )}
                                  />
                                </p>
                              </div>
                            </div>
                            {expandedTasks.has(taskIndex) ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </CardHeader>

                        {expandedTasks.has(taskIndex) && (
                          <CardContent className="space-y-4 pt-4">
                            <FormField
                              control={form.control}
                              name={`tasks.${taskIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Task Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Task name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${taskIndex}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Task description"
                                      rows={3}
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${taskIndex}.rules`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rules</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Task rules"
                                      rows={3}
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tasks.${taskIndex}.disqualificationRules`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Disqualification Rules</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Disqualification rules"
                                      rows={2}
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Achievements */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold flex items-center gap-2">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  Achievements ({form.watch(`tasks.${taskIndex}.achievements`)?.length || 0})
                                </p>
                              </div>

                              <div className="space-y-2">
                                {form.watch(`tasks.${taskIndex}.achievements`)?.map((achievement: any, achIndex: number) => (
                                  <Card key={achIndex}>
                                    <CardHeader
                                      className="cursor-pointer py-3 px-4 hover:bg-muted/70 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleAchievement(taskIndex, achIndex)
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                          <FormField
                                            control={form.control}
                                            name={`tasks.${taskIndex}.achievements.${achIndex}.icon`}
                                            render={({ field }) => (
                                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                  placeholder="🏆"
                                                  className="w-16 h-8 text-center"
                                                  {...field}
                                                />
                                              </div>
                                            )}
                                          />
                                          <div className="flex-1">
                                            <p className="text-sm font-medium">{achievement.name || 'New Achievement'}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {achievement.points || 0} points
                                            </p>
                                          </div>
                                        </div>
                                        {(expandedAchievements[taskIndex]?.has(achIndex)) ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                      </div>
                                    </CardHeader>

                                    {expandedAchievements[taskIndex]?.has(achIndex) && (
                                      <CardContent className="pt-0 px-4 pb-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                          <FormField
                                            control={form.control}
                                            name={`tasks.${taskIndex}.achievements.${achIndex}.name`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-xs">Achievement Name</FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="Achievement name"
                                                    className="text-sm"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={form.control}
                                            name={`tasks.${taskIndex}.achievements.${achIndex}.points`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-xs">Points</FormLabel>
                                                <FormControl>
                                                  <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="10"
                                                    className="text-sm"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <FormField
                                          control={form.control}
                                          name={`tasks.${taskIndex}.achievements.${achIndex}.description`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-xs">Description</FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  placeholder="Achievement description"
                                                  rows={2}
                                                  className="resize-none text-sm"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`tasks.${taskIndex}.achievements.${achIndex}.howToAchieve`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-xs">How to Achieve</FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  placeholder="Instructions on how to unlock this achievement"
                                                  rows={2}
                                                  className="resize-none text-sm"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">No tasks in this template</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Rewards Section */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection('rewards')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-yellow-500" />
                    পুরস্কার ও প্রাইজ
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        appendReward({
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
                    {expandedSections.has('rewards') ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedSections.has('rewards') && (
                <CardContent className="pt-4">
                  {rewardFields.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg">
                      <Gift className="h-10 w-10 mx-auto mb-2 text-neutral-700" />
                      <p className="text-sm text-neutral-500 mb-1">
                        No rewards added. Add prizes to motivate participants!
                      </p>
                      <p className="text-xs text-neutral-600">
                        Template rewards will be used if you don&apos;t add custom ones
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rewardFields.map((field, index) => (
                        <Card key={field.id} className="relative overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2 text-white">
                                Reward {index + 1}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeReward(index)}
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
                                        className="text-white"
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
                                        className="text-white"
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
                                      className="resize-none text-white"
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
                                        className="text-white"
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
                                        className="text-white"
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
                                        className="text-white"
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
                </CardContent>
              )}
            </Card>

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={loading || !isValid || taskFields.length === 0}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Campaign
                {!loading && !isValid && (
                  <span className="ml-2 text-xs opacity-70">
                    (Fix validation errors)
                  </span>
                )}
                {!loading && taskFields.length === 0 && (
                  <span className="ml-2 text-xs opacity-70">
                    (Add at least one task)
                  </span>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
