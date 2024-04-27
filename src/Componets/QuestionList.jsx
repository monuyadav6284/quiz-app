import React, { useState } from "react";
import { useGetAllQuestionQuery } from "../service/question";
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

function QuestionList() {
  const { data, isLoading, isError } = useGetAllQuestionQuery();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions({ ...selectedOptions, [questionId]: option });
  };

  const handleResultSubmit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmSubmit = () => {
    setShowResults(true);
    setOpenDialog(false);
  };

  const calculateResult = () => {
    let correctCount = 0;
    data.forEach((question) => {
      if (selectedOptions[question._id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
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
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress size={60} />
          </div>
        ) : (
          <>
            {data &&
              data.map((question, index) => (
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
                          control={<Radio />}
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
            >
              Submit
            </Button>
            {showResults && (
              <Typography variant="h6" className="mt-4">
                Correct Answers: {calculateResult()} / {data.length}
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
