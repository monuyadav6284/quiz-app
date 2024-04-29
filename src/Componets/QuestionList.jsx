import React, { useState, useEffect } from "react";
import { useGetAllQuestionQuery } from "../service/question";
import { useGetAllPostQuery } from "../service/post";
import { useCreateResultMutation } from "../service/result";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

function QuestionList() {
  const [lastUserId, setLastUserId] = useState(null);
  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
  } = useGetAllQuestionQuery();
  const {
    data: postData,
    error: postError,
    isLoading: isPostLoading,
  } = useGetAllPostQuery();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [createResult] = useCreateResultMutation();

  useEffect(() => {
    if (postData && postData.length > 0) {
      const lastPostIndex = postData.length - 1;
      const lastUserIdValue = postData[lastPostIndex]._id;
      setLastUserId(lastUserIdValue);
    }
  }, [postData]);

  const handleOptionChange = (questionId, option) => {
    if (submitDisabled) return;
    setSelectedOptions({ ...selectedOptions, [questionId]: option });
  };

  const handleResultSubmit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleConfirmSubmit = async () => {
    let correctCount = 0;
    questionData.forEach((question) => {
      const selectedOption = selectedOptions[question._id];
      if (selectedOption && selectedOption === question.correctAnswer) {
        correctCount++;
      }
    });
    setResult(`${correctCount} / ${questionData.length}`);
    setShowResults(true);
    setOpenDialog(false);
    setSubmitDisabled(true);

    try {
      await createResult({
        userId: lastUserId,
        result: correctCount,
      });
    } catch (error) {
      console.error("Error while creating result:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff4081",
      },
      secondary: {
        main: "#00bcd4",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    spacing: 8,
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="pl-28" style={{ backgroundColor: "pink" }}>
        {isQuestionLoading || isPostLoading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress size={60} />
          </div>
        ) : (
          <>
            {questionData &&
              questionData.map((question, index) => (
                <div key={question._id} className="mb-6">
                  <Typography variant="h5" className="mb-2">
                    Question {index + 1}: {question.question}
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="options"
                      name="options"
                      value={selectedOptions[question._id] || ""}
                      onChange={(event) =>
                        handleOptionChange(question._id, event.target.value)
                      }
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio disabled={submitDisabled} />}
                          label={option}
                          className="mb-2"
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>
              ))}
            <Button
              variant="contained"
              onClick={handleResultSubmit}
              className="mt-4"
              color="primary"
              disabled={submitDisabled}
            >
              Submit
            </Button>
            {showResults && (
              <Typography variant="h6" className="mt-4">
                Correct Answers: {result}
              </Typography>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to submit your answers?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default QuestionList;
