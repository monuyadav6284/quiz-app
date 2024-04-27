import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_ENDPOINT = "http://localhost:4000/user";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: () => "/get",
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/post",
        method: "POST",
        body: newPost,
      }),
    }),
  }),
});

export const { useGetAllPostQuery, useCreatePostMutation } = postApi;
