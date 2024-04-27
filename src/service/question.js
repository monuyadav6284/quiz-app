import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_ENDPOINT = "http://localhost:4000/question";

export const questionApi = createApi({
  reducerPath: "questionApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getAllQuestion: builder.query({
      query: () => "/get",
    }),
    createQuestion: builder.mutation({
      query: async (newPost) => {
        try {
          const response = await fetch(`${API_ENDPOINT}/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
          });

          if (!response.ok) {
            throw new Error("Failed to create post");
          }

          return response.json();
        } catch (error) {
          throw new Error(`Error creating post: ${error.message}`);
        }
      },
    }),
    updateQuestion: builder.mutation({
      query: async ({ id, ...updatedPost }) => {
        const url = `${API_ENDPOINT}/update/${id}`;

        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPost),
          });

          if (!response.ok) {
            throw new Error("Failed to update post");
          }

          return response.json();
        } catch (error) {
          throw new Error(`Error updating post: ${error.message}`);
        }
      },
    }),
    deleteQuestion: builder.mutation({
      query: async (id) => {
        const url = `${API_ENDPOINT}/delete/${id}`;

        try {
          const response = await fetch(url, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete question");
          }

          return response.json();
        } catch (error) {
          throw new Error(`Error deleting question: ${error.message}`);
        }
      },
    }),
  }),
});

export const {
  useGetAllQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
