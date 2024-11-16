// config/ai-config.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Initialize Google AI
export const genAI = new GoogleGenerativeAI('AIzaSyA_6qOLVjn20z4dMEn0YBnQbmec62ZwS8U');

// Helper function to get text from a single page
async function getPageText(pdf, pageNum) {
  try {
    console.log(`Processing page ${pageNum}/${pdf.numPages}`);
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Sort items by their vertical position (y coordinate)
    const sortedItems = textContent.items.sort((a, b) => {
      // Compare y coordinates first (for different lines)
      if (Math.abs(b.transform[5] - a.transform[5]) > 5) {
        return b.transform[5] - a.transform[5];
      }
      // If y coordinates are similar, compare x coordinates (for same line)
      return a.transform[4] - b.transform[4];
    });
    
    return sortedItems.map(item => item.str).join(' ');
  } catch (err) {
    console.error(`Error processing page ${pageNum}:`, err);
    throw err;
  }
}

// Utility function for PDF extraction
export const extractTextFromPDF = async (file) => {
  try {
    console.log('Starting PDF extraction for file:', file.name);
    const startTime = performance.now();
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const pagePromises = [];
    
    console.log(`PDF loaded successfully. Processing ${numPages} pages...`);
    
    // Create array of promises for each page
    for (let i = 1; i <= numPages; i++) {
      pagePromises.push(getPageText(pdf, i));
    }
    
    // Wait for all pages to be processed in order
    const pageTexts = await Promise.all(pagePromises);
    const fullText = pageTexts.join('\n\n');
    
    const endTime = performance.now();
    console.log(`PDF extraction completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return fullText.trim();
  } catch (err) {
    console.error('PDF extraction failed:', err);
    throw new Error('Failed to read PDF file');
  }
};

export const generateCoverLetter = async (resume, jobDescription) => {
  try {
    console.log('Starting cover letter generation');
    console.log('Resume length:', resume.length, 'characters');
    console.log('Job description length:', jobDescription.length, 'characters');
    
    const startTime = performance.now();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Create a professional cover letter based on my resume and the job description.
      
      My Resume:
      ${resume}
      
      Job Description:
      ${jobDescription}
      
      Please write a compelling cover letter that:
      1. Matches my experience with job requirements
      2. Highlights relevant skills and achievements
      3. Shows enthusiasm for the role
      4. Uses a professional tone
      5. Is properly formatted with today's date
      
      Format the letter professionally with proper spacing and paragraphs.
      Include a proper header with today's date and addressing format.
    `;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coverLetter = response.text();
    
    const endTime = performance.now();
    console.log(`Cover letter generated successfully in ${(endTime - startTime).toFixed(2)}ms`);
    console.log('Generated cover letter length:', coverLetter.length, 'characters');
    
    return coverLetter;
  } catch (err) {
    console.error('Cover letter generation failed:', err);
    throw err;
  }
};