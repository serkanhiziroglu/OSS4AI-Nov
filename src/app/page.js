// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { extractTextFromPDF, generateCoverLetter } from './config/ai-config';
import { ResumeUpload } from './components/ResumeUpload';
import { JobDescription } from './components/JobDescription';
import { CoverLetterOutput } from './components/CoverLetterOutput';
import { ErrorMessage } from './components/ErrorMessage';
import { GenerateButton } from './components/GenerateButton';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleResumeUpload = async (event) => {
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

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      console.log('Missing required fields');
      setError('Please provide both resume and job description');
      return;
    }

    console.log('Starting cover letter generation process');
    setIsLoading(true);
    setError('');

    try {
      const generatedLetter = await generateCoverLetter(resume, jobDescription);
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

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Cover Letter Generator
        </h1>

        <div className="space-y-6">
          <ResumeUpload
            resume={resume}
            setResume={setResume}
            fileName={fileName}
            setFileName={setFileName}
            onFileUpload={handleResumeUpload}
          />

          <JobDescription
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />

          <ErrorMessage error={error} />

          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
          />

          <CoverLetterOutput
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}