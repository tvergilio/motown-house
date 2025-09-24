# Motown House

A digital record store for classic Motown albums built with Next.js and TypeScript. This application displays a curated collection of vinyl records with full CRUD functionality.

## Features

- **Browse Albums**: View a collection of classic Motown albums
- **Search**: Search albums by title or artist
- **CRUD Operations**: Create, read, update, and delete albums
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful handling of API errors
- **Loading States**: Skeleton loading for better UX

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

This application expects a REST API running on `localhost:8080` with the following endpoints:

### Album Endpoints

- `GET /albums` - Get all albums
- `GET /albums/:id` - Get album by ID
- `POST /albums` - Create a new album
- `PUT /albums/:id` - Update an album
- `DELETE /albums/:id` - Delete an album

### Expected Album Data Structure

```json
{
  "id": "string",
  "title": "string",
  "artist": "string", 
  "year": "number",
  "price": "number",
  "genre": "string",
  "coverImageUrl": "string (optional)"
}
```

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

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── albums/            # Album-related pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
└── lib/                  # Utilities and data layer
    ├── api-client.ts     # API client with error handling
    ├── data.ts           # Data access layer
    ├── definitions.ts    # TypeScript types
    └── actions.ts        # Server actions
```

## Backend Setup

This frontend requires a backend API that implements the album CRUD operations. Based on the integration tests provided, the backend should be a Go application using:

- HTTP REST API
- PostgreSQL database
- CRUD operations for albums
- Running on port 8080

Example backend test structure suggests endpoints like:
```go
// GET /albums - GetAll()
// GET /albums/:id - GetByID(id)  
// POST /albums - Create(album)
// PUT /albums/:id - Update(id, album)
// DELETE /albums/:id - Delete(id)
```

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

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Lucide React** - Icons
- **Zod** - Schema validation
