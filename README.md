# nUSA Legal - Nuxt 4 Application

A comprehensive legal information platform built with Nuxt 4, providing access to bills, laws, constitution articles, court procedures, and an AI-powered legal assistant.

## ⚡ Quick Setup

**Prerequisites:** You already have the repository cloned and Netlify account set up.

1. **Import to Netlify**

    - Go to Netlify Dashboard → Add new site → Import an existing project
    - Connect your Git repository
    - Netlify will auto-detect the build settings from `netlify.toml`

2. **Deploy**

    - Click "Deploy site"
    - **No environment variables needed for the build!** ✅
    - The build will complete successfully without any env vars

3. **Upload PDFs to Netlify Blobs** (Optional but recommended)

    PDFs need to be uploaded to Netlify Blobs for production. Run:

    ```bash
    # Option 1: Using Netlify CLI (recommended)
    netlify login
    npm run upload-pdfs

    # Option 2: Using access token
    set NETLIFY_ACCESS_TOKEN=your-token
    set NETLIFY_SITE_ID=your-site-id
    npm run upload-pdfs
    ```

    The script will:

    - Find all PDFs in `server/bills/` directory
    - Upload them to Netlify Blobs store named `pdfs`
    - Preserve the directory structure

4. **Done!** 🎉
    - Your site is live and functional
    - Static content (bills, laws, constitution) works immediately
    - API endpoints work (some features may be limited without env vars)
    - PDFs are accessible via the API

**Note:** Environment variables are only needed for runtime features (chatbot, external APIs, etc.). The build process requires **zero environment variables**.

---

## 🚀 Full Installation Guide

### Prerequisites

-   **Node.js** 18.x or higher
-   **npm** or **yarn** package manager
-   **Git** for version control

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nuxt
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory with the following variables:

    ```env
    # Required - API Authentication
    TOKEN_SECRET=your-secret-key-here-min-32-chars
    TOKEN_EXPIRY=5
    ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

    # Required - OpenAI (for AI Chatbot)
    OPENAI_API_KEY=sk-your-openai-api-key
    VECTOR_STORE_ID=vs-your-vector-store-id
    ASSISTANT_ID=asst-your-assistant-id
    TAVILY_API_KEY=tvly-your-tavily-api-key

    # Required - External Services
    TRELLO_API_KEY=your-trello-api-key
    TRELLO_TOKEN=your-trello-token
    NUSA_API_KEY=your-nusa-api-key

    # Optional - Redis Cache (Upstash)
    UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
    UPSTASH_REDIS_REST_TOKEN=your-redis-token

    # Optional - Error Monitoring (Sentry)
    NUXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
    NUXT_PUBLIC_SENTRY_SAMPLE_RATE=1.0
    NUXT_PUBLIC_ENVIRONMENT=production

    # System
    NODE_ENV=production
    ```

4. **Run development server**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`

## 📋 Environment Variables

### Required Variables

| Variable          | Description                                             | Example                                       |
| ----------------- | ------------------------------------------------------- | --------------------------------------------- |
| `TOKEN_SECRET`    | Secret key for JWT token generation (min 32 characters) | `your-super-secret-key-here`                  |
| `TOKEN_EXPIRY`    | Token expiration time in minutes                        | `5`                                           |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins            | `https://example.com,https://www.example.com` |
| `OPENAI_API_KEY`  | OpenAI API key for chatbot functionality                | `sk-...`                                      |
| `VECTOR_STORE_ID` | OpenAI vector store ID for RAG                          | `vs-...`                                      |
| `ASSISTANT_ID`    | OpenAI assistant ID                                     | `asst-...`                                    |
| `TAVILY_API_KEY`  | Tavily API key for web search                           | `tvly-...`                                    |
| `TRELLO_API_KEY`  | Trello API key for ban checks                           | `your-trello-key`                             |
| `TRELLO_TOKEN`    | Trello API token                                        | `your-trello-token`                           |
| `NUSA_API_KEY`    | NUSA API key for Roblox user verification               | `your-nusa-key`                               |

### Optional Variables

| Variable                         | Description                   | Default       | Notes                         |
| -------------------------------- | ----------------------------- | ------------- | ----------------------------- |
| `UPSTASH_REDIS_REST_URL`         | Upstash Redis REST API URL    | -             | Enables caching               |
| `UPSTASH_REDIS_REST_TOKEN`       | Upstash Redis REST API token  | -             | Required if Redis URL is set  |
| `NUXT_PUBLIC_SENTRY_DSN`         | Sentry DSN for error tracking | -             | Error monitoring              |
| `NUXT_PUBLIC_SENTRY_SAMPLE_RATE` | Sentry error sampling rate    | `1.0`         | 0.0 to 1.0                    |
| `NUXT_PUBLIC_ENVIRONMENT`        | Environment identifier        | `production`  | Used for Sentry               |
| `NODE_ENV`                       | Node environment              | `development` | `development` or `production` |

## 🔧 Why Redis?

Redis is used as an **optional caching layer** to improve performance:

-   **Purpose**: Cache frequently accessed data (API responses, search results)
-   **Implementation**: Uses Upstash Redis (serverless Redis compatible with Netlify)
-   **Behavior**:
    -   If Redis is configured, the app uses it for caching
    -   If Redis is **not** configured, the app works normally without caching
    -   The health check endpoint reports cache status: `connected`, `not_configured`, or `disconnected`

**You don't need Redis to run the application** - it's purely optional for performance optimization.

## 🏗️ Building for Production

### Build the application

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Generate static site

```bash
npm run generate
```

## 🌐 Deployment

### Netlify (Recommended)

This application is configured for Netlify deployment:

1. **Connect your repository** to Netlify
2. **Set environment variables** in Netlify dashboard:
    - Go to Site settings → Environment variables
    - Add all required variables from the `.env` file
3. **Deploy settings** (auto-configured via `netlify.toml`):

    - Build command: `npm run build`
    - Publish directory: `.output/public`
    - Functions directory: `.netlify/functions-internal/server`

4. **Deploy**
    - Netlify will automatically deploy on git push
    - Or trigger manual deploy from Netlify dashboard

### Manual Deployment

1. Build the application:

    ```bash
    npm run build
    ```

2. The output will be in `.output/public` directory

3. Deploy the contents to your hosting provider

## 📁 Project Structure

```
nuxt/
├── app/                    # Nuxt application source
│   ├── components/         # Vue components
│   ├── pages/              # Route pages
│   ├── stores/             # Pinia stores
│   └── composables/        # Composables
├── server/                  # Server-side code
│   ├── api/                # API endpoints
│   ├── data/               # Static data files
│   └── utils/              # Server utilities
├── public/                 # Static assets
├── nuxt.config.ts         # Nuxt configuration
└── package.json            # Dependencies
```

## 🔑 API Endpoints

### Public Endpoints

-   `GET /api/health` - Health check endpoint
-   `GET /api/search?q=query` - Search across all content
-   `POST /api/auth/token` - Generate API access token

### Protected Endpoints (require token)

-   `GET /api/bills/congress` - Congressional bills
-   `GET /api/bills/city-council` - City council bills
-   `GET /api/laws/federal` - Federal laws
-   `GET /api/laws/eo` - Executive orders
-   `GET /api/laws/municipal` - Municipal laws
-   `GET /api/constitution/constitution` - Constitution articles
-   `GET /api/constitution/constitution-amandments` - Constitution amendments
-   `GET /api/resources/definitions` - Legal definitions
-   `GET /api/resources/files` - Legal files
-   `GET /api/resources/vips` - VIP users
-   `GET /api/courts/[volume]` - Court cases by volume
-   `GET /api/federal-rules/frcp` - Federal Rules of Civil Procedure
-   `GET /api/federal-rules/frcmp` - Federal Rules of Criminal Procedure

### Special Endpoints

-   `POST /api/chatbot` - AI-powered legal assistant
-   `GET /api/robloxcheck?username=...` - Roblox user verification
-   `POST /api/check-nusa-bans` - NUSA ban check

## 🛠️ Development

### Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run generate` - Generate static site
-   `npm run preview` - Preview production build

### Key Features

-   **Static Data**: All legal content is stored in static TypeScript files (no database required)
-   **API Authentication**: Token-based API access control
-   **Rate Limiting**: Built-in rate limiting for API endpoints
-   **Caching**: Optional Redis caching for improved performance
-   **Error Monitoring**: Optional Sentry integration
-   **PDF Storage**: PDFs stored in Netlify Blobs or local filesystem

## 🔒 Security

-   CORS protection via `ALLOWED_ORIGINS`
-   Token-based API authentication
-   Rate limiting on sensitive endpoints
-   Input sanitization and validation
-   Secure PDF token system

## 📄 PDF Storage

PDFs are stored in **Netlify Blobs** for production deployments. The application automatically detects the environment and uses the appropriate storage:

-   **Production (Netlify)**: PDFs are served from Netlify Blobs
-   **Development (Local)**: PDFs are served from `server/bills/` directory

### Uploading PDFs to Netlify Blobs

After deploying to Netlify, upload your PDFs:

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Upload all PDFs from server/bills/ directory
npm run upload-pdfs
```

**Alternative method (using access token):**

```bash
# Get your access token from: https://app.netlify.com/user/applications
# Get your site ID from: Netlify Dashboard → Site settings → General → Site details

# Windows
set NETLIFY_ACCESS_TOKEN=your-access-token
set NETLIFY_SITE_ID=your-site-id
npm run upload-pdfs

# Linux/Mac
export NETLIFY_ACCESS_TOKEN=your-access-token
export NETLIFY_SITE_ID=your-site-id
npm run upload-pdfs
```

The script will:

-   Scan `server/bills/` directory recursively
-   Upload all `.pdf` files to Netlify Blobs store (`pdfs`)
-   Preserve the directory structure
-   Show progress and summary

**Note:** The store name can be customized with `NETLIFY_BLOBS_STORE_NAME` environment variable (default: `pdfs`).

## 📝 Notes

-   **No Database**: This application uses static data files - no Prisma or database setup required
-   **Redis is Optional**: The app works without Redis, but caching improves performance
-   **PDF Storage**: PDFs can be stored in Netlify Blobs (production) or local filesystem (development)

## 🐛 Troubleshooting

### Redis Connection Issues

If you see `cache: disconnected` in health check:

-   Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set correctly
-   Verify Upstash Redis instance is active
-   The app will work without Redis, but without caching

### API Token Issues

-   Ensure `TOKEN_SECRET` is at least 32 characters
-   Check `ALLOWED_ORIGINS` includes your domain
-   Verify token expiration time in `TOKEN_EXPIRY`

### Build Errors

-   Ensure Node.js version is 18.x or higher
-   Clear `.nuxt` and `node_modules`, then reinstall:
    ```bash
    rm -rf .nuxt node_modules
    npm install
    ```

## 📄 License

[Your License Here]

## 🤝 Contributing

[Contributing Guidelines Here]
