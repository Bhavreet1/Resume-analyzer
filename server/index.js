require('dotenv').config();
// console.log('Gemini Key:', process.env.GEMINI_API_KEY?.substring(0, 5));
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyC0Jvxy_6zp86l6Is9k7_QH4IKqwVKoq2o");
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function extractTextFromFile(file) {
  if (file.mimetype === 'application/pdf') {
    const data = await pdf(file.buffer);
    return data.text;
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  return null;
}


app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const resumeFile = req.file;
    const jdText = req.body.jdText;

    const resumeText = await extractTextFromFile(resumeFile);

    // console.log("Resume Text:", resumeText);
    // console.log("Job Description Text:", jdText);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Analyze the following resume against the job description. Identify:(please ignore spelling mistakes correct it automatically)
      1. Strengths (What is good in the resume)
      2. Mistakes (Errors in grammar, missing sections, formatting issues)
      3. Suggestions (How to improve the resume)
      4. ATS Score (How well the resume matches the job description, give a percentage)

      Resume:
      "${resumeText}"

      Job Description:(make sure it is relavent i mean check the jdText that is is somehow related with the resume
      if not then check the resume all 4 details and also return message as unreleevnt and given text other wise only that strength and 
      mistakes suggestion and Ats Score only)
      "${jdText}"

      Return the output strictly in this JSON format:
      {
        "strengths": ["Point 1", "Point 2"],
        "mistakes": ["Point 1", "Point 2"],
        "suggestions": ["Point 1", "Point 2"],
        "ats_score": "XX%"
        if(unrelevent){
          than add a key here
          "message":"unrelevent text ${jdText}"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // console.log("Raw Gemini Response:", responseText);

    // Extract JSON from response
    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');
    let jsonData = {};

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      const jsonString = responseText.slice(jsonStartIndex, jsonEndIndex + 1);
      jsonData = JSON.parse(jsonString);
    }

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});
app.use('/api/analyzeVoice',async (req, res) => {
  try {
    const { speechText } = req.body;
    if (!speechText) {
      return res.status(400).json({ error: "Speech text is required" });
    }

    const prompt = `Analyze this speech: "${speechText}". Provide:
    1. Confidence level (0-100)
    2. Areas of improvement
    3. Accuracy level
    Format the response as JSON with keys: confidence, improvements, and accuracy.
    Return the output in this JSON format only:
    {
    "confidence_level": ["Point 1", "Point 2"],
    "improvements": ["Point 1", "Point 2"],
    "Accuracy_level": level
    }
`


    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Change this if nee
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');
    let jsonData = {};

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      const jsonString = responseText.slice(jsonStartIndex, jsonEndIndex + 1);
      jsonData = JSON.parse(jsonString);
    }
    // console.log(jsonData);
    res.status(200).json({jsonData});


  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// here is the resume  and job description you have to do these three things
//     1. Ats score batao job description se match krke
//     2.Analyze this resume against the job description. Identify missing skills, 
//     experience gaps, and suggest improvements. Use bullet points.
//     Be specific.
//     Resume: ${resumeText}\n\nJob Description: ${jdText}
//     3.give this data in the form of data json data and format in the terms of its keyboards means 
//     keyword should value  and answer is whatever you response related to that `