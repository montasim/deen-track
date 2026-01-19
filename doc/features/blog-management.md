# Blog Management

Complete guide to managing the blog system in the admin template.

## Overview

The blog system includes:
- Blog posts with rich content
- Categories for organization
- SEO optimization (meta tags, Open Graph)
- Draft/Published status
- Featured posts support
- Post views tracking
- Flexible content structure

## Database Schema

```prisma
model Blog {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  coverImage  String?
  tags        String[]
  metaTitle   String?
  metaDesc    String?
  isPublished Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  views       Int      @default(0)
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([authorId])
  @@index([isPublished])
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  blogs       Blog[]
}
```

## API Endpoints

### Public Endpoints

```typescript
// Get all published blogs (with pagination)
GET /api/blogs?status=published&page=1&limit=10

// Get blog by slug
GET /api/blogs/{slug}

// Get featured blogs
GET /api/blogs?featured=true

// Get blogs by category
GET /api/blogs?category={categorySlug}

// Get categories
GET /api/categories
```

### Admin Endpoints

```typescript
// Get all blogs (including drafts)
GET /api/admin/blogs

// Create blog
POST /api/admin/blogs
{
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "content": "<p>Blog content...</p>",
  "excerpt": "Short description",
  "coverImage": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "categoryId": "category-id",
  "metaTitle": "SEO Title",
  "metaDesc": "SEO Description",
  "isPublished": true,
  "isFeatured": false
}

// Update blog
PATCH /api/admin/blogs/{id}

// Delete blog
DELETE /api/admin/blogs/{id}

// Toggle featured status
PATCH /api/admin/blogs/{id}/featured

// Toggle publish status
PATCH /api/admin/blogs/{id}/publish
```

## Category Management

```typescript
// Get all categories
GET /api/admin/categories

// Create category
POST /api/admin/categories
{
  "name": "Technology",
  "slug": "technology",
  "description": "Tech-related posts"
}

// Update category
PATCH /api/admin/categories/{id}

// Delete category
DELETE /api/admin/categories/{id}
```

## Dashboard Pages

### Blog List Page
Located at: `/dashboard/blogs`

Features:
- View all blogs with pagination
- Filter by status (published/draft)
- Search by title
- Sort by date, views, title
- Quick actions (edit, delete, toggle featured/published)
- Data table with sortable columns

### Blog Form
Creating or editing a blog post:

```typescript
interface BlogFormData {
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  categoryId?: string
  metaTitle?: string
  metaDesc?: string
  isPublished: boolean
  isFeatured: boolean
}
```

### Category Management
Located at: `/dashboard/categories`

Features:
- Create, edit, delete categories
- View blogs count per category
- Unique slug validation

## Usage Examples

### Creating a Blog Post

```typescript
// Client-side example
async function createBlogPost(data: BlogFormData) {
  const response = await fetch('/api/admin/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (result.success) {
    console.log('Blog created:', result.data.blog)
  }
}
```

### Displaying Blogs on Frontend

```typescript
// app/blogs/page.tsx
async function getBlogs() {
  const response = await fetch('/api/blogs?status=published', {
    cache: 'no-store',
  })
  const result = await response.json()
  return result.data.blogs
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <div>
      {blogs.map((blog) => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
          <Link href={`/blogs/${blog.slug}`}>Read more</Link>
        </article>
      ))}
    </div>
  )
}
```

### Single Blog Post Page

```typescript
// app/blogs/[slug]/page.tsx
async function getBlog(slug: string) {
  const response = await fetch(`/api/blogs/${slug}`)
  const result = await response.json()
  return result.data.blog
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug)

  return (
    <article>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  )
}
```

## Repository Functions

Located at: `src/lib/repositories/blog.repository.ts`

```typescript
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '@/lib/repositories/blog.repository'

// Get blogs with pagination
const { blogs, total } = await getBlogs({
  skip: 0,
  take: 10,
  where: { isPublished: true },
  orderBy: { createdAt: 'desc' }
})

// Get blog by slug
const blog = await getBlogBySlug('my-blog-post')

// Create blog
const newBlog = await createBlog({
  title: 'New Post',
  slug: 'new-post',
  content: 'Content...',
  authorId: 'user-id'
})
```

## Best Practices

1. **URL Slugs**: Always create URL-friendly slugs for blogs and categories
2. **SEO**: Fill in metaTitle and metaDesc for better SEO
3. **Cover Images**: Use optimized images for better performance
4. **Excerpts**: Provide brief excerpts for blog cards
5. **Tags**: Use relevant tags for better content discovery
6. **Categories**: Organize content with clear category structure
7. **Draft Mode**: Use draft status for content under review
8. **Featured Posts**: Feature only the best content

## Features in Detail

### Auto-generated Slugs
When creating a blog, if no slug is provided, it's auto-generated from the title:

```typescript
// "My Awesome Blog Post!" → "my-awesome-blog-post"
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
```

### View Counter
Blog views are tracked automatically:

```typescript
// Increment views when post is viewed
await prisma.blog.update({
  where: { id: blogId },
  data: { views: { increment: 1 } }
})
```

### Featured Posts
Featured posts are displayed prominently on the homepage or blog listing:

```typescript
// Get featured posts
const featuredPosts = await getBlogs({
  where: { isFeatured: true, isPublished: true },
  take: 3
})
```

## Next Steps

- [Customization Guide](../customization.md) - Learn how to customize the blog system
- [Authentication Guide](./authentication.md) - Understand user permissions
- [API Reference](./api-reference.md) - Complete API documentation
