# SlideForge - Commercial Product Architecture

## Product Vision
Transform static presentations into dynamic, animated experiences through an AI-powered web platform. Non-technical users can create stunning animated presentations via chat interface or by uploading existing PowerPoints.

---

## Core Features

### 1. User Management
- **Authentication**: Email/password, Google OAuth, Microsoft SSO
- **User Profiles**: Name, avatar, subscription tier
- **Workspaces**: Personal + Team workspaces (future)

### 2. Project Management
- **Projects**: Container for multiple presentations
- **Presentations**: Individual slide decks with metadata
- **Version History**: Track changes, rollback capability

### 3. Slide Creation & Editing
- **Template Gallery**: Pre-built animated templates by category
  - Business/Corporate
  - Sales & Marketing
  - Technical/Architecture
  - Data Visualization
  - Product Launch
- **AI Chat Interface**: Natural language slide editing
- **Visual Editor**: Drag-and-drop for non-chat users
- **Screenshot Upload**: Paste/upload images for AI to interpret

### 4. PowerPoint Import
- **Upload PPT/PPTX**: Parse and extract content
- **Content Mapping**: Map PPT content to our animation templates
- **Style Suggestions**: AI recommends best animation style per slide
- **Bulk Transform**: Convert entire deck at once

### 5. Export Options
- **Standalone HTML**: Self-contained animated presentation
- **Video Export**: MP4/WebM recording
- **PDF**: Static version with notes
- **Embed Code**: Iframe for websites

---

## Technical Architecture

### Frontend (Next.js)
```
/app
  /auth
    /login
    /register
    /forgot-password
  /dashboard
    /projects
    /templates
    /settings
  /editor/[projectId]
    /slide/[slideId]
  /present/[projectId]
```

### Backend (Node.js + Express)
```
/api
  /auth          - Authentication endpoints
  /users         - User management
  /projects      - Project CRUD
  /presentations - Presentation CRUD
  /slides        - Slide CRUD
  /chat          - Chat history & AI interactions
  /import        - PPT upload & parsing
  /export        - Generate exports
  /templates     - Template management
  /uploads       - File/image uploads
```

### Database Schema (MongoDB)

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: String,
  avatar: String,
  subscription: {
    tier: "free" | "pro" | "enterprise",
    validUntil: Date,
    features: [String]
  },
  createdAt: Date,
  lastLogin: Date
}

// Projects Collection
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  description: String,
  thumbnail: String,
  presentations: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}

// Presentations Collection
{
  _id: ObjectId,
  projectId: ObjectId,
  userId: ObjectId,
  name: String,
  description: String,
  theme: String,
  slides: [{
    id: String,
    order: Number,
    type: String,
    content: Object,
    animation: Object,
    chatHistory: ObjectId  // Reference to ChatHistory
  }],
  settings: {
    autoPlaySpeed: Number,
    transitions: String
  },
  createdAt: Date,
  updatedAt: Date,
  version: Number
}

// ChatHistory Collection (per slide)
{
  _id: ObjectId,
  presentationId: ObjectId,
  slideId: String,
  userId: ObjectId,
  messages: [{
    role: "user" | "assistant",
    content: String,
    timestamp: Date,
    attachments: [{
      type: "image" | "file",
      url: String,
      name: String
    }]
  }],
  createdAt: Date,
  updatedAt: Date
}

// Templates Collection
{
  _id: ObjectId,
  name: String,
  category: String,
  description: String,
  thumbnail: String,
  slides: [Object],
  isPremium: Boolean,
  usageCount: Number
}

// Uploads Collection
{
  _id: ObjectId,
  userId: ObjectId,
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  createdAt: Date
}
```

---

## User Flow

### First-Time User Journey
```
1. Landing Page
   └─> "Get Started Free" button

2. Sign Up
   └─> Email/Google/Microsoft auth

3. Onboarding (3 steps)
   ├─> Step 1: "What do you create presentations for?"
   │   (Business, Education, Marketing, Personal)
   ├─> Step 2: "How would you like to start?"
   │   - Browse Templates
   │   - Upload PowerPoint
   │   - Start from Scratch
   └─> Step 3: Quick tutorial (30 sec video)

4. Dashboard
   └─> Shows recommended templates + "Create New" button

5. Editor
   ├─> Template selected → Chat opens: "I've loaded [template]. What would you like to change?"
   ├─> PPT uploaded → AI shows: "I found X slides. Here's how I'd animate them..."
   └─> Blank → Chat: "Let's create something! Describe your presentation..."
```

### Chat Interface UX
```
┌─────────────────────────────────────────────────────────────┐
│  [Slide Preview]                    │  💬 Chat Assistant   │
│                                     │                       │
│  ┌─────────────────────────────┐   │  🤖 I've set up your  │
│  │                             │   │  title slide. What    │
│  │    [Animated Preview]       │   │  would you like to    │
│  │                             │   │  change?              │
│  │                             │   │                       │
│  └─────────────────────────────┘   │  👤 Make the title    │
│                                     │  bigger and add a     │
│  [◀ Prev] [Slide 1/5] [Next ▶]    │  subtitle about Q4    │
│                                     │                       │
│  ─────────────────────────────     │  🤖 Done! I've:       │
│  [📎 Upload] [📷 Screenshot]       │  • Increased title    │
│                                     │  • Added "Q4 Results" │
│                                     │                       │
│                                     │  [Type message...]    │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Login
POST   /api/auth/logout       - Logout
POST   /api/auth/refresh      - Refresh token
POST   /api/auth/forgot       - Password reset
```

### Projects & Presentations
```
GET    /api/projects                    - List user projects
POST   /api/projects                    - Create project
GET    /api/projects/:id                - Get project
PUT    /api/projects/:id                - Update project
DELETE /api/projects/:id                - Delete project

GET    /api/presentations/:id           - Get presentation
PUT    /api/presentations/:id           - Update presentation
POST   /api/presentations/:id/duplicate - Clone presentation
```

### Slides & Chat
```
GET    /api/slides/:presentationId/:slideId       - Get slide
PUT    /api/slides/:presentationId/:slideId       - Update slide
POST   /api/slides/:presentationId                - Add slide
DELETE /api/slides/:presentationId/:slideId       - Delete slide

GET    /api/chat/:presentationId/:slideId         - Get chat history
POST   /api/chat/:presentationId/:slideId         - Send message (AI processes)
```

### Import & Export
```
POST   /api/import/pptx              - Upload and parse PPT
GET    /api/import/:jobId/status     - Check import progress

POST   /api/export/html/:presentationId   - Generate standalone HTML
POST   /api/export/video/:presentationId  - Generate video
GET    /api/export/:jobId/status          - Check export progress
GET    /api/export/:jobId/download        - Download export
```

### Templates
```
GET    /api/templates                - List templates
GET    /api/templates/:id            - Get template
POST   /api/templates/:id/use        - Create presentation from template
```

---

## Deployment Architecture

### Option A: Simple (Recommended for MVP)
```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js App (Frontend + API)            │    │
│  │                                                      │    │
│  │  /app (pages)     /api (serverless functions)       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│                   (Managed Database)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudinary / AWS S3                             │
│              (File Storage)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Option B: Scalable (Future)
```
┌──────────────────────────────────────────────────────────────────┐
│                         AWS / GCP                                 │
│                                                                   │
│  ┌────────────┐    ┌────────────────┐    ┌──────────────────┐   │
│  │ CloudFront │───▶│  ECS/Cloud Run │───▶│ MongoDB Atlas    │   │
│  │ (CDN)      │    │  (Containers)   │    │ (Database)       │   │
│  └────────────┘    └────────────────┘    └──────────────────┘   │
│                            │                                      │
│                            ▼                                      │
│                    ┌──────────────┐                              │
│                    │ Redis        │ (Session/Cache)              │
│                    └──────────────┘                              │
│                            │                                      │
│                            ▼                                      │
│                    ┌──────────────┐                              │
│                    │ S3 Bucket    │ (File Storage)               │
│                    └──────────────┘                              │
│                            │                                      │
│                            ▼                                      │
│                    ┌──────────────┐                              │
│                    │ SQS/Pub-Sub  │ (Job Queue for exports)      │
│                    └──────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## PPT Import Flow

```
1. User uploads .pptx file
   │
2. Server receives file
   │
3. Parse with `pptxgenjs` or `officegen`
   │
4. Extract:
   ├─> Text content (titles, bullets, paragraphs)
   ├─> Images (save to storage, get URLs)
   ├─> Layout hints (positions, sizes)
   └─> Slide order
   │
5. AI Analysis (per slide):
   ├─> Classify slide type (title, content, chart, etc.)
   ├─> Match to our template types
   └─> Suggest animation style
   │
6. Generate preview
   │
7. User reviews & confirms
   │
8. Create presentation with animated slides
```

---

## Non-Technical User Setup Guide

### Self-Hosted (Docker)

```bash
# 1. Install Docker Desktop
#    Download from: https://docker.com/products/docker-desktop

# 2. Create a folder for SlideForge
mkdir slideforge && cd slideforge

# 3. Download our setup file
curl -O https://slideforge.io/setup/docker-compose.yml

# 4. Start the application
docker-compose up -d

# 5. Open in browser
#    http://localhost:3000
```

### Cloud Hosted (Recommended)
Just sign up at https://slideforge.io - no setup required!

---

## Monetization Model

### Free Tier
- 3 presentations
- 5 slides per presentation
- Basic templates
- Watermarked exports
- Community support

### Pro ($15/month)
- Unlimited presentations
- Unlimited slides
- All templates
- No watermark
- PPT import
- Video export
- Priority support

### Enterprise ($49/month)
- Everything in Pro
- Team collaboration
- Custom branding
- API access
- SSO integration
- Dedicated support

---

## Implementation Phases

### Phase 1: MVP (4-6 weeks)
- [ ] User auth (email + Google)
- [ ] Basic dashboard
- [ ] Template gallery (5 templates)
- [ ] Slide editor with chat
- [ ] Chat history persistence
- [ ] HTML export
- [ ] MongoDB integration

### Phase 2: Enhancement (4 weeks)
- [ ] PPT import
- [ ] Screenshot upload in chat
- [ ] More templates (15+)
- [ ] Video export
- [ ] User settings

### Phase 3: Growth (4 weeks)
- [ ] Team workspaces
- [ ] Collaboration features
- [ ] Custom branding
- [ ] API for integrations
- [ ] Analytics dashboard

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes (or Express.js) |
| Database | MongoDB Atlas |
| Auth | NextAuth.js or Auth0 |
| File Storage | Cloudinary or AWS S3 |
| AI | OpenAI GPT-4 / Claude API |
| PPT Parsing | pptxgenjs, mammoth, officegen |
| Video Export | Puppeteer + FFmpeg |
| Hosting | Vercel (MVP) → AWS/GCP (Scale) |

---

## Next Steps

1. **Set up MongoDB Atlas** - Free tier available
2. **Create Next.js app structure** - `/app` directory with auth
3. **Implement auth** - NextAuth.js with Google provider
4. **Build dashboard** - Projects list + template gallery
5. **Create editor** - Slide preview + chat interface
6. **Integrate AI** - Chat to slide modifications
7. **Add persistence** - Save chat history + slide changes
8. **Export feature** - Generate standalone HTML

Ready to start building?
