'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Link2, FileText, Image as ImageIcon, Volume2 } from 'lucide-react'

interface SubmissionFormProps {
  taskId: string
  taskName: string
  onSubmit: (data: {
    taskId: string
    campaignId: string
    proofType: string
    file?: File
    url?: string
    text?: string
    notes?: string
  }) => Promise<void>
  onCancel?: () => void
}

export function SubmissionForm({ taskId, taskName, onSubmit, onCancel }: SubmissionFormProps) {
  const [proofType, setProofType] = useState<'IMAGE' | 'AUDIO' | 'URL' | 'TEXT'>('IMAGE')
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        taskId,
        campaignId: '', // Will be filled by parent
        proofType,
        file: file || undefined,
        url: url || undefined,
        text: text || undefined,
        notes: notes || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Proof for: {taskName}</CardTitle>
        <CardDescription>
          Upload your proof to complete this task and earn points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proof Type Selection */}
          <div className="space-y-2">
            <Label>Proof Type *</Label>
            <Tabs value={proofType} onValueChange={(v) => setProofType(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="IMAGE">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="AUDIO">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="URL">
                  <Link2 className="h-4 w-4 mr-1" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="TEXT">
                  <FileText className="h-4 w-4 mr-1" />
                  Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="IMAGE" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {file && (
                      <div className="text-sm text-muted-foreground">
                        {file.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, WebP. Max size: 10MB
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="AUDIO" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio">Upload Audio File *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      required
                    />
                    {file && (
                      <div className="text-sm text-muted-foreground">
                        {file.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, M4A. Max size: 25MB
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="URL" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL Link *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/proof"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL that serves as proof of completion
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="TEXT" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Description *</Label>
                  <Textarea
                    id="text"
                    rows={6}
                    placeholder="Describe how you completed this task..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 10 characters, maximum 1000 characters
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Add any additional context or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Max 500 characters
            </p>
          </div>

          {/* Submit Guidelines */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Submission Guidelines:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Make sure your proof clearly shows task completion</li>
              <li>Include all required information in your submission</li>
              <li>Double-check your submission before submitting</li>
              <li>You'll receive a notification once your proof is reviewed</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Proof'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
