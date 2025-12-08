# Project Structure Overview

## Complete File Structure

```
Elite Web/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts              # POST endpoint for contact form
│   ├── about/
│   │   └── page.tsx                  # About Us page
│   ├── careers/
│   │   └── page.tsx                  # Careers page
│   ├── contact/
│   │   └── page.tsx                  # Contact page with form
│   ├── resources/
│   │   └── page.tsx                  # Resources/Blog page
│   ├── results/
│   │   └── page.tsx                  # Results/Case Studies page
│   ├── services/
│   │   └── page.tsx                  # Services page
│   ├── specialties/
│   │   └── page.tsx                  # Who We Serve page
│   ├── globals.css                   # Global Tailwind styles
│   ├── layout.tsx                     # Root layout with metadata
│   ├── page.tsx                      # Home page
│   ├── robots.ts                     # Robots.txt generator
│   └── sitemap.ts                    # Sitemap.xml generator
├── components/
│   ├── CaseStudyCard.tsx             # Reusable case study card
│   ├── ContactForm.tsx                # Contact form component
│   ├── CTASection.tsx                # Call-to-action section
│   ├── Footer.tsx                     # Site footer
│   ├── GoogleAnalytics.tsx           # GA4/GTM integration
│   ├── Header.tsx                     # Site header/navigation
│   ├── HeroSection.tsx                # Hero section component
│   ├── ServiceCard.tsx                # Service card component
│   └── StatsSection.tsx              # Stats section component
├── lib/
│   └── prisma.ts                     # Prisma client singleton
├── prisma/
│   └── schema.prisma                 # Database schema (Lead model)
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── next-env.d.ts                     # Next.js TypeScript definitions
├── package.json                      # Dependencies and scripts
├── postcss.config.js                 # PostCSS configuration
├── PROJECT_STRUCTURE.md              # This file
├── README.md                          # Setup and deployment guide
├── tailwind.config.ts                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## Key Components

### Pages

1. **Home (`app/page.tsx`)**
   - Hero section with primary CTAs
   - Stats section (5 key metrics)
   - Problems We Solve
   - Services Overview (6 service cards)
   - Specialties & Payers
   - How It Works (3-step process)
   - Results/Case Studies preview
   - Trust & Compliance
   - Final CTA

2. **Services (`app/services/page.tsx`)**
   - 7 detailed service descriptions:
     - Surgical & Office Visit Coding
     - Transcription of Operative Reports & Consults
     - Claims Management & Appeals
     - Documentation Audits
     - Physician Education
     - Affidavits & Legal Support
     - Practice Support & Workflow Clean-up

3. **Specialties (`app/specialties/page.tsx`)**
   - Who We Serve sections:
     - Hospitals & Surgery Centers
     - Orthopedic, Spine & Pain Practices
     - Multi-Specialty Groups
     - Law Firms / Legal Teams

4. **Results (`app/results/page.tsx`)**
   - 5 detailed case studies with:
     - Client type
     - Problem
     - Solution
     - Outcome

5. **About (`app/about/page.tsx`)**
   - Our Story
   - Our Team
   - Our Values (3 core values)

6. **Resources (`app/resources/page.tsx`)**
   - 3 placeholder blog articles
   - Ready for CMS integration

7. **Careers (`app/careers/page.tsx`)**
   - Simple page with placeholder for future roles

8. **Contact (`app/contact/page.tsx`)**
   - Contact form (full validation)
   - Contact details (phone, email, address)
   - Map placeholder

### Reusable Components

1. **Header** - Sticky navigation with mobile menu
2. **Footer** - Company info, links, disclaimer
3. **HeroSection** - Flexible hero with CTAs
4. **StatsSection** - 5 stat cards with icons
5. **ServiceCard** - Reusable service card
6. **CaseStudyCard** - Case study display card
7. **CTASection** - Call-to-action section
8. **ContactForm** - Full contact form with validation
9. **GoogleAnalytics** - GA4/GTM integration

### API Routes

- **`/api/contact`** (POST)
  - Validates form input (Zod)
  - Stores lead in database (Prisma)
  - Sends internal notification email
  - Sends auto-reply to prospect

### Database Schema

**Lead Model:**
- id (String, CUID)
- createdAt (DateTime)
- name (String)
- email (String)
- organization (String)
- role (String)
- servicesNeeded (String - JSON array)
- message (String)

## Brand Colors

- **Primary:** #211f50 (deep navy)
- **Accent:** #cfb37a (gold)
- **Background:** White/light gray

## Next Steps

1. Run `npm install` to install dependencies
2. Copy `.env.example` to `.env` and configure
3. Run `npx prisma generate && npx prisma db push`
4. Run `npm run dev` to start development server
5. Test contact form functionality
6. Configure email service credentials
7. Add Google Analytics IDs (optional)
8. Deploy to Vercel/Netlify

