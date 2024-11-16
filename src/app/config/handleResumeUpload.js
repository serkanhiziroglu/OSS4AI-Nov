import { extractTextFromPDF } from '../config/ai-config';

export const handleResumeUpload = async (event, setFileName, setError, setResume) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size, 'bytes');
    setFileName(file.name);
    setError('');

    let text;
    if (file.type === 'application/pdf') {
      console.log('Processing PDF file');
      text = await extractTextFromPDF(file);
    } else if (file.type === 'text/plain') {
      console.log('Processing text file');
      text = await file.text();
    } else {
      throw new Error('Please upload a PDF or text file');
    }

    console.log('File processed successfully. Text length:', text.length, 'characters');
    setResume(text);
  } catch (err) {
    console.error('File processing error:', err);
    setError(err.message || 'Error reading file. Please try again.');
  }
};
