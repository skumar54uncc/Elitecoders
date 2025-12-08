# Blog Images Guide

## Where to Add Blog Images

### Location
Place all blog images in the **`public/images/blog/`** folder.

```
public/
  └── images/
      └── blog/
          ├── your-image-1.jpg
          ├── your-image-2.png
          └── featured-image.jpg
```

## How to Add Images to Blog Posts

### Step 1: Add the Image File

1. **Save your image** to `public/images/blog/` folder
2. **Recommended formats**: JPG, PNG, or WebP
3. **Recommended size**: 
   - Thumbnail/Featured: 1200x630px (optimal for social sharing)
   - In-post images: 800-1200px width
   - File size: Keep under 500KB for fast loading

### Step 2: Reference in Blog Post Frontmatter

In your blog post file (`.txt` or `.md` in `content/blog/`), add the image path in the frontmatter:

```txt
---
title: Your Blog Post Title
date: 2024-12-07
category: Blog
excerpt: Your post description
image: /images/blog/your-image-name.jpg
author: Elite Surgical Coders
tags: coding, billing
---

Your blog post content...
```

### Step 3: Image Path Format

The image path must start with `/images/blog/` and include the filename:

✅ **Correct:**
```
image: /images/blog/orthopedic-coding.jpg
image: /images/blog/no-fault-billing.png
image: /images/blog/affidavits-legal.jpg
```

❌ **Incorrect:**
```
image: images/blog/image.jpg          (missing leading slash)
image: /blog/image.jpg                (wrong path)
image: ../images/blog/image.jpg       (relative paths don't work)
```

## Image Types

### 1. Featured Image / Thumbnail

This is the main image shown on:
- Blog listing page (`/resources`)
- Blog post header
- Social media shares (if Open Graph is configured)

**Add to frontmatter:**
```txt
image: /images/blog/featured-image.jpg
```

### 2. In-Post Images

To add images within the blog post content, you can:

**Option A: Use Markdown syntax** (if you add markdown image support):
```markdown
![Alt text](/images/blog/in-post-image.jpg)
```

**Option B: Use HTML** (works now):
```html
<img src="/images/blog/in-post-image.jpg" alt="Description" />
```

## Example Blog Post with Image

```txt
---
title: Common Documentation Errors That Lead to Denials
date: 2024-12-07
category: Blog
excerpt: Learn about common documentation mistakes in orthopedic surgery.
image: /images/blog/orthopedic-documentation.jpg
author: Elite Surgical Coders
tags: documentation, coding, orthopedic
---

## Introduction

Your content here...

<img src="/images/blog/chart-example.jpg" alt="Documentation error chart" />

More content...
```

## Image Naming Best Practices

1. **Use descriptive names**: 
   - ✅ `orthopedic-documentation-errors.jpg`
   - ❌ `IMG_1234.jpg`

2. **Use lowercase and hyphens**:
   - ✅ `no-fault-billing-guide.jpg`
   - ❌ `No-Fault_Billing Guide.jpg`

3. **Keep names short but descriptive**

## Image Optimization Tips

1. **Compress images** before uploading:
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Aim for < 500KB per image

2. **Use appropriate formats**:
   - JPG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers (best compression)

3. **Resize before uploading**:
   - Featured images: 1200x630px
   - In-post images: 800-1200px width

## Current Image Structure

```
public/
  └── images/
      └── blog/
          ├── README.md (instructions)
          ├── orthopedic-documentation.jpg (example)
          ├── no-fault-billing.jpg (example)
          └── affidavits-arbitration.jpg (example)
```

## Quick Checklist

- [ ] Image saved to `public/images/blog/` folder
- [ ] Image filename is descriptive and uses hyphens
- [ ] Image is optimized (< 500KB)
- [ ] Image path added to frontmatter: `image: /images/blog/filename.jpg`
- [ ] Path starts with `/images/blog/`
- [ ] Test the blog post to see the image

## Troubleshooting

**Image not showing?**
1. Check the file exists in `public/images/blog/`
2. Verify the path in frontmatter matches exactly (case-sensitive)
3. Make sure path starts with `/images/blog/`
4. Check file extension matches (.jpg vs .jpeg)
5. Clear browser cache and reload

**Image too large/slow loading?**
1. Compress the image
2. Resize to recommended dimensions
3. Consider using WebP format

## Example: Adding a New Blog Post with Image

1. **Prepare your image:**
   - Resize to 1200x630px
   - Compress to < 500KB
   - Save as `my-new-post.jpg`

2. **Move image to folder:**
   ```
   public/images/blog/my-new-post.jpg
   ```

3. **Create blog post:**
   ```
   content/blog/my-new-post.txt
   ```

4. **Add frontmatter with image:**
   ```txt
   ---
   title: My New Blog Post
   date: 2024-12-07
   category: Billing
   image: /images/blog/my-new-post.jpg
   ---
   
   Content here...
   ```

5. **Done!** The image will appear automatically on the blog listing and post page.

