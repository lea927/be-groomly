# BE-Groomly API

Backend API for Groomly - A modern grooming service platform.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd be-groomly

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/be_groomly

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# External APIs
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
```

## 📚 API Documentation

### Health Check

#### GET /api/health
Returns the current health status of the API.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "OK",
    "timestamp": "2025-01-05T12:00:00Z",
    "uptime": 3600,
    "environment": "development",
    "version": "1.0.0"
  }
}
```

#### GET /api/
Returns welcome message and API information.

**Response:**
```json
{
  "success": true,
  "message": "Welcome to be-groomly API!",
  "data": {
    "version": "1.0.0",
    "documentation": "/api/docs",
    "health": "/api/health"
  }
}
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🔧 Development

```bash
# Start development server
pnpm dev

# Lint code
pnpm lint

# Format code
pnpm format

# Check code formatting
pnpm format:check
```

## 📦 Scripts

- `pnpm start` - Start production server
- `pnpm dev` - Start development server with hot reload
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Fix linting errors
- `pnpm format` - Format code
- `pnpm format:check` - Check code formatting

## 🏗️ Project Structure

```
be-groomly/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # Route definitions
│   └── utils/          # Utility functions
├── tests/              # Test files
├── docs/               # Documentation
├── logs/               # Application logs
└── server.js           # Application entry point
```

## 🔐 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request validation
- **Error Handling** - Centralized error handling

## 🚀 Deployment

### Environment Setup
1. Set up production environment variables
2. Configure database connection
3. Set up monitoring and logging
4. Configure CI/CD pipeline

### Recommended Platforms
- **Railway** - Simple deployment with database
- **Render** - Easy deployment with free tier
- **Vercel** - Serverless deployment
- **AWS/GCP/Azure** - Full control and scalability

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and linting
6. Submit a pull request

## 📞 Support

For support, email support@groomly.com or create an issue in the repository.
