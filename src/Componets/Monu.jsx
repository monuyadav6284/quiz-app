import React, { useState, useEffect } from "react";
import {
  useGetAllQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "../service/question";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Monu() {
  const { data, isLoading, refetch } = useGetAllQuestionQuery();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editedQuestionId, setEditedQuestionId] = useState(null);
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions({ ...selectedOptions, [questionId]: option });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddQuestion = async () => {
    if (!options.includes(correctAnswer)) {
      toast.error("Invalid correct answer!");
      return;
    }

    try {
      if (editedQuestionId) {
        await updateQuestion({
          id: editedQuestionId,
          question,
          options,
          correctAnswer,
        });
        setEditedQuestionId(null);
        toast.success("Question updated!");
      } else {
        await createQuestion({
          question,
          options,
          correctAnswer,
        });
        toast.success("Question added successfully!");
      }
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setOpenDialog(false);
      refetch(); // Refresh the data after adding or updating a question
    } catch (error) {
      console.error(
        editedQuestionId
          ? "Error updating question:"
          : "Error creating question:",
        error
      );
      toast.error(
        editedQuestionId
          ? "Failed to update question"
          : "Failed to create question"
      );
    }
  };

  const handleEditQuestion = (question) => {
    setQuestion(question.question);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);
    setEditedQuestionId(question._id);
    setOpenDialog(true);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestionToDelete(questionId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteQuestion(questionToDelete);
      toast.success("Question deleted successfully!");
      setDeleteConfirmationOpen(false);
      refetch(); // Refresh the data after deleting a question
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
      setDeleteConfirmationOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      <main className="pl-28">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress size={60} />
          </div>
        ) : (
          <>
            {data &&
              data.map((question, index) => (
                <div
                  key={question._id}
                  className="mb-6"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginRight: "1rem",
                  }}
                >
                  <div>
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
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditQuestion(question)}
                      style={{ marginRight: "1rem" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteQuestion(question._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Question</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this question?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editedQuestionId ? "Edit Question" : "Add Question"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="question"
            label="Question"
            type="text"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((option, index) => (
            <TextField
              key={index}
              margin="dense"
              id={`option-${index}`}
              label={`Option ${index + 1}`}
              type="text"
              fullWidth
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}
          <TextField
            margin="dense"
            id="correctAnswer"
            label="Correct Answer"
            type="text"
            fullWidth
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddQuestion} color="primary">
            {editedQuestionId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ position: "fixed", bottom: 20, right: 20 }}
      >
        Add Question
      </Button>
    </>
  );
}

export default Monu;
