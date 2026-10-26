import { CreateUserData, CreateUserVariables, CreateQuizData, CreateQuizVariables, CreateQuestionData, CreateQuestionVariables, CreateAttemptData, CreateAttemptVariables, CreateFavoriteData, CreateFavoriteVariables, UpdateUserData, UpdateUserVariables, UpdateQuizData, UpdateQuizVariables, DeleteFavoriteData, DeleteFavoriteVariables, DeleteQuizData, DeleteQuizVariables, GetMyUserData, ListPublicQuizzesData, ListMyAttemptsData, GetQuizDetailsData, GetQuizDetailsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useCreateQuiz(options?: useDataConnectMutationOptions<CreateQuizData, FirebaseError, CreateQuizVariables>): UseDataConnectMutationResult<CreateQuizData, CreateQuizVariables>;
export function useCreateQuiz(dc: DataConnect, options?: useDataConnectMutationOptions<CreateQuizData, FirebaseError, CreateQuizVariables>): UseDataConnectMutationResult<CreateQuizData, CreateQuizVariables>;

export function useCreateQuestion(options?: useDataConnectMutationOptions<CreateQuestionData, FirebaseError, CreateQuestionVariables>): UseDataConnectMutationResult<CreateQuestionData, CreateQuestionVariables>;
export function useCreateQuestion(dc: DataConnect, options?: useDataConnectMutationOptions<CreateQuestionData, FirebaseError, CreateQuestionVariables>): UseDataConnectMutationResult<CreateQuestionData, CreateQuestionVariables>;

export function useCreateAttempt(options?: useDataConnectMutationOptions<CreateAttemptData, FirebaseError, CreateAttemptVariables>): UseDataConnectMutationResult<CreateAttemptData, CreateAttemptVariables>;
export function useCreateAttempt(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAttemptData, FirebaseError, CreateAttemptVariables>): UseDataConnectMutationResult<CreateAttemptData, CreateAttemptVariables>;

export function useCreateFavorite(options?: useDataConnectMutationOptions<CreateFavoriteData, FirebaseError, CreateFavoriteVariables>): UseDataConnectMutationResult<CreateFavoriteData, CreateFavoriteVariables>;
export function useCreateFavorite(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFavoriteData, FirebaseError, CreateFavoriteVariables>): UseDataConnectMutationResult<CreateFavoriteData, CreateFavoriteVariables>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useUpdateQuiz(options?: useDataConnectMutationOptions<UpdateQuizData, FirebaseError, UpdateQuizVariables>): UseDataConnectMutationResult<UpdateQuizData, UpdateQuizVariables>;
export function useUpdateQuiz(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateQuizData, FirebaseError, UpdateQuizVariables>): UseDataConnectMutationResult<UpdateQuizData, UpdateQuizVariables>;

export function useDeleteFavorite(options?: useDataConnectMutationOptions<DeleteFavoriteData, FirebaseError, DeleteFavoriteVariables>): UseDataConnectMutationResult<DeleteFavoriteData, DeleteFavoriteVariables>;
export function useDeleteFavorite(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteFavoriteData, FirebaseError, DeleteFavoriteVariables>): UseDataConnectMutationResult<DeleteFavoriteData, DeleteFavoriteVariables>;

export function useDeleteQuiz(options?: useDataConnectMutationOptions<DeleteQuizData, FirebaseError, DeleteQuizVariables>): UseDataConnectMutationResult<DeleteQuizData, DeleteQuizVariables>;
export function useDeleteQuiz(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteQuizData, FirebaseError, DeleteQuizVariables>): UseDataConnectMutationResult<DeleteQuizData, DeleteQuizVariables>;

export function useGetMyUser(options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;
export function useGetMyUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;

export function useListPublicQuizzes(options?: useDataConnectQueryOptions<ListPublicQuizzesData>): UseDataConnectQueryResult<ListPublicQuizzesData, undefined>;
export function useListPublicQuizzes(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicQuizzesData>): UseDataConnectQueryResult<ListPublicQuizzesData, undefined>;

export function useListMyAttempts(options?: useDataConnectQueryOptions<ListMyAttemptsData>): UseDataConnectQueryResult<ListMyAttemptsData, undefined>;
export function useListMyAttempts(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyAttemptsData>): UseDataConnectQueryResult<ListMyAttemptsData, undefined>;

export function useGetQuizDetails(vars: GetQuizDetailsVariables, options?: useDataConnectQueryOptions<GetQuizDetailsData>): UseDataConnectQueryResult<GetQuizDetailsData, GetQuizDetailsVariables>;
export function useGetQuizDetails(dc: DataConnect, vars: GetQuizDetailsVariables, options?: useDataConnectQueryOptions<GetQuizDetailsData>): UseDataConnectQueryResult<GetQuizDetailsData, GetQuizDetailsVariables>;
