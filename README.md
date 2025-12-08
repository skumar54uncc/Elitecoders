# Elite Surgical Coders - Marketing Website

Production-ready marketing website for Elite Surgical Coders and Medical Billing LLC, built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion (minimal, clean animations)
- **Database:** Prisma + SQLite (easily switchable to Postgres)
- **Email:** Nodemailer (configurable for SendGrid/Mailgun)
- **Analytics:** Google Analytics 4 & Google Tag Manager support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and configure:
   - Database URL (SQLite by default)
   - Email service credentials (SMTP or SendGrid)
   - Internal notification email
   - Google Analytics/GTM IDs (optional)
   - Contact information (phone, email, address)

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database
```
DATABASE_URL="file:./dev.db"
```

### Email Configuration

**Option 1: SMTP (Gmail, Outlook, etc.)**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

**Option 2: SendGrid** (uncomment and configure in `app/api/contact/route.ts`)
```
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@domain.com
```

### Internal Notifications
```
INTERNAL_NOTIFICATION_EMAIL=notifications@elitesurgicalcoders.com
```

### Analytics (Optional)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Contact Information
```
NEXT_PUBLIC_PHONE=+1-555-123-4567
NEXT_PUBLIC_EMAIL=info@elitesurgicalcoders.com
NEXT_PUBLIC_ADDRESS=80-02 Kew Gardens Road, Kew Gardens, NY 11415
```

### Google Maps (Optional)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```
**Note:** The map will work without an API key using the basic embed, but for better features and 3D view, you can add a Google Maps API key. Get one from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis).

### Site URL (for sitemap)
```
NEXT_PUBLIC_SITE_URL=https://www.elitesurgicalcoders.com
```

## Database Management

### View Leads in Database

Use Prisma Studio to view and manage leads:
```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view all submitted contact forms.

### Switch to Postgres

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/elite_surgical_coders"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure environment variables:**
   - Add all environment variables from your `.env` file in Vercel's project settings
   - Go to Settings → Environment Variables

4. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Or click "Deploy" to deploy immediately

5. **Connect your domain:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS instructions:
     - Add a CNAME record pointing to `cname.vercel-dns.com`
     - Or add an A record with Vercel's IP addresses

### Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment variables:**
   - Add all environment variables in Netlify's site settings

3. **Connect domain:**
   - Go to Domain settings
   - Add custom domain
   - Follow DNS instructions

## Google Search Console Setup

1. **Add your site to Google Search Console:**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add property → URL prefix
   - Enter your website URL

2. **Verify ownership:**
   - Choose HTML tag method
   - Add the meta tag to `app/layout.tsx` in the `<head>` section
   - Or use DNS verification

3. **Submit sitemap:**
   - Once verified, go to Sitemaps
   - Submit: `https://www.elitesurgicalcoders.com/sitemap.xml`

## Project Structure

```
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API endpoint
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── careers/
│   │   └── page.tsx              # Careers page
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   ├── resources/
│   │   └── page.tsx              # Resources/Blog page
│   ├── results/
│   │   └── page.tsx              # Results/Case Studies page
│   ├── services/
│   │   └── page.tsx              # Services page
│   ├── specialties/
│   │   └── page.tsx              # Specialties/Who We Serve page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # Robots.txt
│   └── sitemap.ts                # Sitemap.xml
├── components/
│   ├── CaseStudyCard.tsx         # Case study card component
│   ├── ContactForm.tsx           # Contact form component
│   ├── CTASection.tsx            # Call-to-action section
│   ├── Footer.tsx                # Footer component
│   ├── GoogleAnalytics.tsx       # GA/GTM integration
│   ├── Header.tsx                # Header/Navigation
│   ├── HeroSection.tsx           # Hero section component
│   ├── ServiceCard.tsx           # Service card component
│   └── StatsSection.tsx          # Stats section component
├── prisma/
│   └── schema.prisma             # Prisma schema
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Features

- ✅ Fully responsive, mobile-first design
- ✅ Accessible (WCAG compliant)
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Contact form with database storage
- ✅ Email notifications (internal + auto-reply)
- ✅ Google Analytics 4 & GTM support
- ✅ Professional medical/legal design
- ✅ Brand colors: Deep Navy (#211f50) & Gold (#cfb37a)

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set in production
- [ ] Email service is configured and tested
- [ ] Contact form is tested in production
- [ ] Google Analytics/GTM IDs are configured
- [ ] Sitemap is submitted to Google Search Console
- [ ] Domain is connected and SSL is active
- [ ] Database is backed up (if using Postgres)
- [ ] All phone numbers and contact info are correct
- [ ] PHI disclaimer is visible on contact form

## Support

For questions or issues, please contact the development team.

## License

© 2024 Elite Surgical Coders and Medical Billing LLC. All rights reserved.

