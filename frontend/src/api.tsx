import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from './store/store';

const baseUrl = 'http://3.132.230.10:3000';

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body
      })
    }),
    register: builder.mutation<
      { token: string },
      { username: string; password: string; idBytes: string; state: string }
    >({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body
      })
    }),
    listCandidatesForState: builder.query<
      { id: number; name: string; party: string }[],
      { state: string }
    >({
      query: ({state}) => ({
        url: '/api/candidates/' + state,
        method: 'GET'
      })
    }),
    addCandidate: builder.mutation<{id: number}, {candidateName: string; party: string; state: string}>({
      query: (body) => ({
        url: '/api/admin/candidate',
        method: 'POST',
        body
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useListCandidatesForStateQuery,
    useAddCandidateMutation
} = api;
