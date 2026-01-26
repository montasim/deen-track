'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, FileImage, Mic, Link2, FileText, Sparkles, CheckCircle2, X } from 'lucide-react'
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

const proofTypeConfig = {
  IMAGE: {
    icon: FileImage,
    label: 'Image Upload',
    description: 'Upload a screenshot or photo as proof',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
    accept: 'image/*',
  },
  AUDIO: {
    icon: Mic,
    label: 'Audio Upload',
    description: 'Upload an audio recording as proof',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    accept: 'audio/*',
  },
  URL: {
    icon: Link2,
    label: 'URL Link',
    description: 'Provide a link to your proof (video, post, etc.)',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    accept: '',
  },
  TEXT: {
    icon: FileText,
    label: 'Text Description',
    description: 'Describe how you completed this task',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    accept: '',
  },
}

export function ProofSubmissionDrawer({ open, onOpenChange, task, campaignId, onSubmit }: Props) {
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
  const config = proofTypeConfig[proofType]

  const handleSubmit = async (values: FormValues) => {
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
        description: `Please upload ${values.proofType === 'IMAGE' ? 'an image' : 'an audio'} file`,
      })
      return
    }

    setLoading(true)
    try {
      const result = await onSubmit({
        taskId: task.id,
        campaignId,
        proofType: values.proofType,
        file: file || undefined,
        url: values.url || undefined,
        text: values.text || undefined,
        notes: values.notes || undefined,
      })

      if (result.success) {
        toast({
          title: 'Proof submitted successfully!',
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
      toast({
        variant: 'destructive',
        title: 'Submission failed',
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

  if (!task) return null

  const Icon = config.icon

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border-white/10">
        {/* Animated Header */}
        <div className="relative overflow-hidden mb-6">
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-20 rounded-t-lg`} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

          <SheetHeader className="relative p-6 pb-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-xl font-bold text-white mb-1">
                  Submit Task Proof
                </SheetTitle>
                <SheetDescription className="text-neutral-400 text-sm">
                  Task: <span className="text-white font-medium">{task.name}</span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Proof Type Selection */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 block">
                  How would you like to submit your proof?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(proofTypeConfig) as Array<keyof typeof proofTypeConfig>).map((type) => {
                    const typeConfig = proofTypeConfig[type]
                    const TypeIcon = typeConfig.icon
                    const isSelected = proofType === type

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => form.setValue('proofType', type)}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all duration-300 text-left
                          ${isSelected
                            ? `${typeConfig.border} ${typeConfig.bg} border-current`
                            : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-lg ${isSelected ? `bg-gradient-to-br ${typeConfig.color}` : 'bg-neutral-800'}`}>
                            <TypeIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-xs mb-0.5 ${isSelected ? typeConfig.text : 'text-neutral-300'}`}>
                              {typeConfig.label}
                            </p>
                            <p className="text-xs text-neutral-500 line-clamp-1">
                              {typeConfig.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className={`absolute top-1.5 right-1.5 p-0.5 rounded-full ${typeConfig.bg} ${typeConfig.text}`}>
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* File Upload */}
              {(proofType === 'IMAGE' || proofType === 'AUDIO') && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept={config.accept}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`
                        block w-full p-6 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer
                        ${file
                          ? `${config.border} ${config.bg} border-current`
                          : 'border-white/20 hover:border-white/40 bg-neutral-900/60'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-full mb-2 ${file ? `bg-gradient-to-br ${config.color}` : 'bg-neutral-800'}`}>
                          <Upload className={`w-6 h-6 ${file ? 'text-white' : 'text-neutral-500'}`} />
                        </div>
                        {file ? (
                          <div>
                            <p className={`font-semibold text-sm text-white mb-1 ${config.text}`}>{file.name}</p>
                            <p className="text-xs text-neutral-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-white font-semibold mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-neutral-500">
                              {proofType === 'IMAGE' ? 'JPG, PNG, GIF up to 10MB' : 'MP3, WAV, M4A up to 20MB'}
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setFile(null)
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* URL Input */}
              {proofType === 'URL' && (
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        URL Link *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          className="bg-neutral-900/60 border-white/20 text-white placeholder:text-neutral-500 focus:border-cyan-500/50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-neutral-500">
                        Provide a link to your proof (YouTube, blog post, social media, etc.)
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
                      <FormLabel className="text-white font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe in detail how you completed this task..."
                          rows={6}
                          className="resize-none bg-neutral-900/60 border-white/20 text-white placeholder:text-neutral-500 focus:border-cyan-500/50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-neutral-500">
                        Provide a detailed description (minimum 10 characters)
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
                    <FormLabel className="text-white font-semibold">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information you'd like to share..."
                        rows={3}
                        className="resize-none bg-neutral-900/60 border-white/20 text-white placeholder:text-neutral-500 focus:border-cyan-500/50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-neutral-500">
                      Optional: Add any extra context or comments (max. 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/5"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r ${config.color} text-white font-semibold shadow-lg hover:opacity-90 transition-opacity`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Submit Proof
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
