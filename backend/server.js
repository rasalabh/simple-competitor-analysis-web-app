const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// More restrictive CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || 'https://simple-competitor-analysis-web-app.vercel.app'
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight requests for 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Trust proxy for accurate IP identification (required for rate limiting in production)
app.set('trust proxy', 1);

// Configure rate limiters with different strategies
// Comparison rate limit set to 10/15min based on:
// - Typical user makes 2-3 comparisons per session
// - 10 provides generous headroom for legitimate exploration
// - Protects against API quota abuse while maintaining usability
// - Can be adjusted based on monitoring and feedback

// General API rate limiter - applies to all API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    error: 'Too many requests from this IP address. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests that are very fast (under 1 second)
  skipSuccessfulRequests: false,
  // Skip failed requests
  skipFailedRequests: false,
});

// Stricter rate limiter specifically for the comparison endpoint
// This protects your Gemini API quota
const comparisonLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 comparison requests per 15 minutes
  message: {
    error: 'You have made too many comparison requests. Please wait before trying again.',
    retryAfter: '15 minutes',
    limit: 10,
    tip: 'This limit helps us provide reliable service to all users.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom handler to log when rate limit is hit
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'You have made too many comparison requests. Please wait before trying again.',
      retryAfter: '15 minutes',
      limit: 10
    });
  }
});

const PDFDocument = require('pdfkit');

// Function to generate PDF from comparison results
function generateComparisonPDF(companyA, companyB, responseText, model) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Title
  doc.fontSize(20)
    .font('Helvetica-Bold')
    .text('Competitor Comparison Analysis', { align: 'center' })
    .moveDown();

  // Metadata
  doc.fontSize(10)
    .font('Helvetica')
    .fillColor('#666')
    .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
    .text(`AI Model: ${model}`, { align: 'center' })
    .moveDown(2);

  // Companies being compared
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#000')
    .text(`${companyA} vs ${companyB}`, { align: 'center' })
    .moveDown(2);

  // Split response into table and summary
  const sections = responseText.split(/\n\n+/);
  let tableMarkdown = '';
  let summaryText = '';

  const tableStart = sections.findIndex(part => part.trim().startsWith('|'));
  if (tableStart !== -1) {
    let tableEnd = tableStart;
    for (let i = tableStart; i < sections.length; i++) {
      if (sections[i].trim().startsWith('|')) {
        tableEnd = i;
      } else {
        break;
      }
    }
    tableMarkdown = sections.slice(tableStart, tableEnd + 1).join('\n');
    summaryText = sections.slice(tableEnd + 1).join('\n\n').trim();
  }

  // Parse and render table
  if (tableMarkdown) {
    const lines = tableMarkdown.split('\n').filter(line => line.trim());

    // Table title
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Comparison Table', { underline: true })
      .moveDown();

    // Parse table rows
    const rows = lines.filter((line, idx) => idx !== 1); // Skip separator line

    rows.forEach((row, idx) => {
      const cells = row.split('|').filter(cell => cell.trim()).map(c => c.trim());

      if (idx === 0) {
        // Header row
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#4f46e5');
      } else {
        // Data rows
        doc.fontSize(9).font('Helvetica').fillColor('#000');
      }

      const cellWidth = 160;
      let xPosition = 50;

      cells.forEach((cell, cellIdx) => {
        doc.text(cell, xPosition, doc.y, {
          width: cellWidth,
          align: 'left'
        });
        xPosition += cellWidth + 10;
      });

      doc.moveDown(0.5);
    });
  }

  // Summary section
  if (summaryText) {
    doc.moveDown(2)
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000')
      .text('Summary', { underline: true })
      .moveDown()
      .fontSize(10)
      .font('Helvetica')
      .text(summaryText, {
        align: 'justify',
        lineGap: 5
      });
  }

  // Footer
  doc.fontSize(8)
    .fillColor('#999')
    .text(
      'Generated by AI-Powered Competitor Comparison Tool',
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

  return doc;
}

// Apply general rate limiter to all routes
app.use('/api/', generalLimiter);

// Health check endpoint (no rate limiting needed for health checks)
app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main comparison endpoint with strict rate limiting
app.post('/api/compare', comparisonLimiter, async (req, res) => {
  try {
    const { companyA, companyB, model, useWebSearch } = req.body;

    // Validate input
    if (!companyA || !companyB) {
      return res.status(400).json({
        error: 'Both Company A and Company B are required'
      });
    }

    // Whitelist of allowed models for security (stable versions only)
    const allowedModels = [
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite'
    ];

    // Validate and set model (default to gemini-2.5-flash if not provided or invalid)
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-2.5-flash';

    // Log which model is being used (helpful for debugging)
    console.log(`Using model: ${selectedModel} for comparison of ${companyA} vs ${companyB} (Web Search: ${useWebSearch})`);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'API key not configured on server'
      });
    }

    let searchContext = '';

    // Execute Web Search if requested
    if (useWebSearch) {
      console.log('Executing multi-query web search...');

      // Define the 3 queries for comprehensive coverage
      const queries = [
        `"${companyA}" vs "${companyB}" industry target market year founded CEO`,
        `"${companyA}" vs "${companyB}" market position funding status revenue`,
        `"${companyA}" vs "${companyB}" key products services notable achievements recent news`
      ];

      // Execute searches in parallel
      const searchResults = await Promise.all(queries.map(q => searchTavily(q)));

      // Format and combine results
      searchContext = searchResults
        .map((result, index) => {
          if (!result) return '';
          return `### Search Context Set ${index + 1} (Query: ${queries[index]})\n${formatSearchResults(result)}`;
        })
        .join('\n\n');

      console.log('Web search completed and context generated.');
    }

    // Prepare prompt for Gemini
    let prompt = `Role:
You are a professional business analyst with expertise in corporate research and competitive benchmarking.

Instruction:
Compare the two given companies: ${companyA} and ${companyB}.
`;

    if (useWebSearch && searchContext) {
      prompt += `
Context Data (Real-time Web Search Results):
${searchContext}

CRITICAL INSTRUCTION:
Use the above "Context Data" as your PRIMARY source of truth. It contains real-time information that supersedes your internal training data. 
- If the context provides specific numbers (revenue, funding), names (CEO), or recent events, USE THEM.
- If the context contradicts your internal knowledge, PRIORITIZE THE CONTEXT.
`;
    }

    prompt += `
Present your findings in a structured Markdown table with the following format:

| Attribute | ${companyA} | ${companyB} |
|-----------|-------------|-------------|
| Industry | [data] | [data] |
| Target Market | [data] | [data] |
| Year Founded | [data] | [data] |
| CEO | [data] | [data] |
| Market Position | [data] | [data] |
| Funding Status | [data] | [data] |
| Key Products or Services | [data] | [data] |
| Notable Achievements | [data] | [data] |

After the table, provide a brief summary paragraph (3-5 sentences) highlighting which company leads in more areas or has notable strengths.

Guardrails:
- If either ${companyA} or ${companyB} is invalid, not a real company, or cannot be found, respond ONLY with: "Unable to compare: One or both company names appear to be invalid or not found. Please verify the company names and try again."
- Do not hallucinate data. Only use publicly available or commonly known information.
- If data is unavailable or inconsistent across sources, write "Data Not Available" in that specific table cell.
- Keep the tone objective, factual, and non-opinionated.
- Ensure the output is a valid and clean Markdown table format with proper alignment.
- Do not add extra commentary outside the table and summary.`;

    // Call Gemini API with the selected model
    // Note: API key is now passed in header instead of URL for better security
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`;

    const geminiResponse = await axios.post(
      apiUrl,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        timeout: 60000 // Increased timeout to 60 seconds for search + generation
      }
    );

    // Extract the response text
    // The actual path might vary based on Gemini API version
    let responseText = '';

    if (geminiResponse.data.candidates &&
      geminiResponse.data.candidates[0] &&
      geminiResponse.data.candidates[0].content &&
      geminiResponse.data.candidates[0].content.parts) {
      responseText = geminiResponse.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }

    // Send back the response
    res.json({
      success: true,
      companyA,
      companyB,
      model: selectedModel,
      responseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /api/compare:', error.message);

    // Handle different types of errors
    if (error.response) {
      // Gemini API returned an error
      res.status(error.response.status).json({
        error: 'Failed to get comparison from Gemini API',
        details: error.response.data.error?.message || 'Unknown API error'
      });
    } else if (error.request) {
      // Request was made but no response received
      res.status(503).json({
        error: 'Unable to reach Gemini API',
        details: 'Please check your internet connection'
      });
    } else {
      // Something else went wrong
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

// PDF Download endpoint
app.post('/api/download-pdf', comparisonLimiter, async (req, res) => {
  try {
    const { companyA, companyB, responseText, model } = req.body;

    // Validate input
    if (!companyA || !companyB || !responseText) {
      return res.status(400).json({
        error: 'Missing required data for PDF generation'
      });
    }

    // Generate PDF
    const doc = generateComparisonPDF(companyA, companyB, responseText, model);

    // Set response headers
    const filename = `${companyA}_vs_${companyB}_Comparison.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);
    doc.end();

    console.log(`PDF generated: ${filename}`);

  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('Rate limiting enabled:');
  console.log('  - General API: 100 requests per 15 minutes');
  console.log('  - Comparisons: 10 requests per 15 minutes');
});

// Tavily Search Function
async function searchTavily(query) {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      search_depth: "advanced",
      include_answer: "advanced",
      include_raw_content: "text",
      max_results: 3,
      exclude_domains: ["www.linkedin.com"]
    });
    return response.data;
  } catch (error) {
    console.error('Tavily Search Error:', error.message);
    return null; // Return null on error to allow fallback
  }
}

// Helper to format search results for Gemini
function formatSearchResults(results) {
  if (!results || !results.results) return '';

  let formatted = '';

  // Add the direct answer if available
  if (results.answer) {
    formatted += `Direct Answer: ${results.answer}\n\n`;
  }

  // Add individual search results
  results.results.forEach((result, index) => {
    formatted += `Source ${index + 1}: ${result.title}\n`;
    formatted += `URL: ${result.url}\n`;
    formatted += `Content: ${result.content}\n`;
    if (result.raw_content) {
      formatted += `Raw Content: ${result.raw_content.substring(0, 500)}...\n`; // Truncate raw content
    }
    formatted += '---\n';
  });

  return formatted;
}