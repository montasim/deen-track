'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { getProxiedImageUrl } from "@/lib/image-proxy"
import { formatDate } from "@/lib/utils/format-date"

interface BlogComment {
  id: string
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    firstName: string
    lastName: string | null
    avatar: string | null
  }
  parentId: string | null
  parent?: {
    author: {
      name: string
      firstName: string
      lastName: string | null
    }
  }
  replies?: BlogComment[]
}

interface BlogCommentsSectionProps {
  postId: string
  postSlug: string
}

export function BlogCommentsSection({ postId, postSlug }: BlogCommentsSectionProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyToName, setReplyToName] = useState<string>("")

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      router.push(`/auth/sign-in?redirect=/blog/${postSlug}`)
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          parentId: replyTo,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit comment')

      setNewComment("")
      setReplyTo(null)
      setReplyToName("")
      await fetchComments()
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderComment = (comment: BlogComment, depth = 0) => {
    const canReply = user && depth < 2 // Limit nesting to 2 levels

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                {comment.author.avatar ? (
                  <AvatarImage src={getProxiedImageUrl(comment.author.avatar) || comment.author.avatar} />
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    {comment.author.name?.[0] || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{comment.author.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          </div>

          {canReply && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setReplyTo(comment.id)
                setReplyToName(comment.author.name)
              }}
            >
              Reply
            </Button>
          )}

          {replyTo === comment.id && (
            <div className="space-y-2 ml-auto max-w-md">
              <Textarea
                placeholder={`Replying to ${comment.author.name}...`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyTo(null)
                    setNewComment("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Please sign in to comment on this post.
              </p>
              <Button onClick={() => router.push(`/auth/sign-in?redirect=/blog/${postSlug}`)}>
                Sign In to Comment
              </Button>
            </div>
          ) : (
            <>
              <Textarea
                placeholder={replyToName ? `Replying to ${replyToName}...` : "Share your thoughts..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <div className="flex items-center justify-between">
                {replyTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null)
                      setReplyToName("")
                      setNewComment("")
                    }}
                  >
                    Cancel Reply
                  </Button>
                )}
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-2">No comments yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}
