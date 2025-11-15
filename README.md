# 🔍 AI-Powered Competitor Comparison Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Get instant Gemini AI-powered competitive intelligence on any two companies**

[🚀 Live Demo](https://simple-competitor-analysis-web-app.vercel.app) | [📖 Docs](#table-of-contents) | [🐛 Report Bug](#support)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

---

## 🌟 Overview

The **Competitor Comparison Tool** is a modern web application that leverages Google's Gemini AI to provide instant, comprehensive competitive analysis between any two companies. Built with a focus on security, user experience, and cost efficiency, this tool demonstrates professional-grade full-stack development practices.

**Key Highlights:**
- 🤖 **AI-Powered Analysis**: Utilizes Google's latest Gemini models for intelligent, contextual comparisons
- 🎨 **Modern UI/UX**: Beautiful, responsive interface with smooth animations and transitions
- 🔒 **Security-First**: API keys hidden on backend, rate limiting, input validation, and XSS prevention
- ⏱️ **Cost-Effective**: Smart rate limiting protects API quota while maintaining excellent UX
- 📱 **Fully Responsive**: Works flawlessly on desktop, tablet, and mobile devices
- 🌍 Deployed on Render (backend) + Vercel (frontend)
- 📄 **PDF Export**: Download professional comparison reports as formatted PDF documents

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **AI-Powered Comparisons** | Leverages Gemini  for intelligent analysis |
| **Structured Output** | Returns comparisons in clean markdown tables with 8 key business attributes |
| **Model Selection** | Users can choose between 5 different Gemini models (2.0/2.5 Pro, Flash, and Lite models) based on their needs |
| **Smart Summaries** | AI-generated summaries highlight key strengths and differentiators |
| **Real-Time Processing** | Live loading indicators with smooth animations |
| **Error Handling** | Comprehensive error messages guide users when issues occur |
| **PDF Export** | Download comparison results as professionally formatted PDF reports with tables and summaries |

### Technical Features

| Feature | Description |
|---------|-------------|
| **Rate Limiting** | Two-tier protection (100 general + 10 comparison requests per 15 min) |
| **Input Validation** | 8+ validation checks prevent malformed or malicious requests |
| **Header-Based Auth** | API keys transmitted securely via HTTP headers, not URLs |
| **CORS Protection** | Configurable cross-origin resource sharing |
| **Responsive Design** | Mobile-first CSS with breakpoints for all device sizes |
| **Markdown Parsing** | Converts AI output to beautiful HTML tables dynamically |

### User Experience Features

| Feature | Description |
|---------|-------------|
| **Loading Animations** | Engaging spinners with status messages |
| **Smooth Transitions** | CSS animations for all state changes |
| **Clear Error Messages** | User-friendly feedback for all error scenarios |
| **Keyboard Support** | Enter key triggers comparisons for better accessibility |
| **Visual Feedback** | Hover states, focus indicators, and disabled states |
| **Model Recommendations** | Default model selection with clear labeling |

---

## 🛠 Tech Stack

### Frontend Technologies

```
┌─────────────────────────────────────────┐
│           Frontend Stack                │
├─────────────────────────────────────────┤
│ HTML5        │ Semantic, accessible     │
│ CSS3         │ Modern features, flexbox │
│ JavaScript   │ Vanilla ES6+, async/await│
│ Fetch API    │ HTTP client for backend  │
└─────────────────────────────────────────┘
```

**Why Vanilla JavaScript?**
- Zero dependencies = faster load times
- No build process needed for development
- Complete control over functionality
- Easy to understand and maintain
- Perfect for learning fundamentals

**CSS Features Used:**
- CSS Custom Properties (variables)
- Flexbox & Grid layouts
- CSS animations & transitions
- Media queries for responsiveness
- Modern pseudo-selectors

### Backend Technologies

```
┌─────────────────────────────────────────┐
│           Backend Stack                 │
├─────────────────────────────────────────┤
│ Node.js      │ JavaScript runtime       │
│ Express.js   │ Web framework            │
│ Axios        │ HTTP client for APIs     │
│ dotenv       │ Environment variables    │
│ cors         │ Cross-origin support     │
│ express-rate-│                          │
│ limit        │ API protection           │
│ pdfkit       │ PDF generation           │
└─────────────────────────────────────────┘
```

**Why This Stack?**
- **Node.js**: JavaScript everywhere, single language for full stack
- **Express**: Minimalist, flexible, industry-standard web framework
- **Axios**: Elegant HTTP client with promises and interceptors
- **Rate Limiting**: Professional-grade API protection out of the box
- **PDFKit**: Powerful PDF generation library for creating formatted reports

### AI Integration

```
┌─────────────────────────────────────────┐
│         Google Gemini API               │
├─────────────────────────────────────────┤
│ gemini-2.5-pro          │ Most powerful │
│ gemini-2.5-flash        │ Recommended   │
│ gemini-2.5-flash-lite   │ Fastest (8B)  │
│ gemini-2.0-flash        │ Previous gen  │
│ gemini-2.0-flash-lite   │ Ultra-fast    │
└─────────────────────────────────────────┘
```
---

## 🏗 Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Frontend (HTML/CSS/JS)                                │  │
│  │  • Input validation (client-side)                      │  │
│  │  • Model selection UI                                  │  │
│  │  • Markdown to HTML conversion                         │  │
│  │  • Error handling & display                            │  │
│  └────────────────┬───────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │ HTTPS/HTTP
                    │ POST /api/compare
                    │ { companyA, companyB, model }
                    ▼
┌──────────────────────────────────────────────────────────────┐
│                     NODE.JS BACKEND                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 3000)                            │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Layer                                │  │  │
│  │  │  • CORS configuration                            │  │  │
│  │  │  • JSON body parser                              │  │  │
│  │  │  • Rate limiting (IP-based)                      │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Route Handlers                                  │  │  │
│  │  │  • GET /health - Health check                    │  │  │
│  │  │  • POST /api/compare - Main endpoint             │  │  │    
│  │  │  • POST /api/download-pdf - PDF generation       │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Business Logic                                  │  │  │
│  │  │  • Input validation                              │  │  │
│  │  │  • Model whitelist checking                      │  │  │
│  │  │  • Prompt engineering                            │  │  │
│  │  │  • Response parsing                              │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────┬───────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │ HTTPS
                    │ x-goog-api-key: ***
                    │ POST /v1beta/models/{model}:generateContent
                    ▼
┌──────────────────────────────────────────────────────────────┐
│                  GOOGLE GEMINI API                           │
│  • Model: gemini-2.5-flash (or selected model)              │
│  • Input: Structured prompt with business analyst role      │
│  • Output: Markdown table + summary                         │
│  • Rate limits: Per API key                                 │
└──────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Input → Frontend Validation → API Request → Rate Limit Check
    ↓
Backend Validation → Model Selection → Gemini API Call
    ↓
Response Parsing → Markdown Processing → Frontend Display
    ↓
User Clicks Download → PDF Generation Request → Backend Creates PDF → File Download
```

### Data Flow

```javascript
// Frontend sends:
{
  companyA: "Apple",
  companyB: "Samsung", 
  model: "gemini-2.5-flash"
}

// Backend adds context and sends to Gemini:
{
  contents: [{
    parts: [{
      text: "You are a professional business analyst..."
    }]
  }]
}

// Gemini returns:
{
  candidates: [{
    content: {
      parts: [{
        text: "| Attribute | Apple | Samsung |\n..."
      }]
    }
  }]
}

// Backend forwards to frontend:
{
  success: true,
  companyA: "Apple",
  companyB: "Samsung",
  model: "gemini-2.5-flash",
  responseText: "| Attribute | Apple | Samsung |...",
  timestamp: "2025-10-15T..."
}

// Frontend parses and renders HTML table
```
---

## 📁 Project Structure

```
competitor-tool/
├── backend/
│   ├── server.js              # Express server & routes
│   ├── package.json           # Node dependencies
│   ├── .env                   # Environment variables
│   └── node_modules/          # Installed packages
│
├── frontend/
│   ├── index.html             # Main page structure
│   ├── styles.css             # Styling & animations
│   ├── script.js              # Frontend logic
│   └── (optional) assets/     # Images, icons
│
├── README.md                  # This file
├── .gitignore                 # Git exclude patterns
└── LICENSE                    # MIT License
```
---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get one here](https://aistudio.google.com/api-keys)
- **Code Editor** (VS Code, Sublime, etc.)
- **Terminal/Command Prompt** access
- **Git** (optional, for version control)

### Local Development

#### 1. Clone or Download the Project

```bash
# If using Git:
git clone https://github.com/rasalabh/simple-competitor-analysis-web-app.git
cd competitor-tool

# Or download ZIP and extract
```

#### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env  # Mac/Linux
# or
type nul > .env  # Windows

# Edit .env and add environment variables:
   - `GEMINI_API_KEY`: Your API key
   - `NODE_ENV`: `development`
   - `CORS_ORIGIN`: Your Vercel URL
   - `PORT`: `3000`
```

#### 3. Verify Installation

```bash
# Check Node.js version
node --version  # Should show v16.0.0 or higher

# Check installed packages
npm list --depth=0

# Expected output:
# ├── axios@1.6.0
# ├── cors@2.8.5
# ├── dotenv@16.3.1
# ├── express@4.18.2
# ├── express-rate-limit@7.1.5
# ├── pdfkit@0.13.0
```

#### 4. Start the Backend Server

```bash
# From backend directory
npm start

# Expected output:
# Server running on port 3000
# Health check: http://localhost:3000/health
# Rate limiting enabled:
#   - General API: 100 requests per 15 minutes
#   - Comparisons: 10 requests per 15 minutes
```

#### 5. Open the Frontend

```bash
# Option 1: Simple (just open the file)
# Double-click frontend/index.html

# Option 2: Using a local server (recommended)
cd frontend
python -m http.server 8080
# or
npx http-server -p 8080

# Then visit: http://localhost:8080
```

#### 6. Test the Application

1. **Enter two company names** (e.g., "Apple" and "Microsoft")
2. **Select an AI model** (default is Gemini 2.5 Flash)
3. **Click "Compare Now"**
4. **Wait for results** (5-15 seconds depending on model)
5. **View the comparison table and summary**
6. **Click "Download PDF Report"** to save results as a formatted PDF document
7. **Open the downloaded PDF** to verify formatting and content

---

## 🌍 Deployment

### Render (Backend)

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - Build: `npm install`
   - Start: `npm start`
   - Root directory: `backend`
5. Add environment variables:
   - `GEMINI_API_KEY`: Your API key
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your Vercel Frontend URL
   - `PORT`: `3000`

Backend URL: `https://your-backend.onrender.com`

### Vercel (Frontend)

1. Import project from GitHub on [Vercel](https://vercel.app)
2. Configure root directory: `frontend`
3. Deploy (auto-deploys on Git push)

Frontend URL: `https://your-project.vercel.app`

### Update API URL

In `frontend/script.js`:
```javascript
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api/compare'
  : 'https://your-backend.onrender.com/api/compare';
```
---

## 📡 API Documentation

### Compare Endpoint

```http
POST /api/compare
```

**Rate Limits:**
- 10 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

**Request Body:**
```json
{
  "companyA": "Apple",
  "companyB": "Samsung",
  "model": "gemini-2.5-flash"
}
```

**Validation Rules:**
- `companyA` & `companyB`: Required, 2-100 characters, must contain letters
- `model`: Optional, must be in allowed list, defaults to `gemini-2.5-flash`

**Success Response (200):**
```json
{
  "success": true,
  "companyA": "Apple",
  "companyB": "Samsung",
  "model": "gemini-2.5-flash",
  "responseText": "| Attribute | Apple | Samsung |...",
  "timestamp": "2025-10-15T10:30:00.000Z"
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing input
{
  "error": "Both Company A and Company B are required"
}

// 400 Bad Request - Validation failed
{
  "error": "Company A name must be at least 2 characters long"
}

// 429 Too Many Requests - Rate limit exceeded
{
  "error": "You have made too many comparison requests...",
  "retryAfter": "15 minutes",
  "limit": 10
}

// 500 Internal Server Error - Configuration issue
{
  "error": "API key not configured on server"
}

// 503 Service Unavailable - Network issue
{
  "error": "Unable to reach Gemini API",
  "details": "Please check your internet connection"
}
```
---
### PDF Download Endpoint
```http
POST /api/download-pdf
```

**Rate Limits:**
- Same as comparison endpoint: 10 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

**Request Body:**
```json
{
  "companyA": "Apple",
  "companyB": "Samsung",
  "responseText": "| Attribute | Apple | Samsung |...",
  "model": "gemini-2.5-flash"
}
```

**Validation Rules:**
- `companyA` & `companyB`: Required for filename generation
- `responseText`: Required, contains the comparison markdown
- `model`: Optional, included in PDF metadata

**Success Response (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="Apple_vs_Samsung_Comparison.pdf"`
- Binary PDF file stream

**Error Responses:**
```json
// 400 Bad Request - Missing data
{
  "error": "Missing required data for PDF generation"
}

// 500 Internal Server Error - PDF generation failed
{
  "error": "Failed to generate PDF",
  "details": "Error message details"
}
```
**PDF Contents:**
- Title: "Competitor Comparison Analysis"
- Metadata: Generation timestamp and AI model used
- Company names being compared
- Comparison table formatted from markdown
- Summary section
- Footer with tool attribution

### Response Headers

All API responses include rate limit information:

```http
RateLimit-Limit: 10
RateLimit-Remaining: 7
RateLimit-Reset: 1697367000
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "uptime": 3600
}
```

**Use Case:** Monitoring, load balancer health checks

---

## 🔒 Security

### API Key Protection
- API key stored in environment variables (`.env` file)
- Never exposed in frontend or URLs
- Transmitted via secure HTTP headers
- Excluded from Git via `.gitignore`

### Input Validation
- Frontend: 8+ validation checks (length, patterns, XSS prevention)
- Backend: Model whitelist validation
- Safe error messages (no internal details exposed)

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Comparisons**: 10 requests per 15 minutes
- IP-based tracking
- Returns `429` when limit exceeded

### CORS Configuration
- Production: Restricted to Vercel frontend only
- Development: Allows all origins
- Uses `trust proxy` for accurate IP identification
- Prevents unauthorized API access

---

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```bash
GEMINI_API_KEY=AIzaSy...your_key
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Rate Limiting

Adjust in `backend/server.js`:
```javascript
// General API limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // requests
});

// Comparison endpoint limiter (stricter)
const comparisonLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10                     // comparisons
});
```

### CORS Configuration

Restrict API access to your frontend:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
```

### Model Configuration

Available models in `backend/server.js`:

```javascript
const allowedModels = [
  'gemini-2.5-pro',         // Most powerful, slower, higher cost
  'gemini-2.5-flash',       // Recommended balance
  'gemini-2.5-flash-lite',  // Fastest, lowest cost
  'gemini-2.0-flash',       // Previous generation
  'gemini-2.0-flash-lite'   // Ultra-fast legacy model
];
```
---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Cannot find module 'express'`
```bash
cd backend && npm install
```

**Error:** `Port 3000 already in use`
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
# Or use different port: PORT=3001 npm start
```

**Error:** `GEMINI_API_KEY is undefined`
```bash
# Create/verify .env file with API key
echo "GEMINI_API_KEY=your_actual_key" > backend/.env
```

### CORS Errors in Production

**Issue:** Frontend can't access backend

**Solutions:**
1. Verify `NODE_ENV=production` on Render
2. Check `CORS_ORIGIN` matches your Vercel URL exactly
3. Verify Render deployment is active
4. Check browser console for exact error

### Rate Limit Hit

**Response:** `429 Too Many Requests`

**Solutions:**
- Wait 15 minutes for limit to reset
- Each user gets separate quota (IP-based)
- Adjust limits if needed via rate limiter config

### Model Selection Not Working

**Issue:** Always uses default model

**Solutions:**
- Verify model name is in `allowedModels` array
- Check browser Network tab to see sent request
- Ensure correct model identifier (case-sensitive)

### PDF Download Issues

**Issue:** PDF download button not appearing

**Solutions:**
- Verify comparison completed successfully
- Check that results section is visible
- Refresh page and try comparison again

**Issue:** PDF download fails with error

**Solutions:**
- Check browser console for specific error message
- Verify backend `/api/download-pdf` endpoint is accessible
- Test with `curl` or Postman to isolate frontend vs backend issue
- Check Render logs for PDF generation errors

**Issue:** PDF downloads but is corrupted or won't open

**Solutions:**
- Verify `pdfkit` is installed: `npm list pdfkit` in backend
- Check that comparison data contains valid markdown
- Ensure no special characters breaking PDF generation
- Try with simpler company names (e.g., "Apple" vs "Google")

**Issue:** PDF missing content or formatting incorrect

**Solutions:**
- Verify markdown table parsing is working correctly
- Check that responseText contains both table and summary
- Test with different AI models to see if output format varies
- Review PDF generation function for parsing logic errors
---

## 🔄 How It Works

1. **User Input** → Frontend validates 8+ rules
2. **API Call** → Fetch request with company names plus selected model
3. **Backend Processing** → Validates input, selects model, performs rate checks
4. **Gemini API** → AI generates structured comparison with markdown formatting
5. **Response** → Markdown table received and parsed
6. **Rendering** → Frontend converts markdown to HTML table for display
7. **Display** → User sees comparison with summary on screen
8. **PDF Download** (Optional) → User clicks download button, backend generates formatted PDF with complete comparison data, file downloads to user's device
---

## 🚀 Key Implementations

### Security Measures
- ✅ API key in headers (not URL)
- ✅ Input validation at frontend & backend
- ✅ Rate limiting (IP-based)
- ✅ CORS restricted to Vercel
- ✅ Trust proxy configuration
- ✅ Model whitelist validation
- ✅ XSS prevention
- ✅ Safe error messages

### Performance
- ✅ Choose model based on speed/quality needs
- ✅ Smooth loading animations
- ✅ Responsive design (mobile-first)
- ✅ Markdown to HTML conversion
- ✅ Efficient request handling

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature/name`
5. Open Pull Request

---

## 📝 Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `GEMINI_API_KEY` | Yes | `AIzaSy...` | Google API key |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `production` | development or production |
| `CORS_ORIGIN` | No | `https://app.vercel.app` | Frontend URL for CORS |

---

## 📚 Learning Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/)
- [Google Gemini API](https://aistudio.google.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Support

**Issues:** Check [Troubleshooting](#-troubleshooting) section

**Questions:** 
- Review README and code comments
- Check Render/Vercel dashboards for logs
- Verify environment variables are set

**Report Bugs:**
- Check existing GitHub issues
- Create detailed bug report with:
  - Error message (exact text)
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment (local/production)

---

## 📄 License

MIT License © 2025 - See LICENSE file

**Summary:** Use, modify, and distribute freely (include license notice)

---

## ✅ Production Checklist

- [ ] All environment variables set on Render
- [ ] CORS_ORIGIN points to correct Vercel URL
- [ ] NODE_ENV set to production
- [ ] API key works and has quota available
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Comparisons work end-to-end
- [ ] Rate limiting tested (11th request blocked)
- [ ] Error messages appear correctly
- [ ] Logs monitored for issues

---

## 🎓 What You Learned

Building this project teaches:
- Full-stack web development
- Frontend-backend communication
- API integration
- Security best practices
- Rate limiting & protection
- Git & version control
- Deployment & DevOps
- Error handling & debugging

---

## 📊 Project Stats
```
Frontend:    ~350 lines (HTML/CSS/JS)  ← Updated
Backend:     ~250 lines (Node.js)      ← Updated
Total Code:  ~600 lines                ← Updated
Files:       6 main files
Dependencies: 6 (Node.js packages)     ← Updated
Status:      ✅ Production Ready
```
---

<div align="center">

**[🚀 Live App](https://simple-competitor-analysis-web-app.vercel.app)** | **[📖 Full Docs](#)** | **[⭐ Star on GitHub](#)**

Made with ❤️ for developers learning full-stack development

</div>