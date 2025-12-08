# Blog Images Folder

**This is where you add all blog post images!**

## Quick Start

1. **Save your image** in this folder (`public/images/blog/`)
2. **Reference it in your blog post** frontmatter:
   ```
   image: /images/blog/your-image-name.jpg
   ```

## Image Requirements

### Featured Images (Thumbnails)
- **Size**: 1200x630px (optimal for social sharing)
- **Format**: JPG, PNG, or WebP
- **File size**: Keep under 500KB
- **Content**: Medical/healthcare related imagery, abstract data visuals, or professional office settings

### In-Post Images
- **Width**: 800-1200px
- **Format**: JPG, PNG, or WebP
- **File size**: Keep under 500KB

## How to Use

### In Blog Post Frontmatter:
```txt
---
title: Your Post Title
date: 2024-12-07
image: /images/blog/your-image.jpg
---
```

### In Blog Post Content:
```html
<img src="/images/blog/in-post-image.jpg" alt="Description" />
```

## Examples

Current example images:
- `orthopedic-documentation.jpg`
- `no-fault-billing.jpg`
- `affidavits-arbitration.jpg`

## Important Notes

- ✅ Path must start with `/images/blog/`
- ✅ Use lowercase and hyphens in filenames
- ✅ If no image is provided, a gradient fallback will display
- ✅ Images are automatically optimized by Next.js

**For detailed instructions, see `BLOG_IMAGES_GUIDE.md` in the root directory.**

