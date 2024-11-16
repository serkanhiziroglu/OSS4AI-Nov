import { generateCoverLetter } from '../config/ai-config';

export const handleGenerate = async (
  resume, 
  jobDescription, 
  styleValue, 
  wordLimit, 
  setError, 
  setIsLoading, 
  setCoverLetter
) => {
  if (!resume.trim() || !jobDescription.trim()) {
    console.log('Missing required fields');
    setError('Please provide both resume and job description');
    return;
  }

  if (wordLimit && (wordLimit < 100 || wordLimit > 1000)) {
    setError('Word limit must be between 100 and 1000 words');
    return;
  }

  console.log('Starting cover letter generation process');
  setIsLoading(true);
  setError('');

  try {
    const stylePreferences = {
      friendliness: styleValue,
      professionalism: 100 - styleValue,
    };

    const generatedLetter = await generateCoverLetter(
      resume,
      jobDescription,
      stylePreferences,
      wordLimit
    );
    console.log('Cover letter generated successfully');
    setCoverLetter(generatedLetter);
  } catch (err) {
    console.error('Generation error:', err);
    setError('Failed to generate cover letter. Please try again.');
  } finally {
    setIsLoading(false);
    console.log('Generation process completed');
  }
};
