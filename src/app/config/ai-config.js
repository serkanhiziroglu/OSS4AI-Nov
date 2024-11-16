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

export const generateCoverLetter = async (resume, jobDescription, stylePreferences, wordLimit = null) => {
  try {
    console.log('Starting cover letter generation');
    console.log('Style preferences:', stylePreferences);
    console.log('Word limit:', wordLimit);
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const getToneGuidance = (preferences) => {
      const { friendliness, professionalism } = preferences;
      if (friendliness > 75) {
        return `
          Use a warm, conversational tone that shows enthusiasm and personality:
          - Include personal anecdotes where relevant
          - Use more expressive language ("excited", "passionate", "love to")
          - Add personality traits and soft skills
          - Write longer, more detailed paragraphs
          - Include phrases that show eagerness ("I would be thrilled", "I'm excited about")
          - End with a warm, engaging closing
        `;
      } else if (professionalism > 75) {
        return `
          Use a formal, highly professional tone:
          - Focus strictly on qualifications and achievements
          - Use precise, business-focused language
          - Keep paragraphs concise and focused
          - Emphasize metrics and concrete results
          - Maintain formal language throughout
          - Use traditional business letter formatting
          - End with a formal, traditional closing
        `;
      } else {
        return `
          Balance professional content with a personable tone:
          - Mix achievement-focused content with personal enthusiasm
          - Use professional language with occasional warm phrases
          - Include both technical skills and some personality traits
          - Maintain moderate paragraph length
          - End with a professional but warm closing
        `;
      }
    };

    const wordLimitInstruction = wordLimit 
      ? `Strictly limit the cover letter to ${wordLimit} words, excluding the header and signature.`
      : 'Write a comprehensive cover letter of appropriate length.';
    
    const prompt = `
      Create a cover letter based on my resume and the job description.
      
      Style Instructions:
      ${getToneGuidance(stylePreferences)}
      
      Length Requirement:
      ${wordLimitInstruction}
      
      My Resume:
      ${resume}
      
      Job Description:
      ${jobDescription}
      
      Make sure to:
      1. Follow the specified tone style
      2. ${wordLimit ? `Keep the content within ${wordLimit} words` : 'Keep the length appropriate for a cover letter'}
      3. Match the experience with job requirements
      4. Include a proper header and signature
    `;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coverLetter = response.text();
    
    return coverLetter;
  } catch (err) {
    console.error('Cover letter generation failed:', err);
    throw err;
  }
};