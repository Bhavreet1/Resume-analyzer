import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import styled from 'styled-components';
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
// 🎯 Define types for analysis result
interface Analysis {
  ats_score: number;
  strengths: string[];
  mistakes: string[];
  suggestions: string[];
  message?: string;
}

const ResumeAnalyzer: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jdText, setJdText] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        const maxSize = 8 * 1024 * 1024; // 8MB limit
        
        if (file.size > maxSize) {
          toast.error("File size exceeds 8MB limit!");
          return;
        }
        
        setResume(file);
        toast.success("File uploaded successfully!");
      }
    },
    []
  );
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please upload a resume file!");
      return;
    }

    const allowedExtensions = ["pdf", "docx"];
    const fileExtension = resume.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error("Please upload a valid PDF or DOCX file!");
      return;
    }

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
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again!");
    } finally {
      setLoading(false);
    }
  }, [resume, jdText]);
  
  const renderAnalysisSection = useMemo(() => {
    if (!analysis) return null;

  return (
      <div className="w-1/2 space-y-4">
         {
            analysis.message &&(
              <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Message</h2>
                <p>{analysis.message}</p>
          </div>
            )
          }
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
        <div>

        </div>
      </div>
    );
  }, [analysis]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-[5rem] flex flex-col items-center justify-center min-h-screen"
    >
      <div className="mt-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ToastContainer />
          <div className="bg-transparent">
            <div className="hero-shape">
              <div className="hero-1"></div>
              <div className="hero-2"></div>
              <div className="hero-3"></div>
            </div>
            <div className="hero-shape-2">
              <div className="hero-1"></div>
              <div className="hero-2"></div>
              <div className="hero-3"></div>
            </div>

            <div className="top"></div>
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="title flex flex-col items-center top-10 gap-3"
            >
              <h1 className="text-5xl py-5 font-semibold z-10">
                AI-Powered Resume Analyzer
              </h1>
              <h3>Upload your resume and get AI-driven feedback to improve it!</h3>
            </motion.div>
            <div className="flex md:flex-row gap-80 py-36 sm:flex-col justify-center">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col gap-16"
              >
                <h1 className="text-center text-2xl font-medium">
                  Upload your resume:
                </h1>
                <div>
                  <StyledWrapper className="flex justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="container"
                    >
                      <div className="folder">
                        <div className="front-side">
                          <div className="tip" />
                          <div className="cover" />
                        </div>
                        <div className="back-side cover" />
                      </div>
                      <label className="custom-file-upload">
                        <input className="title" 
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.docx"
                        />
                        Choose a file [. pdf, .docx]
                      </label>
                    </motion.div>
                  </StyledWrapper>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col gap-16 items-center"
              >
                <h1 className="text-center text-2xl font-medium">
                  Upload your Job Description:
                </h1>
                <div className="flex flex-col items-center gap-7">
                  <StyledWrapper>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Enter your text..."
                      className="input"
                      name="text"
                      type="text"
                    />
                  </StyledWrapper>
                  <StyledWrapper>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-53"
                      type="submit"
                      disabled={loading || !resume}
                    >
                      <div className="original">Submit</div>
                      <div className="letters">
                        <span>S</span>
                        <span>U</span>
                        <span>B</span>
                        <span>M</span>
                        <span>I</span>
                        <span>T</span>
                      </div>
                    </motion.button>
                  </StyledWrapper>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="min-h-screen flex items-center justify-center relative"
      >
        {renderAnalysisSection}
      </motion.div>
    </motion.div>
  );
};

const StyledWrapper = styled.div`
  .container {
    width: 360px;
    height: 200px;
    --transition: 350ms;
    --folder-W: 120px;
    --folder-H: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: linear-gradient(135deg, #add8e6, #007bff);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height: calc(var(--folder-H) * 1.7);
    position: relative;
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 60px);
    animation: float 2.5s infinite ease-in-out;
    transition: transform var(--transition) ease;
  }

  .folder:hover {
    transform: scale(1.05);
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    z-index: 0;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }
  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side {
    z-index: 1;
  }

  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #9ec1e8, #5e9ee2);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #616161, #1e1e1e);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .custom-file-upload {
    font-size: 1.1em;
    color: #ffffff;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    // width: 100%;
    padding: 10px 35px;
    position: relative;
  }

  .custom-file-upload:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0px);
    }
  }

  .input {
    background-color: #212121;
    font-size: 1.4rem;
    width: 380px;
    height: 55px;
    padding: 10px;
    // border: 2px solid white;
    border-radius: 16px;
    color: white; /* Ensures the input text is white */
  }

  .input::placeholder {
    color: white; /* Changes placeholder text color to white */
    opacity: 0.7; /* Adjusts opacity if needed */
  }

  .input:focus {
    color: rgb(109, 166, 226);
    background-color: #212121;
    outline: none;
    // outline-color: rgb(109, 166, 226);
    box-shadow: -3px -3px 15px rgb(109, 166, 226); /* Updated box shadow color */
    transition: 0.1s;
    transition-property: box-shadow;
  }

  .btn-53,
  .btn-53 *,
  .btn-53 :after,
  .btn-53 :before,
  .btn-53:after,
  .btn-53:before {
    border: 0 solid;
    box-sizing: border-box;
  }

  .btn-53 {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: button;
    background-color: #dfecf5;
    border: 2px solid #b2d1e7;
    background-image: none;
    color: #212121;
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-size: 1.2rem; /* Reduced font size */
    line-height: 1.5;
    margin: 0;
    -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
    padding: 0;
  }

  .btn-53:disabled {
    cursor: default;
  }

  .btn-53:-moz-focusring {
    outline: auto;
  }

  .btn-53 svg {
    display: block;
    vertical-align: middle;
  }

  .btn-53 [hidden] {
    display: none;
  }

  .btn-53 {
    border-radius: 40px; /* Adjusted border-radius */
    box-sizing: border-box;
    display: block;
    font-weight: 900;
    overflow: hidden;
    padding: 0.4rem 2rem; /* Reduced padding */
    position: relative;
    text-transform: uppercase;
  }

  .btn-53 .original {
    background: linear-gradient(135deg, #add8e6, #007bff);
    color: rgba(255, 255, 255, 0.9);
    display: grid;
    font-weight: 700;
    inset: 0;
    place-content: center;
    position: absolute;
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1);
    font-size: 1.2rem; /* Ensure smaller text */
  }

  .btn-53:hover .original {
    transform: translateY(100%);
  }

  .btn-53 .letters {
    display: inline-flex;
  }

  .btn-53 span {
    opacity: 0;
    transform: translateY(-10px);
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.2s;
    font-size: 1.2rem; /* Reduce animation text size */
  }

  .btn-53 span:nth-child(2n) {
    transform: translateY(10px);
  }

  .btn-53:hover span {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-53:hover span:nth-child(2) {
    transition-delay: 0.1s;
  }

  .btn-53:hover span:nth-child(3) {
    transition-delay: 0.2s;
  }

  .btn-53:hover span:nth-child(4) {
    transition-delay: 0.3s;
  }

  .btn-53:hover span:nth-child(5) {
    transition-delay: 0.4s;
  }

  .btn-53:hover span:nth-child(6) {
    transition-delay: 0.5s;
  }
`;
export default ResumeAnalyzer;