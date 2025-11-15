# ImaGenSD API

Modern Node.js + Express backend for ImaGenSD - AI image generation platform with PostgreSQL, JWT auth, and Stable Diffusion integration.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🎨 **AI Image Generation** - Integration with Stable Diffusion and external APIs
- 💾 **PostgreSQL Database** - Robust data storage for users, prompts, and images
- ⚡ **TypeScript** - Type-safe development
- 🔒 **Helmet Security** - Enhanced security headers with CORS support
- 📁 **File Upload** - Image storage and retrieval

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Stable Diffusion API (optional, for local image generation)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dreadfxl/imagensd-api.git
   cd imagensd-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your settings:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=imagensd
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:5173
   SD_API_URL=http://localhost:7860
   ```

4. **Create the database**
   ```sql
   CREATE DATABASE imagensd;
   ```

5. **Run migrations**
   ```bash
   npm run build
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Images
- `POST /api/images/generate` - Generate a new image
- `GET /api/images` - Get user's images
- `GET /api/images/:id` - Get specific image

### Prompts
- `POST /api/prompts` - Save a prompt
- `GET /api/prompts` - Get user's prompts
- `GET /api/prompts/:id` - Get specific prompt
- `PUT /api/prompts/:id` - Update a prompt
- `DELETE /api/prompts/:id` - Delete a prompt

### Health Check
- `GET /health` - Check API and database status

## Frontend Integration

### CORS Configuration

The API is configured to work with React frontends running on `http://localhost:5173` (Vite default). If your frontend runs on a different port, update the `CORS_ORIGIN` in your `.env` file:

```env
CORS_ORIGIN=http://localhost:3000
```

### Image Loading

Images are served from the `/uploads` directory with proper CORS headers. To display images in your React app:

```tsx
<img 
  src={`http://localhost:3000/uploads/${imageName}`} 
  alt="Generated image"
  crossOrigin="anonymous"
/>
```

### Troubleshooting CORS Issues

If you encounter `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin` errors:

1. **Ensure your `.env` file has the correct CORS_ORIGIN**
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Restart your backend server** after changing environment variables

3. **Clear browser cache** and reload the page

4. **Check that Helmet CSP is properly configured** (already done in `src/index.ts`)

### React DevTools Warning

The warning about `__REACT_DEVTOOLS_GLOBAL_HOOK__` is a development-only issue and won't affect production. It occurs when something modifies the React DevTools hook. This doesn't impact functionality.

## Project Structure

```
imagensd-api/
├── src/
│   ├── config/         # Database and configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication and validation
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── index.ts        # App entry point
├── uploads/            # Generated images storage
├── .env                # Environment variables
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run db:migrate` - Run database migrations

## Security Features

- **Helmet.js** - Sets secure HTTP headers
- **CORS** - Controlled cross-origin access
- **JWT Authentication** - Secure token-based auth
- **bcrypt** - Password hashing
- **Content Security Policy** - XSS protection
- **Cross-Origin Resource Policy** - Resource sharing control

## Development

### Environment Setup

For development, make sure to:

1. Use `NODE_ENV=development` in your `.env`
2. Configure `CORS_ORIGIN` to match your frontend URL
3. Set a strong `JWT_SECRET` (even in development)

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Register route in `src/index.ts`

## License

MIT

## Author

Dreadful
