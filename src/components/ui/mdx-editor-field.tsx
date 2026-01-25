'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

interface MDXEditorFormFieldProps {
  name: string
  label?: string
  description?: string
  required?: boolean
  placeholder?: string
  minHeight?: string
}

export function MDXEditorFormField({
  name,
  label,
  description,
  required = false,
  placeholder = 'Start writing in Markdown format...',
  minHeight = '150px',
}: MDXEditorFormFieldProps) {
  const form = useFormContext()
  const error = form.formState.errors[name]?.message as string | undefined

  return (
    <FormItem>
      {label && <FormLabel>{label} {required && <span className="text-destructive">*</span>}</FormLabel>}
      <Textarea
        value={form.watch(name) || ''}
        onChange={(e) => {
          form.setValue(name, e.target.value)
        }}
        placeholder={placeholder}
        className={`resize-none font-mono text-sm ${minHeight === '150px' ? 'min-h-[150px]' : minHeight === '200px' ? 'min-h-[200px]' : 'min-h-[300px]'}`}
      />
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}
