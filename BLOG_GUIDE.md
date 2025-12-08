# Blog System Guide

## How to Add Blog Posts

The website now supports a simple file-based blog system. Just add `.txt` or `.md` files to the `content/blog/` folder and they'll automatically appear on the website!

## Quick Start

1. **Create a new file** in `content/blog/` folder
   - Name it something descriptive like `ny-no-fault-billing-guide.txt`
   - The filename (without extension) becomes the URL slug

2. **Add frontmatter** at the top of the file:
   ```
   ---
   title: Your Blog Post Title
   date: 2024-12-07
   category: Billing
   excerpt: A brief description (optional)
   image: /images/blog/your-image.jpg
   author: Elite Surgical Coders
   tags: coding, billing, new york
   ---
   ```

3. **Write your content** below the frontmatter:
   ```
   Your blog post content goes here.
   
   You can use simple markdown:
   - Bullet points
   - **Bold text**
   - *Italic text*
   
   ## Headers
   
   ### Subheaders
   ```

4. **Save the file** - That's it! The post will automatically appear on `/resources`

## Required Fields

- `title`: The blog post title
- `date`: Publication date in YYYY-MM-DD format

## Optional Fields

- `excerpt`: Short description (auto-generated from first paragraph if not provided)
- `category`: Category name (defaults to "General")
- `image`: Path to featured image (e.g., `/images/blog/my-image.jpg`)
- `author`: Author name (defaults to "Elite Surgical Coders")
- `tags`: Comma-separated list of tags

## Example Blog Post

See `content/blog/example-post.txt` for a complete example.

## Supported Markdown

- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Lists: `- item` or `1. item`
- Paragraphs: Separate with blank lines

## Images

Add images to `public/images/blog/` and reference them in the frontmatter:
```
image: /images/blog/my-featured-image.jpg
```

## SEO Benefits

- Each blog post automatically gets:
  - SEO-optimized meta tags
  - Structured data (JSON-LD)
  - Sitemap inclusion
  - Open Graph tags for social sharing
  - Individual URL: `/resources/[slug]`

## Tips

1. **Use descriptive filenames**: They become URLs (e.g., `ny-no-fault-billing.txt` → `/resources/ny-no-fault-billing`)
2. **Add tags**: Helps with SEO and categorization
3. **Include images**: Makes posts more engaging and shareable
4. **Write good excerpts**: First 200 characters are used if excerpt not provided
5. **Use categories**: Helps organize content (e.g., "Documentation", "Billing", "Legal Support")

## File Format Example

```
---
title: What NY Surgeons Should Know About No-Fault Billing
date: 2024-12-07
category: Billing
excerpt: A comprehensive guide to navigating New York's No-Fault insurance requirements
image: /images/blog/no-fault-billing.jpg
author: Elite Surgical Coders
tags: no-fault, billing, new york, insurance
---

## Introduction

New York's No-Fault insurance system has unique requirements...

[Rest of your content]
```

That's it! Just save the file and it will appear on your website automatically.

