import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_ENDPOINT = "http://localhost:4000/results";

export const resultApi = createApi({
  reducerPath: "resultApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    createResult: builder.mutation({
      query: (newPost) => ({
        url: "/monu",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: newPost,
      }),
    }),
    getAllResults: builder.query({
      query: () => "/getall",
    }),
  }),
});

export const { useCreateResultMutation, useGetAllResultsQuery } = resultApi;
