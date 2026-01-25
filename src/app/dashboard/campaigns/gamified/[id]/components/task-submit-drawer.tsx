'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Upload } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  proofType: z.enum(['IMAGE', 'AUDIO', 'URL', 'TEXT'], {
    required_error: 'Please select a proof type',
  }),
  url: z.string().optional(),
  text: z.string().optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.proofType === 'URL') {
      try {
        z.string().url().parse(data.url)
        return true
      } catch {
        return false
      }
    }
    if (data.proofType === 'TEXT') {
      return data.text && data.text.length >= 10
    }
    return true
  },
  {
    message: 'Please provide the required information for your proof type',
  }
).refine(
  (data) => {
    if (data.proofType === 'URL' && !data.url) return false
    if (data.proofType === 'TEXT' && (!data.text || data.text.length < 10)) return false
    return true
  },
  {
    message: 'Please provide the required information for your proof type',
  }
)

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
  campaignId: string
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string }>
}

export function TaskSubmitDrawer({ open, onOpenChange, task, campaignId, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proofType: 'TEXT',
      url: '',
      text: '',
      notes: '',
    },
  })

  const proofType = form.watch('proofType')

  const handleSubmit = async (values: FormValues) => {
    console.log('Form submitted with values:', values)
    console.log('Task:', task)
    console.log('File:', file)

    if (!task) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No task selected',
      })
      return
    }

    // Validate file requirements
    if ((values.proofType === 'IMAGE' || values.proofType === 'AUDIO') && !file) {
      toast({
        variant: 'destructive',
        title: 'File required',
        description: `Please upload a ${values.proofType === 'IMAGE' ? 'an image' : 'an audio'} file`,
      })
      return
    }

    setLoading(true)
    try {
      console.log('Calling onSubmit...')
      const result = await onSubmit({
        taskId: task.id,
        campaignId,
        proofType: values.proofType,
        file: file || undefined,
        url: values.url || undefined,
        text: values.text || undefined,
        notes: values.notes || undefined,
      })
      console.log('Submit result:', result)

      if (result.success) {
        toast({
          title: 'Task submitted!',
          description: 'Your task has been submitted for review.',
        })
        form.reset()
        setFile(null)
        onOpenChange(false)
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission failed',
          description: result.message || 'Failed to submit task',
        })
      }
    } catch (error: any) {
      console.error('Error submitting task:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to submit task',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  if (!task) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto border-0 shadow-none">
        <SheetHeader>
          <SheetTitle>Submit Task Proof</SheetTitle>
          <SheetDescription>
            {task ? (
              <>Submit proof for task: <strong>{task.name}</strong></>
            ) : (
              'Submit task proof'
            )}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Proof Type Selection */}
            <FormField
              control={form.control}
              name="proofType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select proof type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IMAGE">Image Upload</SelectItem>
                      <SelectItem value="AUDIO">Audio Upload</SelectItem>
                      <SelectItem value="URL">URL Link</SelectItem>
                      <SelectItem value="TEXT">Text Description</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how you want to submit your task proof
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            {(proofType === 'IMAGE' || proofType === 'AUDIO') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File *</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept={proofType === 'IMAGE' ? 'image/*' : 'audio/*'}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : `Click to upload ${proofType === 'IMAGE' ? 'an image' : 'an audio file'}`}
                    </p>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: {proofType === 'IMAGE' ? 'JPG, PNG, GIF' : 'MP3, WAV, M4A'}
                </p>
              </div>
            )}

            {/* URL Input */}
            {proofType === 'URL' && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/proof" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a link to your proof (e.g., YouTube video, blog post, social media post)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Text Input */}
            {proofType === 'TEXT' && (
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how you completed this task..."
                        rows={6}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of how you completed this task (min. 10 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information you'd like to share..."
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional: Add any extra context or comments (max. 500 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  console.log('Submit button clicked')
                  console.log('Form valid:', form.formState.isValid)
                  console.log('Form errors:', form.formState.errors)
                  console.log('Proof type:', proofType)
                  console.log('File:', file)
                }}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Proof
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
