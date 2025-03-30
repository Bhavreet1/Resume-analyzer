import { useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import { motion } from "motion/react"

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  start: () => void;
  stop: () => void;
}

const SpeechRecorder = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("❌ Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continuous recording
    recognition.interimResults = true; // Live transcription
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setText(transcript.trim());
    };

    recognition.onerror = (event: { error: string }) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeSpeech = async () => {
    if (!text.trim()) {
      alert("❌ No speech detected. Please record first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5003/api/analyzeVoice", {
        speechText: text,
      });
      // Assuming the response is in the format: { jsonData: { confidence_level: [...], improvements: [...], Accuracy_level: value } }
      setAnalysis(res.data);
    } catch (error) {
      console.error("❌ Error in speech analysis:", error);
      setAnalysis({ jsonData: { confidence_level: [], improvements: [], Accuracy_level: "N/A" } });
    }
  };

  return (
    <div className="container mt-36 mb-20 d-flex flex-column align-items-center min-vh-100 justify-content-center bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-8">
      {/* Hero Section */}
      <div className="text-center mb-4">
        <h1 className="display-5 -mt-30 fw-bold text-black">
          <i className="bi bi-mic"></i> Speech Analyzer
        </h1>
        <p className="lead text-muted">
          Record your speech and get AI-powered analysis
        </p>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn btn-lg opacity-70 ${isRecording ? "btn-danger" : "btn-primary"} rounded-pill`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          <i className={`bi ${isRecording ? "bi-stop-circle" : "bi-mic"}`}></i>
          {isRecording ? " Stop Recording" : " Start Recording"}
        </button>

        <button
          className="btn btn-lg btn-success rounded-pill"
          onClick={analyzeSpeech}
          disabled={!text.trim()}
        >
          <i className="bi bi-graph-up"></i> Analyze
        </button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="d-flex align-items-center text-danger mb-3">
          <span className="spinner-grow spinner-grow-sm me-2"></span> Recording...
        </div>
      )}

      {/* Live Transcription */}
      <motion.div
        animate={{
          y: [0, -10, 10, 0], // Moves up and down continuously
        }}
        transition={{
          duration: 3, // Total time for one cycle
          repeat: Infinity,
          ease: "linear", // Ensures constant speed
        }}

        className="card shadow-lg mb-4 mt-7 w-75 rounded-full"
      >
        <div className="card-header bg-gradient-to-b from-[#6babff] to-[#08499dbe] opacity-70 text-white">
          <h5 className="mb-0">
            <i className="bi bi-text-paragraph"></i> Live Transcription
          </h5>
        </div>
        <div className="card-body" style={{ minHeight: "150px" }}>
          {text ? (
            <p className="lead">{text}</p>
          ) : (
            <div className="text-muted d-flex align-items-center justify-content-center h-100">
              <i className="bi bi-soundwave me-2"></i> No speech detected yet...
            </div>
          )}
        </div>
      </motion.div>

      {/* Analysis Result */}
      {analysis && analysis.jsonData && (
        <div className="card shadow-lg border-success w-75">
          <div className="card-header bg-success opacity-70 text-white">
            <h5 className="mb-0">
              <i className="bi bi-clipboard-data"></i> Analysis Results
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <h6>Confidence Level</h6>
              <ul className="list-group list-group-flush">
                {analysis.jsonData.confidence_level.map((item: string, index: number) => (
                  <li key={index} className="list-group-item">{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h6>Improvements</h6>
              <ul className="list-group list-group-flush">
                {analysis.jsonData.improvements.map((item: string, index: number) => (
                  <li key={index} className="list-group-item">{item}</li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h6>Accuracy Level</h6>
              <p>{analysis.jsonData.Accuracy_level}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-5 text-center text-muted">
        <small>
          <i className="bi bi-info-circle"></i> Click the microphone to start recording, then analyze your speech
        </small>
      </footer>
    </div>
  );
};

export default SpeechRecorder;
