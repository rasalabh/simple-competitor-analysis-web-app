// Configuration
// Automatically detect if we're in development or production
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/compare'
  : 'https://simple-competitor-analysis-web-app.onrender.com/api/compare';

// Get DOM elements
const companyAInput = document.getElementById('companyA');
const companyBInput = document.getElementById('companyB');
const modelSelect = document.getElementById('modelSelect');
const compareBtn = document.getElementById('compareBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const comparisonTable = document.getElementById('comparisonTable');
const summaryContent = document.getElementById('summaryContent');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
let currentComparisonData = null;

// Event Listeners
compareBtn.addEventListener('click', handleCompare);
downloadPdfBtn.addEventListener('click', handleDownloadPDF);

// Allow Enter key to trigger comparison
companyAInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCompare();
});
companyBInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCompare();
});

// Main comparison function
async function handleCompare() {
    const companyA = companyAInput.value.trim();
    const companyB = companyBInput.value.trim();
    const selectedModel = modelSelect.value;

    // Comprehensive input validation
    const validationError = validateInputs(companyA, companyB);
    if (validationError) {
        showError(validationError);
        return;
    }

    // Reset UI
    hideError();
    hideResults();
    showLoading();
    disableButton();

    try {
        // Call backend API with selected model
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                companyA, 
                companyB,
                model: selectedModel 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to get comparison');
        }

        // Process and display results
        processResults(data.responseText, companyA, companyB);
        showResults();

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to compare companies. Please try again.');
    } finally {
        hideLoading();
        enableButton();
    }
}

// Process the Gemini API response
function processResults(responseText, companyA, companyB, model) {
    // Store for PDF download
    currentComparisonData = {
        companyA,
        companyB,
        responseText,
        model
    };
    // Split response into table and summary
    const parts = responseText.split(/\n\n+/);
    
    let tableMarkdown = '';
    let summaryText = '';
    
    // Find the table (starts with |)
    const tableStart = parts.findIndex(part => part.trim().startsWith('|'));
    
    if (tableStart !== -1) {
        // Extract table
        let tableEnd = tableStart;
        for (let i = tableStart; i < parts.length; i++) {
            if (parts[i].trim().startsWith('|')) {
                tableEnd = i;
            } else {
                break;
            }
        }
        
        tableMarkdown = parts.slice(tableStart, tableEnd + 1).join('\n');
        
        // Extract summary (everything after the table)
        summaryText = parts.slice(tableEnd + 1).join('\n\n').trim();
    } else {
        // If no table found, try to extract from the entire response
        const lines = responseText.split('\n');
        const tableLines = lines.filter(line => line.trim().startsWith('|'));
        tableMarkdown = tableLines.join('\n');
        
        // Get text that doesn't have table markers
        summaryText = lines
            .filter(line => !line.trim().startsWith('|') && line.trim())
            .join('\n')
            .trim();
    }

    // Convert markdown table to HTML
    const htmlTable = markdownTableToHTML(tableMarkdown);
    comparisonTable.innerHTML = htmlTable;

    // Display summary
    summaryContent.innerHTML = `<p>${summaryText || 'No summary available.'}</p>`;
}

async function handleDownloadPDF() {
    if (!currentComparisonData) {
        showError('No comparison data available to download');
        return;
    }

    try {
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.textContent = 'Generating PDF...';

        const response = await fetch(API_URL.replace('/compare', '/download-pdf'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentComparisonData)
        });

        if (!response.ok) {
            throw new Error('Failed to generate PDF');
        }

        // Get PDF blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentComparisonData.companyA}_vs_${currentComparisonData.companyB}_Comparison.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Reset button
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF Report
        `;

    } catch (error) {
        console.error('PDF download error:', error);
        showError('Failed to download PDF. Please try again.');
        
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF Report
        `;
    }
}

// Validate user inputs before making API call
function validateInputs(companyA, companyB) {
    // Check if both fields have values
    if (!companyA || !companyB) {
        return 'Please enter both company names to compare';
    }

    // Check minimum length (at least 2 characters)
    if (companyA.length < 2) {
        return 'Company A name must be at least 2 characters long';
    }
    if (companyB.length < 2) {
        return 'Company B name must be at least 2 characters long';
    }

    // Check maximum length (prevent extremely long inputs)
    if (companyA.length > 100) {
        return 'Company A name is too long (maximum 100 characters)';
    }
    if (companyB.length > 100) {
        return 'Company B name is too long (maximum 100 characters)';
    }

    // Check for only special characters or numbers (likely invalid)
    const validNamePattern = /[a-zA-Z]/;
    if (!validNamePattern.test(companyA)) {
        return 'Company A name must contain at least some letters';
    }
    if (!validNamePattern.test(companyB)) {
        return 'Company B name must contain at least some letters';
    }

    // Check if both companies are the same
    if (companyA.toLowerCase() === companyB.toLowerCase()) {
        return 'Please enter two different companies to compare';
    }

    // Check for common placeholder text
    const placeholders = ['company', 'example', 'test', 'placeholder', 'enter company'];
    const companyALower = companyA.toLowerCase();
    const companyBLower = companyB.toLowerCase();
    
    if (placeholders.includes(companyALower) || placeholders.includes(companyBLower)) {
        return 'Please enter real company names instead of placeholder text';
    }

    // Check for potentially malicious input (basic XSS prevention)
    const dangerousPattern = /<script|javascript:|onerror=|onclick=/i;
    if (dangerousPattern.test(companyA) || dangerousPattern.test(companyB)) {
        return 'Invalid characters detected in company names';
    }

    // All validations passed
    return null;
}

// Convert markdown table to HTML table
function markdownTableToHTML(markdown) {
    if (!markdown) return '<p>No table data available</p>';

    const lines = markdown.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return '<p>Invalid table format</p>';

    let html = '<table class="comparison-table"><thead><tr>';

    // Process header row
    const headers = lines[0].split('|').filter(cell => cell.trim());
    headers.forEach(header => {
        html += `<th>${header.trim()}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Skip the separator line (line with dashes)
    // Process data rows
    for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').filter(cell => cell.trim());
        if (cells.length > 0) {
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td>${cell.trim()}</td>`;
            });
            html += '</tr>';
        }
    }

    html += '</tbody></table>';
    return html;
}

// UI Helper Functions
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showResults() {
    resultsSection.style.display = 'block';
}

function hideResults() {
    resultsSection.style.display = 'none';
}

function disableButton() {
    compareBtn.disabled = true;
    compareBtn.textContent = 'Comparing...';
}

function enableButton() {
    compareBtn.disabled = false;
    compareBtn.textContent = 'Compare Now';
}