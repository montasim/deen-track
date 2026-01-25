'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface TemplateTask {
  name: string
  description: string
  rules: string
  disqualificationRules: string
}

interface TemplateCreateFormProps {
  onSubmit: (formData: FormData) => Promise<void>
}

export function TemplateCreateForm({ onSubmit }: TemplateCreateFormProps) {
  const [tasks, setTasks] = useState<TemplateTask[]>([])

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: '',
        description: '',
        rules: '',
        disqualificationRules: '',
      },
    ])
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTask = (index: number, field: keyof TemplateTask, value: string) => {
    const newTasks = [...tasks]
    newTasks[index][field] = value
    setTasks(newTasks)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Add tasks to form data
    tasks.forEach((task, index) => {
      formData.append(`tasks[${index}][name]`, task.name)
      formData.append(`tasks[${index}][description]`, task.description)
      formData.append(`tasks[${index}][rules]`, task.rules)
      if (task.disqualificationRules) {
        formData.append(`tasks[${index}][disqualificationRules]`, task.disqualificationRules)
      }
    })

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Details */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>Basic information about the template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input id="name" name="name" required placeholder="e.g., Weekly Fitness Challenge" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe what this template is for..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g., Fitness, Learning, Social" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
              <Input
                id="estimatedDuration"
                name="estimatedDuration"
                type="number"
                min="1"
                placeholder="e.g., 10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level *</Label>
            <Select name="difficulty" required defaultValue="INTERMEDIATE">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Add tasks that will be included in campaigns created from this template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <Card key={index} className="bg-muted">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Task {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Task Name</Label>
                  <Input
                    value={task.name}
                    onChange={(e) => updateTask(index, 'name', e.target.value)}
                    placeholder="e.g., Complete 5k run"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={task.description}
                    onChange={(e) => updateTask(index, 'description', e.target.value)}
                    rows={2}
                    placeholder="Describe what the user needs to do..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rules</Label>
                  <Textarea
                    value={task.rules}
                    onChange={(e) => updateTask(index, 'rules', e.target.value)}
                    rows={2}
                    placeholder="Rules and requirements for this task..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Disqualification Rules (Optional)</Label>
                  <Textarea
                    value={task.disqualificationRules}
                    onChange={(e) => updateTask(index, 'disqualificationRules', e.target.value)}
                    rows={2}
                    placeholder="Conditions that would disqualify the submission..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addTask} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add at least one task to create a template
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <a href="/dashboard/admin/campaign-templates">Cancel</a>
        </Button>
        <Button type="submit" disabled={tasks.length === 0}>
          Create Template
        </Button>
      </div>
    </form>
  )
}
