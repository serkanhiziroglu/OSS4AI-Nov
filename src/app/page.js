'use client';

import { useState } from 'react';
import { handleResumeUpload } from './config/handleResumeUpload';
import { handleGenerate } from './config/handleGenerate';
import { handleDownload } from './config/handleDownload';
import { handleWordLimitChange } from './config/handleWordLimitChange';

import { ResumeUpload } from './components/ResumeUpload';
import { JobDescription } from './components/JobDescription';
import { CoverLetterOutput } from './components/CoverLetterOutput';
import { ErrorMessage } from './components/ErrorMessage';
import { GenerateButton } from './components/GenerateButton';
import { StyleControls } from './components/StyleControls';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [styleValue, setStyleValue] = useState(50);
  const [wordLimit, setWordLimit] = useState(null);

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
            onFileUpload={(event) => 
              handleResumeUpload(event, setFileName, setError, setResume)
            }
          />

          <JobDescription
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />

          <StyleControls 
            styleValue={styleValue}
            onStyleChange={setStyleValue}
            wordLimit={wordLimit}
            onWordLimitChange={(value) => 
              handleWordLimitChange(value, setWordLimit, setError)
            }
          />

          <ErrorMessage error={error} />

          <GenerateButton
            onClick={() => 
              handleGenerate(
                resume,
                jobDescription,
                styleValue,
                wordLimit,
                setError,
                setIsLoading,
                setCoverLetter
              )
            }
            isLoading={isLoading}
          />

          <CoverLetterOutput
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            onDownload={() => handleDownload(coverLetter)}
          />
        </div>
      </div>
    </div>
  );
}
