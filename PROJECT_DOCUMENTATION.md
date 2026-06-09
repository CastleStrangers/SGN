# Syrian Community in the Netherlands Platform (SY-NL)
## Comprehensive Technical Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Goals and Objectives](#project-goals-and-objectives)
3. [Technology Stack](#technology-stack)
4. [Architecture and Structure](#architecture-and-structure)
5. [Database Schema](#database-schema)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend API Architecture](#backend-api-architecture)
8. [Mobile Application](#mobile-application)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Authentication and Authorization](#authentication-and-authorization)
11. [AI Integration](#ai-integration)
12. [Social Media Integration](#social-media-integration)
13. [Deployment and Infrastructure](#deployment-and-infrastructure)
14. [Features and Functionality](#features-and-functionality)
15. [Development Workflow](#development-workflow)
16. [Security Considerations](#security-considerations)
17. [Performance Optimization](#performance-optimization)
18. [Testing and Quality Assurance](#testing-and-quality-assurance)
19. [Future Roadmap](#future-roadmap)

---

## Project Overview

The Syrian Community in the Netherlands Platform (SY-NL) is a comprehensive digital platform designed to serve the Syrian community living in the Netherlands. It serves as a central hub for news, events, community services, member management, and interactive features that connect Syrian diaspora members.

**Project Name**: sy-nl-platform  
**Version**: 0.1.0  
**Primary Domain**: https://sy-nl.org  
**Development Status**: Production-ready

### Key Characteristics

- **Multi-platform**: Web application and mobile app (iOS/Android)
- **Multi-language**: Arabic (primary), English, Dutch
- **Community-focused**: News, events, member directory, volunteer coordination
- **AI-powered**: Chatbot, content analysis, translation services
- **Social integration**: Facebook page synchronization, WhatsApp integration
- **Member management**: Registration, profiles, membership cards, activity tracking

---

## Project Goals and Objectives

### Primary Goals

1. **Community Connection**: Provide a digital space for Syrian community members in the Netherlands to connect, share information, and stay updated with community news.

2. **Information Dissemination**: Serve as a reliable source of news about the Syrian community, Netherlands-related news, European affairs, economic updates, and cultural content.

3. **Member Management**: Maintain a comprehensive database of community members with detailed profiles, skills, and contact information for better community coordination.

4. **Event Coordination**: Facilitate organization and promotion of community events, cultural activities, and volunteer opportunities.

5. **Service Delivery**: Provide digital services such as membership cards, volunteer registration, donation management, and communication channels.

### Secondary Objectives

- **Cultural Preservation**: Promote Syrian culture and heritage within the Netherlands context
- **Integration Support**: Help Syrian community members integrate into Dutch society
- **Resource Sharing**: Enable members to share skills, experiences, and opportunities
- **Transparency**: Provide transparent communication about community activities and decisions
- **Accessibility**: Ensure platform is accessible to all community members regardless of technical proficiency

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.6 | Full-stack React framework with SSR/SSG |
| React | 19.0.0 | UI library |
| TypeScript | 5.x | Type safety and developer experience |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Radix UI | Latest | Accessible UI component primitives |
| Lucide React | 0.525.0 | Icon library |
| TipTap | 3.25.0 | Rich text editor |
| Recharts | 3.8.1 | Data visualization charts |
| next-intl | 4.3.4 | Internationalization |
| next-themes | 0.4.6 | Theme management (dark/light mode) |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.2.6 | Serverless API endpoints |
| Prisma | 6.11.1 | ORM for database operations |
| SQLite | Latest | Local development database |
| LibSQL (Turso) | Latest | Production database (edge SQLite) |
| NextAuth | 4.24.14 | Authentication solution |
| bcryptjs | 3.0.3 | Password hashing |
| Zod | 4.0.2 | Schema validation |

### AI and Machine Learning

| Technology | Version | Purpose |
|------------|---------|---------|
| OpenAI SDK | 4.100.0 | GPT API integration |
| Ollama | Latest | Local AI model hosting (qwen2.5:7b) |
| RAG System | Custom | Retrieval Augmented Generation for context-aware responses |

### Mobile Application

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | 52.0.0 | React Native development platform |
| React Native | 0.76.6 | Mobile app framework |
| Expo Router | 4.0.0 | File-based routing for mobile |
| Expo Notifications | 0.29.0 | Push notification system |
| NativeWind | 4.1.0 | Tailwind CSS for React Native |
| AsyncStorage | 1.23.1 | Local data persistence |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.x | Code linting |
| Vitest | 4.1.8 | Unit testing |
| Playwright | 1.60.0 | End-to-end testing |
| PM2 | Latest | Process management for production |
| Docker | Latest | Containerization |

---

## Architecture and Structure

### Project Structure Overview

```
SGN/
├── src/                          # Web application source
│   ├── app/                      # Next.js app directory
│   │   ├── [locale]/            # Internationalized routes
│   │   │   ├── about/           # About page
│   │   │   ├── contact/         # Contact form
│   │   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── donate/          # Donation page
│   │   │   ├── events/          # Events listing
│   │   │   ├── gallery/         # Photo gallery
│   │   │   ├── join/            # Membership registration
│   │   │   ├── login/           # Login page
│   │   │   ├── member/          # Member profiles
│   │   │   ├── members/         # Members directory
│   │   │   ├── messages/        # Chat/messaging
│   │   │   ├── news/            # News articles
│   │   │   ├── profile/         # User profile
│   │   │   ├── signup/          # Registration
│   │   │   ├── tasks/           # Task management
│   │   │   └── volunteer/       # Volunteer registration
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── ai/              # AI services
│   │   │   ├── chat/            # Chat/messaging
│   │   │   ├── comments/        # Comment system
│   │   │   ├── contact/         # Contact form handling
│   │   │   ├── dashboard/       # Dashboard data
│   │   │   ├── donate/          # Donation processing
│   │   │   ├── events/          # Events management
│   │   │   ├── member/          # Member operations
│   │   │   ├── members/         # Members directory
│   │   │   ├── mobile/          # Mobile-specific endpoints
│   │   │   ├── news/            # News content
│   │   │   ├── notifications/    # Push notifications
│   │   │   ├── roles/           # Role management
│   │   │   ├── settings/        # App settings
│   │   │   ├── stats/           # Statistics
│   │   │   ├── subscribe/       # Newsletter subscription
│   │   │   ├── surveys/         # Survey system
│   │   │   ├── sync/            # Social media sync
│   │   │   ├── tasks/           # Task management
│   │   │   ├── upload/          # File uploads
│   │   │   ├── user/            # User operations
│   │   │   └── volunteer/       # Volunteer management
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── manifest.ts          # PWA manifest
│   ├── components/              # React components
│   │   ├── home/                # Homepage components
│   │   │   ├── breaking-news.tsx
│   │   │   ├── category-grid.tsx
│   │   │   ├── featured-list.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── latest-videos.tsx
│   │   │   ├── more-news.tsx
│   │   │   ├── newsletter.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── top-bar.tsx
│   │   ├── membership/          # Membership components
│   │   ├── ads.tsx              # Advertisement display
│   │   ├── article-actions.tsx  # Article interaction
│   │   ├── auth-provider.tsx    # Authentication context
│   │   ├── comment-section.tsx  # Comment system
│   │   ├── community-stats.tsx  # Statistics display
│   │   ├── language-switcher.tsx # Language toggle
│   │   ├── notification-bell.tsx # Notification indicator
│   │   ├── notification-toaster.tsx # Toast notifications
│   │   ├── pwa-register.tsx     # PWA registration
│   │   ├── rich-text-editor.tsx # Content editor
│   │   ├── survey.tsx           # Survey component
│   │   ├── theme-provider.tsx   # Theme context
│   │   ├── theme-toggle.tsx     # Theme switcher
│   │   └── tiktok-icon.tsx      # Social media icon
│   ├── i18n/                    # Internationalization
│   │   ├── request.ts           # i18n request configuration
│   │   └── routing.ts           # Locale routing
│   ├── lib/                     # Utility libraries
│   │   ├── ai/                  # AI services
│   │   │   ├── chat.ts          # Chat AI integration
│   │   │   ├── client.ts        # AI client setup
│   │   │   ├── gemini.ts        # Google Gemini integration
│   │   │   ├── ollama.ts        # Ollama local AI
│   │   │   ├── rag.ts           # RAG implementation
│   │   │   ├── tasks.ts         # AI task assistance
│   │   │   └── text.ts          # Text processing AI
│   │   ├── sync/                # Social media sync
│   │   ├── activity.ts          # Activity logging
│   │   ├── api-messages.ts      # API i18n messages
│   │   ├── auth-helpers.ts      # Authentication helpers
│   │   ├── auth.ts              # Authentication configuration
│   │   ├── db.ts                # Prisma client
│   │   ├── email.ts             # Email services
│   │   ├── image-fallback.ts    # Image handling
│   │   ├── permissions.ts       # Permission management
│   │   ├── telegram.ts          # Telegram integration
│   │   ├── validations.ts       # Input validation
│   │   └── whatsapp.ts          # WhatsApp integration
│   ├── middleware.ts            # Next.js middleware
│   └── types.d.ts               # TypeScript definitions
├── mobile/                      # Mobile application
│   ├── app/                     # Expo Router screens
│   │   ├── (tabs)/             # Tab navigation
│   │   ├── login.tsx           # Login screen
│   │   ├── register.tsx        # Registration screen
│   │   ├── news/               # News screens
│   │   ├── _layout.tsx         # Root layout
│   │   └── +1 files
│   ├── constants/               # Mobile constants
│   │   ├── api.ts              # API configuration
│   │   ├── colors.ts           # Color scheme
│   │   └── config.ts           # App configuration
│   ├── i18n/                    # Mobile i18n
│   │   ├── ar.json             # Arabic translations
│   │   ├── en.json             # English translations
│   │   └── nl.json             # Dutch translations
│   ├── lib/                     # Mobile utilities
│   │   ├── api.ts              # API client
│   │   ├── chat.ts             # Chat functions
│   │   └── i18n-context.tsx    # i18n context
│   ├── app.json                 # Expo configuration
│   ├── package.json             # Mobile dependencies
│   └── tsconfig.json            # TypeScript config
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── seed.cjs                # Database seeding
│   ├── seed.ts                 # TypeScript seed script
│   └── seed-landing.ts         # Landing page seeding
├── public/                      # Static assets
│   ├── uploads/                # User uploads
│   │   └── sync/               # Synced media
│   ├── icon.svg                # App icon
│   ├── logo.png                # Logo
│   └── +2 files
├── scripts/                     # Utility scripts
│   ├── alter-turso.cjs         # Turso database operations
│   ├── check-all-posts.ts      # Post validation
│   ├── check-arabic.ts         # Arabic text validation
│   ├── check-db.ts             # Database checks
│   ├── import-facebook.ts      # Facebook import
│   └── +15 files
├── messages/                    # Web i18n messages
│   ├── ar.json                 # Arabic translations
│   ├── en.json                 # English translations
│   └── nl.json                 # Dutch translations
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── AGENTS.md                   # AI agent guidelines
├── PROJECT_MAP.md              # Project mapping
├── Dockerfile                  # Docker configuration
├── ecosystem.config.js         # PM2 configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript configuration
└── vitest.config.ts            # Vitest configuration
```

### Architecture Patterns

**Monorepo Structure**: The project uses a monorepo approach with separate web and mobile applications sharing the same API and database.

**API-First Design**: All features are built with API endpoints that serve both web and mobile applications.

**Component-Based Architecture**: React components are organized by feature and reusability.

**Service Layer Pattern**: Business logic is separated into service layers (AI, sync, email, etc.) for better maintainability.

---

## Database Schema

### Database Technology

- **Development**: SQLite (local file-based database)
- **Production**: Turso (LibSQL) - Edge-hosted SQLite
- **ORM**: Prisma 6.11.1

### Core Data Models

#### User Management

**User Model**
- `id`: Primary key (CUID)
- `name`: User's full name
- `email`: Unique email address
- `emailVerified`: Email verification timestamp
- `image`: Profile image URL
- `password`: Hashed password (bcrypt)
- `role`: User role (member, admin, etc.)
- `roleId`: Foreign key to Role
- `bio`: User biography
- `phone`: Phone number
- `location`: Geographic location
- `website`: Personal website
- `createdAt`: Account creation timestamp
- Relations: Account[], Session[], Post[], Favorite[], PushToken[], UserPermission[], Member[]

**Account Model** (NextAuth OAuth)
- `id`: Primary key
- `userId`: Foreign key to User
- `type`: OAuth provider type
- `provider`: Provider name (google, facebook, etc.)
- `providerAccountId`: Provider's user ID
- `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`: OAuth tokens

**Session Model** (NextAuth)
- `id`: Primary key
- `sessionToken`: Unique session identifier
- `userId`: Foreign key to User
- `expires`: Session expiration

**Role Model**
- `id`: Primary key
- `name`: Unique role name
- `description`: Role description
- `permissions`: JSON array of permissions
- `isSystem`: System role flag
- Relations: User[]

**UserPermission Model**
- `id`: Primary key
- `userId`: Foreign key to User
- `permission`: Permission string
- `granted`: Boolean flag

#### Content Management

**Post Model** (News Articles)
- `id`: Primary key
- `title`: Article title
- `slug`: URL-friendly identifier (unique)
- `content`: Full article content (rich text)
- `excerpt`: Article summary
- `image`: Featured image URL
- `videoId`: YouTube video ID
- `category`: Article category
- `tags`: Comma-separated tags
- `source`: Content source
- `featured`: Featured article flag
- `views`: View count
- `published`: Publication status
- `authorId`: Foreign key to User
- `createdAt`, `updatedAt`: Timestamps
- Relations: Comment[], Favorite[]
- Indexes: [published, createdAt], [category, published, createdAt], [source, published], [featured, published]

**Comment Model**
- `id`: Primary key
- `postId`: Foreign key to Post
- `author`: Author name
- `content`: Comment text
- `userId`: Foreign key to User (optional)
- `parentId`: Self-reference for replies
- `likes`: Like count
- `approved`: Moderation status
- `createdAt`: Timestamp
- Relations: Post, Comment[] (replies)

#### Community Management

**Member Model**
- `id`: Primary key
- `memberNumber`: Unique membership number
- `nameAr`: Name in Arabic
- `nameNl`: Name in Dutch
- `birthYear`: Birth year
- `gender`: Gender
- `originCity`: City of origin in Syria
- `whatsapp`: WhatsApp number
- `email`: Email address
- `avatar`: Profile image
- `nlProvincie`: Dutch province
- `nlCity`: Dutch city
- `expNl`: Experience in Netherlands
- `expOutside`: Experience outside Netherlands
- `educationLevel`: Education level
- `profession`: Profession
- `skills`: Skills
- `maritalStatus`: Marital status
- `agreed`: Agreement consent
- `status`: Membership status
- `notes`: Admin notes
- `showInPublicProfile`: Privacy setting
- `userId`: Foreign key to User (optional)
- `createdAt`: Registration timestamp

**Event Model**
- `id`: Primary key
- `title`: Event title
- `description`: Event description
- `date`: Event date
- `location`: Event location
- `image`: Event image
- `category`: Event category
- `published`: Publication status
- `createdAt`, `updatedAt`: Timestamps

**Volunteer Model**
- `id`: Primary key
- `name`: Volunteer name
- `email`: Email address
- `phone`: Phone number
- `skills`: Skills and expertise
- `availability`: Availability
- `message`: Additional message
- `createdAt`: Registration timestamp

#### Communication

**ChatMessage Model**
- `id`: Primary key
- `senderId`: Sender user ID
- `receiverId`: Receiver user ID
- `message`: Message content
- `read`: Read status
- `createdAt`: Timestamp
- Indexes: [senderId, receiverId], [receiverId, read]

**ChatAISession Model**
- `id`: Primary key
- `userId`: User ID
- `createdAt`, `updatedAt`: Timestamps
- Relations: ChatAIMessage[]
- Index: [userId]

**ChatAIMessage Model**
- `id`: Primary key
- `sessionId`: Foreign key to ChatAISession
- `role`: Role (user/assistant)
- `content`: Message content
- `createdAt`: Timestamp
- Index: [sessionId, createdAt]

**Notification Model**
- `id`: Primary key
- `userId`: User ID
- `title`: Notification title
- `message`: Notification message
- `link`: Action link
- `read`: Read status
- `createdAt`: Timestamp

#### AI and Features

**Survey Model**
- `id`: Primary key
- `title`: Survey title
- `description`: Survey description
- `startDate`, `endDate`: Survey period
- `active`: Active status
- `createdAt`, `updatedAt`: Timestamps
- Relations: SurveyOption[], SurveyVote[]

**SurveyOption Model**
- `id`: Primary key
- `surveyId`: Foreign key to Survey
- `text`: Option text
- `votes`: Vote count

**SurveyVote Model**
- `id`: Primary key
- `surveyId`: Foreign key to Survey
- `optionId`: Foreign key to SurveyOption
- `userId`: User ID
- `createdAt`: Timestamp
- Unique constraint: [surveyId, userId]

**Task Model**
- `id`: Primary key
- `title`: Task title
- `description`: Task description
- `status`: Task status
- `priority`: Task priority
- `assignedTo`: Assignee ID
- `createdBy`: Creator ID
- `dueDate`: Due date
- `createdAt`, `updatedAt`: Timestamps

**Donation Model**
- `id`: Primary key
- `memberId`: Foreign key to Member (optional)
- `name`: Donor name
- `email`: Donor email
- `phone`: Donor phone
- `amount`: Donation amount
- `currency`: Currency (default: EUR)
- `message`: Donor message
- `paymentMethod`: Payment method
- `status`: Payment status
- `paidAt`: Payment timestamp
- `createdAt`, `updatedAt`: Timestamps

#### System

**AppSetting Model**
- `key`: Setting key (primary)
- `value`: Setting value

**ActivityLog Model**
- `id`: Primary key
- `memberId`: Member ID
- `action`: Action description
- `details`: Additional details
- `userId`: User ID (optional)
- `createdAt`: Timestamp

**PasswordResetToken Model**
- `id`: Primary key
- `email`: Email address
- `token`: Reset token (unique)
- `expires`: Expiration timestamp
- `used`: Used flag
- `createdAt`: Timestamp

**OtpCode Model**
- `id`: Primary key
- `identifier`: User identifier (email/phone)
- `code`: OTP code
- `expiresAt`: Expiration timestamp
- `used`: Used flag
- `createdAt`: Timestamp
- Index: [identifier, code]

**Ad Model**
- `id`: Primary key
- `title`: Ad title
- `image`: Ad image
- `link`: Destination link
- `position`: Ad position (sidebar, banner)
- `startDate`, `endDate`: Display period
- `clicks`: Click count
- `active`: Active status
- `createdAt`, `updatedAt`: Timestamps

**Favorite Model**
- `id`: Primary key
- `userId`: User ID
- `postId`: Post ID
- `createdAt`: Timestamp
- Unique constraint: [userId, postId]

**PushToken Model**
- `id`: Primary key
- `userId`: User ID
- `token`: Push notification token (unique)
- `createdAt`, `updatedAt`: Timestamps

**Contact Model**
- `id`: Primary key
- `name`: Contact name
- `email`: Contact email
- `subject`: Message subject
- `message`: Message content
- `read`: Read status
- `createdAt`: Timestamp

**Subscriber Model**
- `id`: Primary key
- `email`: Email address (unique)
- `createdAt`: Timestamp

**LandingPage Model**
- `id`: Primary key
- `title`: Page title
- `slug`: URL slug (unique)
- `subtitle`: Page subtitle
- `heroImage`: Hero section image
- `heroHeadline`: Hero headline
- `heroSubheadline`: Hero subheadline
- `content`: Page content
- `ctaText`: Call-to-action text
- `ctaLink`: Call-to-action link
- `features`: Features section
- `themeColor`: Theme color
- `metaTitle`: SEO title
- `metaDescription`: SEO description
- `published`: Publication status
- `createdAt`, `updatedAt`: Timestamps

---

## Frontend Architecture

### Component Architecture

The frontend follows a component-based architecture with clear separation of concerns:

**Layout Components**
- `RootLayout`: Main application wrapper with theme and auth providers
- `SiteHeader`: Navigation header with language switcher and user menu
- `SiteFooter`: Footer with links and information
- `TopBar`: Top information bar

**Feature Components**
- `BreakingNews`: Ticker for urgent news
- `HeroSection`: Featured content display
- `CategoryGrid`: News category navigation
- `FeaturedList`: Featured articles list
- `Sidebar`: Sidebar with latest news and ads
- `CommentSection`: Comment system for articles
- `RichTextEditor`: Content creation interface
- `Survey`: Survey display and interaction

**UI Components**
- `LanguageSwitcher`: Language toggle (AR/EN/NL)
- `ThemeToggle`: Dark/light mode switcher
- `NotificationBell`: Notification indicator
- `NotificationToaster`: Toast notifications
- `Ads`: Advertisement display

### State Management

**Client State**
- React hooks (useState, useEffect, useContext)
- NextAuth session management
- Custom context providers (Theme, Auth, i18n)

**Server State**
- Server components for data fetching
- API routes for backend communication
- Prisma for database operations

### Styling Strategy

**Tailwind CSS**
- Utility-first CSS framework
- Custom theme configuration
- Responsive design with mobile-first approach
- RTL support for Arabic

**Custom CSS**
- Global styles in `globals.css`
- Animation utilities
- Custom components styling

### Routing Architecture

**Next.js App Router**
- File-based routing in `app/` directory
- Internationalized routes with `[locale]` parameter
- Dynamic routes for content (`[slug]`)
- API routes in `app/api/`

**Navigation**
- `next-intl` for i18n-aware routing
- Link components for client-side navigation
- Middleware for locale detection and routing

### Performance Optimization

**Image Optimization**
- Next.js Image component for automatic optimization
- AVIF and WebP format support
- Responsive image sizing
- Lazy loading

**Code Splitting**
- Automatic code splitting by route
- Dynamic imports for heavy components
- Tree shaking for unused code

**Caching Strategy**
- Static generation where possible
- Incremental static regeneration
- API response caching
- Browser caching headers

---

## Backend API Architecture

### API Structure

The API is organized into logical groups under `/api/`:

**Authentication** (`/api/auth/`)
- Login/Logout
- Registration
- Password reset
- OTP verification
- Session management

**Content** (`/api/news/`, `/api/events/`)
- News CRUD operations
- Event management
- Category filtering
- Search functionality
- View tracking

**User Management** (`/api/user/`, `/api/users/`)
- User profile operations
- User directory
- Role management
- Permission handling

**Member Management** (`/api/member/`, `/api/members/`)
- Member registration
- Member directory
- Profile management
- Activity tracking

**Communication** (`/api/chat/`, `/api/notifications/`)
- Chat messaging
- Push notifications
- Email notifications
- WhatsApp integration

**AI Services** (`/api/ai/`, `/api/gemini/`)
- Chatbot interface
- Text processing
- Translation
- Content analysis
- RAG-powered responses

**Admin** (`/api/dashboard/`, `/api/settings/`)
- Dashboard data
- Settings management
- Statistics
- System configuration

**Integration** (`/api/sync/`)
- Facebook page sync
- Media synchronization
- Content import

### API Design Principles

**RESTful Design**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- Proper status codes
- JSON responses

**Authentication**
- JWT tokens via NextAuth
- Session-based authentication
- Role-based access control
- API key authentication for integrations

**Validation**
- Zod schemas for input validation
- Type-safe request/response handling
- Error handling with proper messages

**Internationalization**
- Locale-aware responses
- Translated error messages
- Multi-language content support

### Key API Endpoints

**News API**
```
GET /api/news - List news with filtering
GET /api/news?slug={slug} - Get single article
GET /api/news?category={category} - Filter by category
GET /api/news?featured=true - Get featured articles
GET /api/news?search={query} - Search articles
```

**Authentication API**
```
POST /api/auth/login - User login
POST /api/auth/register - User registration
POST /api/auth/logout - User logout
POST /api/auth/reset-password - Password reset
POST /api/auth/verify-otp - OTP verification
```

**Member API**
```
GET /api/members - List members
GET /api/members/{id} - Get member details
POST /api/members - Register new member
PUT /api/members/{id} - Update member
DELETE /api/members/{id} - Delete member
```

**AI Chat API**
```
POST /api/chat/ai - Send message to AI chatbot
GET /api/chat/ai/sessions - Get chat sessions
GET /api/chat/ai/session/{id} - Get session history
```

**Sync API**
```
POST /api/sync/facebook - Sync Facebook page
GET /api/sync/status - Get sync status
POST /api/sync/media - Sync media files
```

### Error Handling

**Standard Error Response Format**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**HTTP Status Codes**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Mobile Application

### Mobile Technology Stack

**Framework**: Expo 52.0.0 with React Native 0.76.6  
**Navigation**: Expo Router 4.0.0 (file-based routing)  
**Styling**: NativeWind 4.1.0 (Tailwind CSS for React Native)  
**State**: React hooks + AsyncStorage  
**Notifications**: Expo Notifications 0.29.0  

### Mobile App Structure

**Screens**
- `(tabs)/`: Main tab navigation
  - Home screen
  - News screen
  - Events screen
  - Messages screen
  - Profile screen
- `login/`: Login screen
- `register/`: Registration screen
- `news/[slug]`: Article detail screen
- `settings/`: Settings screen

**Navigation**
- Tab-based navigation for main sections
- Stack navigation for detail screens
- Deep linking support
- Back button handling

**Features**
- News reading with rich content
- Event browsing
- AI chatbot integration
- Push notifications
- Offline support
- Biometric authentication (future)

### Mobile-Specific Considerations

**Responsive Design**
- Mobile-first layout
- Touch-optimized interactions
- Gesture support
- Keyboard handling

**Performance**
- Lazy loading of screens
- Image optimization
- Memory management
- Background task handling

**Platform Differences**
- iOS-specific features
- Android-specific features
- Platform-agnostic code where possible

**API Integration**
- RESTful API calls to shared backend
- Token-based authentication
- Offline data caching
- Sync strategies

---

## Internationalization (i18n)

### Supported Languages

- **Arabic (ar)**: Primary language, RTL layout
- **English (en)**: Secondary language, LTR layout
- **Dutch (nl)**: Tertiary language, LTR layout

### i18n Architecture

**Web Application** (`src/messages/`)
- `ar.json`: 600+ translation keys, 40+ namespaces
- `en.json`: Complete English translations
- `nl.json`: Complete Dutch translations

**Mobile Application** (`mobile/i18n/`)
- `ar.json`: 60+ translation keys, 12 namespaces
- `en.json`: Mobile-specific English translations
- `nl.json`: Mobile-specific Dutch translations

### i18n Implementation

**Web (next-intl)**
- Locale-based routing (`[locale]` parameter)
- Server-side translation
- Client-side translation hooks
- Locale detection from headers/cookies
- RTL/LTR layout switching

**Mobile (Custom i18n)**
- Context-based translation provider
- Locale persistence in AsyncStorage
- RTL layout support
- Language switcher component

### Translation Management

**Key Naming Convention**
- Namespace-based organization
- Hierarchical keys (e.g., `nav.home`, `auth.login`)
- Consistent naming across platforms

**Shared Keys**
- Common UI elements must have matching keys in both web and mobile
- API responses use locale-aware messages
- Database content can be multi-language

**Translation Workflow**
1. Add new feature to web with i18n keys
2. Add corresponding keys to mobile i18n
3. Update all three language files
4. Test language switching
5. Verify RTL/LTR layouts

### Locale Detection

**Web**
- Cookie-based locale preference
- Accept-Language header fallback
- URL-based locale override
- Default: Arabic

**Mobile**
- Device language detection
- User preference in settings
- AsyncStorage persistence
- Default: Arabic

---

## Authentication and Authorization

### Authentication Methods

**Email/Password**
- Traditional username/password authentication
- bcrypt password hashing
- Session management via NextAuth

**OAuth Providers**
- Google OAuth integration
- Facebook OAuth integration
- Future: Apple, Microsoft

**OTP Verification**
- Email-based OTP
- SMS-based OTP (future)
- Time-limited codes

### Session Management

**Web Application**
- NextAuth session handling
- JWT tokens
- Secure cookie storage
- Session expiration

**Mobile Application**
- Token-based authentication
- Secure storage (expo-secure-store)
- Token refresh mechanism
- Session persistence

### Authorization Model

**Role-Based Access Control (RBAC)**
- Roles: Admin, Member, Volunteer
- Permissions: Granular permission system
- Role assignments via database
- Permission checks in API routes

**User Roles**
- `admin`: Full system access
- `member`: Standard member access
- `volunteer`: Volunteer-specific features

**Permissions**
- Content management (create, edit, delete)
- User management (view, edit, delete)
- Member management (view, edit, approve)
- System administration (settings, configuration)

### Security Measures

**Password Security**
- Minimum 8 characters
- bcrypt hashing with salt
- Password strength validation
- Secure password reset flow

**Session Security**
- HTTPS-only cookies in production
- Secure token storage
- Session timeout
- CSRF protection

**API Security**
- Rate limiting
- Request validation
- SQL injection prevention (Prisma)
- XSS protection

---

## AI Integration

### AI Services

**Primary AI Provider**: Ollama (Local)  
**Backup Provider**: OpenAI GPT  
**Models Used**:
- `qwen2.5:7b`: Text processing (Arabic-optimized)
- `llava:7b`: Vision tasks (ID extraction)

### AI Features

**Chatbot**
- Context-aware conversations
- RAG-powered responses
- Community-specific knowledge
- Multi-language support
- Rate limiting (30 messages/minute)

**Text Processing**
- Translation (Arabic ↔ English ↔ Dutch)
- Text summarization
- Sentiment analysis
- Content polishing
- Information extraction

**Vision AI**
- ID card extraction
- Image classification
- Document processing

### RAG Implementation

**Retrieval Augmented Generation**
- Keyword extraction from user queries
- Database search (News, Events, Volunteers)
- Context injection into AI prompts
- Fact-aware responses

**Data Sources**
- News articles (Post table)
- Events (Event table)
- Volunteer information (Volunteer table)
- Member profiles (Member table)

### AI Architecture

**Service Layer** (`src/lib/ai/`)
- `chat.ts`: Chatbot logic
- `ollama.ts`: Ollama client
- `rag.ts`: RAG implementation
- `text.ts`: Text processing
- `tasks.ts`: Task assistance

**API Endpoints**
- `POST /api/chat/ai`: Chat with AI
- `POST /api/ai/translate`: Text translation
- `POST /api/ai/summarize`: Text summarization
- `POST /api/ai/extract-id`: ID extraction

### Configuration

**Environment Variables**
```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_VISION_MODEL=llava:7b
OPENAI_API_KEY=sk-...
```

**Model Management**
- Local model hosting via Ollama
- Model downloading and updating
- Model selection based on task
- Fallback to cloud APIs if needed

---

## Social Media Integration

### Facebook Integration

**Facebook Page Sync**
- Automatic post synchronization
- Media download and storage
- Comment synchronization
- Engagement tracking

**Configuration**
```
FACEBOOK_PAGE_ID=61584301535331
FACEBOOK_PAGE_TOKEN=...
FACEBOOK_PAGE_SLUG=DeSyrischeGemeenschapInNederland
```

**Sync Features**
- Scheduled sync (cron job)
- Manual sync trigger
- Category auto-categorization
- Media optimization

### WhatsApp Integration

**WhatsApp Messaging**
- Notification delivery
- Broadcast messaging
- Two-way communication (future)
- Group management (future)

**Configuration**
```
WHATSAPP_BUSINESS_PHONE_ID=...
WHATSAPP_ACCESS_TOKEN=...
```

### Telegram Integration

**Telegram Bot**
- Notification delivery
- Command handling
- Group management
- Automated responses

**Configuration**
```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### Social Media Features

**Content Sharing**
- Share articles to social platforms
- Social media login
- Social media profile linking
- Social feed integration (future)

**Analytics**
- Social media engagement tracking
- Share count tracking
- Referral tracking
- Social media ROI analysis

---

## Deployment and Infrastructure

### Deployment Targets

**Development**
- Local development: `npm run dev` (port 3000)
- Hot reload enabled
- Debug mode

**Staging**
- Vercel: https://sgn-indol.vercel.app
- Automatic deployments from main branch
- Preview deployments for PRs

**Production**
- Hostinger: https://sy-nl.org
- PM2 process management
- Port 3001
- Node.js selector

### Infrastructure

**Web Server**
- Node.js runtime
- Next.js standalone build
- PM2 process manager
- Nginx reverse proxy (optional)

**Database**
- Development: SQLite (local file)
- Production: Turso (LibSQL) - Edge SQLite
- Automatic backups
- Migration management

**File Storage**
- Local file system for uploads
- Cloud storage (S3-compatible) optional
- CDN for static assets
- Image optimization

**CDN**
- Vercel Edge Network (staging)
- Hostinger CDN (production)
- Image optimization
- Cache headers

### Deployment Process

**Web Application**
```bash
# Build
npm run build

# Production start
npm run start

# PM2 management
pm2 start ecosystem.config.js
pm2 restart sy-nl
pm2 logs sy-nl
```

**Mobile Application**
```bash
# Set production API URL
cd mobile
npm run set:prod

# Build Android
npm run build:android

# Build iOS
npm run build:ios

# Build Web
npm run build:web
```

**Database**
```bash
# Push schema changes
npm run db:push

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### Environment Configuration

**Required Environment Variables**
```
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://sy-nl.org
OPENAI_API_KEY=...
GEMINI_API_KEY=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
FACEBOOK_PAGE_ID=...
FACEBOOK_PAGE_TOKEN=...
EXPO_PUBLIC_API_URL=https://sy-nl.org
```

**Optional Environment Variables**
```
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
S3_ENDPOINT=...
S3_REGION=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
```

### Docker Deployment

**Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

**Docker Commands**
```bash
# Build image
docker build -t sy-nl .

# Run container
docker run -p 3001:3001 sy-nl
```

### Monitoring and Logging

**Application Monitoring**
- PM2 process monitoring
- Error tracking (Sentry - optional)
- Performance monitoring
- Uptime monitoring

**Logging**
- Application logs
- Access logs
- Error logs
- Database query logs

**Backup Strategy**
- Database backups
- File system backups
- Configuration backups
- Disaster recovery plan

---

## Features and Functionality

### News and Content

**News Portal**
- Multi-category news articles
- Featured articles section
- Breaking news ticker
- Video content integration
- Search functionality
- Category filtering
- View tracking
- Comment system
- Social sharing

**Content Management**
- Rich text editor (TipTap)
- Image upload
- Video embedding (YouTube)
- Category management
- Tag system
- Publishing workflow
- SEO optimization
- Scheduled publishing

### Events Management

**Event Features**
- Event creation and editing
- Event calendar
- Event registration
- Event reminders
- Event categories
- Location information
- Image gallery
- Attendee management

### Member Management

**Member Registration**
- Multi-step registration form
- Profile information
- Skills and experience
- Privacy settings
- Membership approval
- Membership card generation

**Member Directory**
- Searchable member database
- Filter by location/skills
- Public/private profiles
- Member statistics
- Activity tracking

### Communication

**Chat System**
- Real-time messaging
- AI chatbot integration
- Group chats (future)
- File sharing (future)
- Read receipts
- Typing indicators

**Notifications**
- Push notifications (mobile)
- Email notifications
- In-app notifications
- Notification preferences
- Notification history

### Volunteer Management

**Volunteer Registration**
- Volunteer sign-up form
- Skills assessment
- Availability scheduling
- Task assignment
- Impact tracking

**Volunteer Coordination**
- Task management
- Communication tools
- Progress tracking
- Recognition system

### Donation System

**Donation Features**
- Online donation form
- Multiple payment methods
- Donation tracking
- Receipt generation
- Donor recognition
- Campaign management

### Survey System

**Survey Features**
- Survey creation
- Multiple question types
- Response collection
- Results analysis
- Export functionality

### Administrative Features

**Dashboard**
- User management
- Content management
- Member management
- Statistics and analytics
- System settings
- Activity logs
- Role management

**Task Management**
- Task creation and assignment
- Priority tracking
- Due date management
- Progress tracking
- AI task assistance

---

## Development Workflow

### Development Setup

**Prerequisites**
- Node.js 18+
- npm or yarn
- Git
- SQLite (development)
- Ollama (for AI features)

**Installation**
```bash
# Clone repository
git clone <repository-url>
cd SGN

# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:generate

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

**Mobile Setup**
```bash
cd mobile
npm install
npm run set:dev
npm start
```

### Git Workflow

**Branching Strategy**
- `main`: Production branch
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Emergency fixes

**Commit Convention**
```
feat: add new feature
fix: fix bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Code Quality

**Linting**
```bash
npm run lint
```

**Type Checking**
```bash
npm run typecheck
```

**Testing**
```bash
npm run test
npm run test:coverage
```

**i18n Validation**
```bash
npm run i18n:check
```

### Database Management

**Schema Changes**
```bash
# Update schema
# Edit prisma/schema.prisma

# Push changes
npm run db:push

# Generate client
npm run db:generate
```

**Seeding**
```bash
# Seed database
node prisma/seed.cjs
```

### Build Process

**Web Build**
```bash
npm run build
```

**Mobile Build**
```bash
cd mobile
npm run set:prod
npm run build:android
# or
npm run build:ios
```

---

## Security Considerations

### Application Security

**Authentication Security**
- Secure password hashing (bcrypt)
- Session management
- Token expiration
- Secure token storage

**API Security**
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

**Data Security**
- Encryption at rest (optional)
- Encryption in transit (HTTPS)
- Secure file uploads
- Data sanitization

### Privacy

**User Privacy**
- GDPR compliance
- Data minimization
- User consent
- Right to deletion
- Data portability

**Member Privacy**
- Privacy settings
- Profile visibility controls
- Data access controls
- Activity logging

### Compliance

**Legal Compliance**
- GDPR (EU)
- Dutch data protection laws
- Cookie consent
- Terms of service
- Privacy policy

### Security Best Practices

**Code Security**
- Regular dependency updates
- Security audits
- Code reviews
- Static analysis

**Infrastructure Security**
- Regular backups
- Disaster recovery
- Access controls
- Monitoring and alerting

---

## Performance Optimization

### Frontend Optimization

**Code Optimization**
- Code splitting
- Tree shaking
- Lazy loading
- Minification

**Asset Optimization**
- Image optimization
- Font optimization
- CSS optimization
- JavaScript optimization

**Caching**
- Browser caching
- CDN caching
- Service worker caching
- API response caching

### Backend Optimization

**Database Optimization**
- Query optimization
- Index optimization
- Connection pooling
- Query caching

**API Optimization**
- Response compression
- Rate limiting
- Request batching
- Pagination

### Monitoring

**Performance Monitoring**
- Page load times
- API response times
- Database query times
- Error rates

**User Experience**
- Core Web Vitals
- Lighthouse scores
- Real user monitoring
- A/B testing

---

## Testing and Quality Assurance

### Testing Strategy

**Unit Testing**
- Component testing
- Utility function testing
- API route testing
- Database model testing

**Integration Testing**
- API integration testing
- Database integration testing
- Third-party service testing

**End-to-End Testing**
- User flow testing
- Cross-browser testing
- Mobile testing
- Performance testing

### Testing Tools

**Web Testing**
- Vitest for unit tests
- Playwright for E2E tests
- Testing Library for component tests

**Mobile Testing**
- Expo testing tools
- Device testing
- Emulator testing

### Quality Metrics

**Code Quality**
- Code coverage
- Cyclomatic complexity
- Code duplication
- Technical debt

**Performance**
- Load time
- Time to interactive
- First contentful paint
- Cumulative layout shift

---

## Future Roadmap

### Planned Features

**Phase 1: Enhanced Communication**
- Real-time chat with WebSockets
- Video conferencing integration
- Advanced notification system
- Email campaign management

**Phase 2: Advanced AI Features**
- Improved AI chatbot
- Content recommendation engine
- Automated content moderation
- Sentiment analysis dashboard

**Phase 3: Mobile Enhancements**
- Offline mode
- Biometric authentication
- Push notification improvements
- Background sync

**Phase 4: Community Features**
- Forum system
- Job board
- Marketplace
- Skill exchange platform

**Phase 5: Analytics and Insights**
- Advanced analytics dashboard
- User behavior tracking
- Content performance metrics
- Community engagement insights

### Technical Improvements

**Infrastructure**
- Microservices architecture
- Kubernetes deployment
- Advanced caching strategy
- Global CDN

**Performance**
- Server-side rendering optimization
- Edge computing
- Database sharding
- Load balancing

**Security**
- Advanced authentication methods
- Enhanced encryption
- Security audit automation
- Compliance automation

---

## Conclusion

The Syrian Community in the Netherlands Platform (SY-NL) is a comprehensive, multi-platform digital solution designed to serve the Syrian diaspora in the Netherlands. With its robust architecture, modern technology stack, and extensive feature set, it provides a solid foundation for community engagement, information dissemination, and service delivery.

The platform's modular architecture allows for continuous improvement and expansion, while its multi-language support ensures accessibility to all community members. The integration of AI technologies enhances user experience and provides intelligent features that adapt to community needs.

With proper maintenance, regular updates, and community feedback, SY-NL will continue to evolve and serve as a vital digital hub for the Syrian community in the Netherlands.

---

**Document Version**: 1.0  
**Last Updated**: June 2026  
**Maintained By**: Development Team  
**Contact**: development@sy-nl.org
