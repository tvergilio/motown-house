# Motown House

A digital record store for classic Motown albums built with Next.js and TypeScript. This application displays a curated collection of vinyl records with full CRUD functionality and iTunes integration for discovering new albums.

## ✨ Features

### Core Functionality
- **Browse Albums**: View a collection of classic Motown albums with large cover art
- **Advanced Search**: Multi-token search across title, artist, genre, and year with diacritics support
- **CRUD Operations**: Create, read, update, and delete albums with comprehensive validation
- **Responsive Design**: Mobile-first design that works perfectly on all devices

### iTunes Integration
- **iTunes Search**: Search the iTunes catalog to discover albums
- **Visual Preview**: Large album cover previews when importing from iTunes
- **Genre Mapping**: Automatic mapping from iTunes genres to our classification system
- **Cached Results**: Smart caching of search results for improved performance

### Performance & UX
- **Image Caching**: Server-side image proxy with 24-hour caching for Apple Music artwork
- **Search Caching**: 10-minute caching of iTunes search results
- **Optimized Images**: Automatic upscaling to high-resolution (600x600) artwork
- **Loading States**: Skeleton loading and error handling for better UX
- **Form Validation**: Real-time validation with Zod schema validation

## Prerequisites

- Node.js 18+ (LTS recommended)
- Backend API server running on localhost:8080

## Getting Started

1. **Install dependencies**:
   ```bash
   npm ci
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` if you need to change the API URL from the default `http://localhost:8080`.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:9002](http://localhost:9002) in your browser.

## API Integration

This frontend application connects to a Go backend API running on `localhost:8080`. The application handles all album CRUD operations and iTunes search integration through the backend.

### Configuration

The API base URL can be configured via environment variables, but defaults to `http://localhost:8080`.

### Image Handling & Caching

The application includes sophisticated image handling:

#### Image Proxy & Caching
- **Server-side caching**: Images cached for 24 hours to reduce API calls
- **Rate limit protection**: Avoids 429 errors from Apple's servers
- **Endpoint**: `GET /api/image-proxy?url={encodedImageUrl}`

#### Automatic Resolution Enhancement
- Apple Music URLs: `100x100bb.jpg` → `300x300bb.jpg` (for iTunes search results)
- Stored albums: `60x60bb.jpg` → `600x600bb.jpg` (for high-quality display)
- Automatic pattern detection and scaling for various dimension formats
- Example: `https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/.../100x100bb.jpg` becomes `https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/.../300x300bb.jpg`

#### Error Handling
- Graceful fallbacks with music icon placeholders for failed images
- Automatic retry logic for temporary failures

### Genre Options

The genre field accepts one of the following values:
- `"Soul"`
- `"R&B/Soul"`
- `"Motown"`
- `"Pop"`
- `"Rock"`
- `"Funk"`
- `"Disco"`
- `"Other"` (fallback for any other genre)

### API Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- API server unavailability
- Invalid responses
- 404 Not Found errors
- Request timeouts (10 seconds)

## Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── albums/                  # Album management pages
│   │   ├── [id]/               # Dynamic album detail pages
│   │   │   ├── page.tsx        # Album detail view
│   │   │   └── edit/page.tsx   # Album edit form
│   │   └── add/page.tsx        # Album creation with iTunes integration
│   ├── api/                    # API routes
│   │   └── image-proxy/        # Image caching proxy
│   ├── layout.tsx              # Root layout with navigation
│   └── page.tsx                # Home page with search
├── components/                  # Reusable UI components
│   ├── ui/                     # Radix UI primitives
│   ├── album-card.tsx          # Album display component
│   ├── album-form.tsx          # Album creation/edit form
│   ├── itunes-search.tsx       # iTunes integration component
│   ├── search.tsx              # Search bar with debouncing
│   └── header.tsx              # Navigation header
├── hooks/                      # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection
│   └── use-toast.ts           # Toast notifications
└── lib/                        # Core utilities and business logic
    ├── api-client.ts           # HTTP client with error handling
    ├── data.ts                 # Data access layer with caching
    ├── actions.ts              # Server actions with validation
    ├── definitions.ts          # TypeScript types and schemas
    └── utils.ts                # Utility functions
```

## 🎵 iTunes Integration

### How It Works
1. **Search iTunes**: Users can search the iTunes catalog for albums
2. **Visual Selection**: Large album previews with metadata (artist, year, genre, price)
3. **One-Click Import**: Selected albums auto-populate the form with all metadata
4. **Genre Mapping**: iTunes genres are automatically mapped to our classification system
5. **Image Quality**: Album artwork is cached and served at optimal resolution

### iTunes Search Features
- **Debounced Search**: Reduces API calls while typing
- **Result Caching**: 10-minute cache for popular searches
- **Genre Intelligence**: Smart mapping from iTunes genres to our categories
- **Error Handling**: Graceful handling of iTunes API issues

### Tabbed Interface
- **iTunes Search Tab**: Discover and import albums from iTunes
- **Manual Entry Tab**: Create albums manually (requires imageUrl)

## Backend Setup

This frontend requires a backend API that implements the album CRUD operations. The backend is a Go web service built with Gin framework.

### 🔗 Backend Repository
**Go Backend API**: [https://github.com/tvergilio/web-service-gin](https://github.com/tvergilio/web-service-gin)

### Backend Requirements
- **Port**: Must run on `localhost:8080` (configurable)
- **CORS**: Must allow requests from `http://localhost:9002`
- **iTunes Proxy**: Must provide iTunes search functionality



### Quick Backend Setup
1. Clone the backend repository:
   ```bash
   git clone https://github.com/tvergilio/web-service-gin.git
   ```
2. Follow the setup instructions in the backend README
3. Ensure the API is running on `localhost:8080`
4. Configure CORS to allow `http://localhost:9002` (frontend URL)

## Troubleshooting

### API Connection Issues

If you see "API Connection Error":
1. Ensure your backend server is running on localhost:8080
2. Check that the API endpoints are accessible
3. Verify CORS is configured if needed
4. Check network connectivity

### Build Issues

If you encounter TypeScript or build errors:
1. Run `npm run typecheck` to identify type issues
2. Ensure Node.js version is 18+
3. Try deleting `node_modules` and `.next`, then run `npm ci`

### Port Conflicts

If port 9002 is in use:
1. Kill the process using the port
2. Or modify the port in `package.json` dev script

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Full type safety throughout the application
- **React 19** - Latest React features with server components

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **CSS Grid/Flexbox** - Responsive layouts

### Data & Validation
- **Zod** - Runtime schema validation for forms and API responses
- **Server Actions** - Type-safe server-side form handling
- **React Hook Form** - (via server actions) Form state management

### Performance & Caching
- **Image Optimization** - Next.js Image component with custom proxy
- **Search Caching** - In-memory caching with TTL
- **Image Caching** - Server-side proxy with 24-hour cache
- **Debounced Search** - Reduces API calls during user input

### Development Tools
- **ESLint** - Code linting and style enforcement
- **TypeScript Compiler** - Static type checking
- **Turbopack** - Fast development bundling
