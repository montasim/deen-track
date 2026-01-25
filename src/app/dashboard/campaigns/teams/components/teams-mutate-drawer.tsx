'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { createTeam } from '../../../gamified-campaigns/actions'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50, 'Team name must be less than 50 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  maxMembers: z.coerce.number().int().min(1, 'Must have at least 1 member').max(100, 'Cannot exceed 100 members').optional(),
})

type TeamsForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TeamsMutateDrawer({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TeamsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      maxMembers: undefined,
    },
    mode: 'onChange',
  })

  async function onSubmit(values: TeamsForm) {
    setIsSubmitting(true)
    try {
      const result = await createTeam({
        name: values.name,
        description: values.description || undefined,
        maxMembers: values.maxMembers || undefined,
      })

      if (result.success) {
        toast({
          title: 'Team created',
          description: 'Your team has been created successfully. You are the captain.',
        })
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to create team',
        })
      }
    } catch (error) {
      console.error('Error creating team:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>Create Team</SheetTitle>
          <SheetDescription>
            Create a new team to compete in campaigns with your friends. You will be the team captain.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., The Champions, Dream Team"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a unique name for your team (3-50 characters)
                  </FormDescription>
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
                      rows={3}
                      placeholder="Tell others about your team..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your team's goals or vibe
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Members</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Leave empty for unlimited"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Set a limit on team size (1-100 members)
                  </FormDescription>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Team
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
