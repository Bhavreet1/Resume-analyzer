import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";

// 🎯 Define types for analysis result
interface Analysis {
  ats_score: number;
  strengths: string[];
  mistakes: string[];
  suggestions: string[];
}

const ResumeAnalyzer: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setResume(e.target.files[0]);
      }
    },
    []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resume) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jdText", jdText);

    try {
      const response = await axios.post<Analysis>(
        "http://localhost:5003/api/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [resume, jdText]);

  const renderAnalysisSection = useMemo(() => {
    if (!analysis) return null;

    return (
      <div className="w-1/2 space-y-4">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">ATS Score</h2>
          <h2>{analysis.ats_score}</h2>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Strengths</h2>
          <ul className="list-disc list-inside text-gray-700">
            {analysis.strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Mistakes</h2>
          <ul className="list-disc list-inside text-gray-700">
            {analysis.mistakes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
          <ul className="list-disc list-inside text-gray-700">
            {analysis.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }, [analysis]);

  return (
    <div className="flex h-full mt-20 bg-gray-100 p-6">
      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Resume Analyzer</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Upload Resume (PDF/DOCX)</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.docx"
              className="mt-2 p-2 border rounded w-full"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Enter Job Description</h3>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={6}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter job description here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !resume}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {renderAnalysisSection}
    </div>
  );
};

export default ResumeAnalyzer;
