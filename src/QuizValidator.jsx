import React, { useState } from "react";
import mammoth from "mammoth";
import {
  AlertCircleIcon,
  CheckCheckIcon,
  Upload,
  RefreshCw,
  FileTextIcon,
} from "lucide-react";

const QuizValidator = ({ onQuizDataReady }) => {
  const [file, setFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setValidationErrors([]);

    if (selectedFile) {
      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFilePreview(`DOCX File: ${selectedFile.name}`);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setFilePreview(
            content.slice(0, 200) + (content.length > 50 ? "..." : "")
          );
        };
        reader.readAsText(selectedFile);
      }
    } else {
      setFilePreview("");
    }
  };

  const reloadAndValidate = () => {
    setValidationErrors([]);
    validateFile();
  };

  const clearFile = () => {
    setFile(null);
    setValidationErrors([]);
    setFilePreview("");
  };

  const validateFile = async () => {
    if (!file) return;
    setIsLoading(true);

    if (file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const quizData = parseDocxToFormattedQuestions(result.value);
        onQuizDataReady(quizData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        const errors = validateQuizContent(content);
        if (errors.length === 0) {
          const quizData = parseFormattedQuestions(content);
          onQuizDataReady(quizData);
        }
        setValidationErrors(errors);
      };
      reader.readAsText(file);
    }
    setIsLoading(false);
  };

  const validateQuizContent = (content) => {
    const errors = [];

    if (!content) {
      errors.push("The file is empty or could not be read");
      return errors;
    }

    const lines = content.split("\n").map((line) => line.trim());

    if (!lines[0].startsWith("guidelines:")) {
      errors.push("The first line must contain guidelines");
    }

    let currentCourse = null;
    let currentSection = null;
    let questionCount = 0;
    let inSection = false;

    lines.forEach((line, index) => {
      if (line.startsWith("course:")) {
        currentCourse = line.replace("course:", "").trim();

        if (/\s/.test(currentCourse)) {
          errors.push(
            `Course name should not contain spaces at line ${index + 1}`
          );
        }

        if (!currentCourse) {
          errors.push(`Course name is missing at line ${index + 1}`);
        }

        currentSection = null;
        inSection = false;
      }

      if (line.startsWith("section:")) {
        if (!currentCourse) {
          errors.push(`Section found without a course at line ${index + 1}`);
        }
        currentSection = true;
        questionCount = 0;
        inSection = true;
      }

      if (line.startsWith("instruction:") && !inSection) {
        errors.push(
          `Instruction found before section declaration at line ${index + 1}`
        );
      }

      if (line.startsWith("passage:") && !inSection) {
        errors.push(
          `Passage found before section declaration at line ${index + 1}`
        );
      }

      if (line.startsWith("Question:")) {
        if (!inSection) {
          errors.push(`Question found outside a section at line ${index + 1}`);
        } else {
          questionCount++;
        }

        let optionCount = 0;
        let hasContent = false;
        let hasAnswer = false;

        for (let i = index + 1; i < lines.length; i++) {
          const questionLine = lines[i].trim();

          if (questionLine.startsWith("Content:")) {
            hasContent = true;
          } else if (questionLine.startsWith("Option:")) {
            optionCount++;
          } else if (questionLine.startsWith("Answer:")) {
            hasAnswer = true;
            optionCount++;
          } else if (
            questionLine.startsWith("Question:") ||
            questionLine.startsWith("section:") ||
            questionLine.startsWith("course:")
          ) {
            break;
          }
        }

        if (!hasContent) {
          errors.push(
            `Error in question ${questionCount} at line ${
              index + 1
            }: Missing Content`
          );
        }
        if (optionCount !== 4) {
          errors.push(
            `Error in question ${questionCount} at line ${
              index + 1
            }: Expected 3 options and 1 answer, found ${optionCount}`
          );
        }
        if (!hasAnswer) {
          errors.push(
            `Error in question ${questionCount} at line ${
              index + 1
            }: Missing Answer`
          );
        }
      }

      if (
        currentSection &&
        questionCount === 0 &&
        (line.startsWith("course:") || index === lines.length - 1)
      ) {
        errors.push(`Section at line ${index + 1} has no questions`);
      }
    });

    if (!currentCourse) {
      errors.push("No course found in the file");
    }

    if (!currentSection) {
      errors.push("No section found under the course");
    }

    return errors;
  };

  const parseFormattedQuestions = (content) => {
    const lines = content.split("\n").map((line) => line.trim());
    const questions = [];
    let currentCourse = "";
    let currentSection = "";
    let currentInstruction = "";
    let currentPassage = "";
    let currentQuestion = null;

    lines.forEach((line) => {
      if (line.startsWith("course:")) {
        currentCourse = line.replace("course:", "").trim();
      } else if (line.startsWith("section:")) {
        currentSection = line.replace("section:", "").trim();
        currentInstruction = "";
        currentPassage = "";
      } else if (line.startsWith("instruction:")) {
        currentInstruction = line.replace("instruction:", "").trim();
      } else if (line.startsWith("passage:")) {
        currentPassage = line.replace("passage:", "").trim();
      } else if (line.startsWith("Question:")) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          content: "",
          options: [],
          answer: "",
          course: currentCourse,
          section: currentSection,
          instruction: currentInstruction,
          passage: currentPassage,
        };
      } else if (currentQuestion) {
        if (line.startsWith("Content:")) {
          currentQuestion.content = line.replace("Content:", "").trim();
        } else if (line.startsWith("Option:")) {
          currentQuestion.options.push(line.replace("Option:", "").trim());
        } else if (line.startsWith("Answer:")) {
          const answer = line.replace("Answer:", "").trim();
          currentQuestion.options.push(answer);
          currentQuestion.answer = answer;
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  const parseDocxToFormattedQuestions = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const questions = [];
    let currentQuestion = {};

    doc.body.innerHTML.split(/<p[^>]*>|<\/p>/).forEach((line) => {
      line = line.trim();
      if (!line) return;

      if (line.match(/^Question\s*\d+:/i)) {
        if (Object.keys(currentQuestion).length > 0) {
          questions.push(currentQuestion);
        }
        currentQuestion = {};
      } else if (line.startsWith("Content:")) {
        currentQuestion.content = line.replace("Content:", "").trim();
      } else if (line.match(/^Option\s*\d+:/i)) {
        if (!currentQuestion.options) currentQuestion.options = [];
        currentQuestion.options.push(
          line.replace(/^Option\s*\d+:/i, "").trim()
        );
      } else if (line.startsWith("Answer:")) {
        currentQuestion.answer = line.replace("Answer:", "").trim();
      }
    });

    if (Object.keys(currentQuestion).length > 0) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Quiz Validator
      </h2>

      <label className="flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-md mb-6 cursor-pointer hover:border-blue-400 transition">
        <Upload className="text-4xl text-gray-500 mb-2" />
        <span className="text-sm font-semibold text-gray-600">
          Upload .txt or .docx file
        </span>
        <input
          type="file"
          accept=".txt,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-4 mb-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
            <FileTextIcon className="mr-2" />
            Uploaded File
          </h3>
          <p className="text-sm text-gray-600 break-words">{filePreview}</p>
        </div>
      )}

      <button
        className={`w-fit bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={validateFile}
        disabled={isLoading}
      >
        {isLoading ? "Validating..." : "Validate & View"}
      </button>

      {file && (
        <div className="mt-4 flex justify-center">
          <button
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md mr-2 flex"
            onClick={reloadAndValidate}
          >
            <RefreshCw className="mr-2" />
            Reload and Validate
          </button>
          <button
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md"
            onClick={clearFile}
          >
            Clear File
          </button>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mt-4">
          <div className="text-red-500 rounded-md p-4">
            <AlertCircleIcon className="inline mr-2" />
            <span className="font-semibold">Errors found:</span>
            <ul className="mt-2">
              {validationErrors.map((error, index) => (
                <li
                  key={index}
                  className="text-sm text-white font-semibold bg-red-700 my-1 text-start p-2"
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {file && !validationErrors.length && !isLoading && (
        <div className="mt-4 p-4 bg-green-50 border border-green-400 text-green-700 rounded-md">
          <CheckCheckIcon className="inline mr-2" />
          File successfully validated!
        </div>
      )}
    </div>
  );
};

export default QuizValidator;
