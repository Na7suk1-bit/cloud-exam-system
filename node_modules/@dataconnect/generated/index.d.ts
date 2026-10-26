import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Attempt_Key {
  id: UUIDString;
  __typename?: 'Attempt_Key';
}

export interface CreateAttemptData {
  attempt_insert: Attempt_Key;
}

export interface CreateAttemptVariables {
  quizId: UUIDString;
  score: number;
}

export interface CreateFavoriteData {
  favorite_insert: Favorite_Key;
}

export interface CreateFavoriteVariables {
  quizId: UUIDString;
}

export interface CreateQuestionData {
  question_insert: Question_Key;
}

export interface CreateQuestionVariables {
  quizId: UUIDString;
  text: string;
  correctAnswer: string;
  options: string;
  pointValue?: number | null;
}

export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}

export interface CreateQuizVariables {
  title: string;
  category: string;
  description?: string | null;
  isPublic?: boolean | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  username: string;
  email: string;
}

export interface DeleteFavoriteData {
  favorite_deleteMany: number;
}

export interface DeleteFavoriteVariables {
  quizId: UUIDString;
}

export interface DeleteQuizData {
  quiz_delete?: Quiz_Key | null;
}

export interface DeleteQuizVariables {
  id: UUIDString;
}

export interface Favorite_Key {
  id: UUIDString;
  __typename?: 'Favorite_Key';
}

export interface GetMyUserData {
  user?: {
    username: string;
    email: string;
  };
}

export interface GetQuizDetailsData {
  quiz?: {
    title: string;
    description?: string | null;
    questions_on_quiz: ({
      text: string;
      options: string;
    })[];
  };
}

export interface GetQuizDetailsVariables {
  id: UUIDString;
}

export interface ListMyAttemptsData {
  attempts: ({
    score: number;
    quiz: {
      title: string;
    };
  })[];
}

export interface ListPublicQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    category: string;
  } & Quiz_Key)[];
}

export interface Question_Key {
  id: UUIDString;
  __typename?: 'Question_Key';
}

export interface Quiz_Key {
  id: UUIDString;
  __typename?: 'Quiz_Key';
}

export interface UpdateQuizData {
  quiz_update?: Quiz_Key | null;
}

export interface UpdateQuizVariables {
  id: UUIDString;
  title?: string | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  username?: string | null;
  email?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
  operationName: string;
}
export const createQuizRef: CreateQuizRef;

export function createQuiz(vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;
export function createQuiz(dc: DataConnect, vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
  operationName: string;
}
export const createQuestionRef: CreateQuestionRef;

export function createQuestion(vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;
export function createQuestion(dc: DataConnect, vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAttemptVariables): MutationRef<CreateAttemptData, CreateAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAttemptVariables): MutationRef<CreateAttemptData, CreateAttemptVariables>;
  operationName: string;
}
export const createAttemptRef: CreateAttemptRef;

export function createAttempt(vars: CreateAttemptVariables): MutationPromise<CreateAttemptData, CreateAttemptVariables>;
export function createAttempt(dc: DataConnect, vars: CreateAttemptVariables): MutationPromise<CreateAttemptData, CreateAttemptVariables>;

interface CreateFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFavoriteVariables): MutationRef<CreateFavoriteData, CreateFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFavoriteVariables): MutationRef<CreateFavoriteData, CreateFavoriteVariables>;
  operationName: string;
}
export const createFavoriteRef: CreateFavoriteRef;

export function createFavorite(vars: CreateFavoriteVariables): MutationPromise<CreateFavoriteData, CreateFavoriteVariables>;
export function createFavorite(dc: DataConnect, vars: CreateFavoriteVariables): MutationPromise<CreateFavoriteData, CreateFavoriteVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
  operationName: string;
}
export const updateQuizRef: UpdateQuizRef;

export function updateQuiz(vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;
export function updateQuiz(dc: DataConnect, vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;

interface DeleteFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFavoriteVariables): MutationRef<DeleteFavoriteData, DeleteFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFavoriteVariables): MutationRef<DeleteFavoriteData, DeleteFavoriteVariables>;
  operationName: string;
}
export const deleteFavoriteRef: DeleteFavoriteRef;

export function deleteFavorite(vars: DeleteFavoriteVariables): MutationPromise<DeleteFavoriteData, DeleteFavoriteVariables>;
export function deleteFavorite(dc: DataConnect, vars: DeleteFavoriteVariables): MutationPromise<DeleteFavoriteData, DeleteFavoriteVariables>;

interface DeleteQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
  operationName: string;
}
export const deleteQuizRef: DeleteQuizRef;

export function deleteQuiz(vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;
export function deleteQuiz(dc: DataConnect, vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface GetMyUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyUserData, undefined>;
  operationName: string;
}
export const getMyUserRef: GetMyUserRef;

export function getMyUser(options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;
export function getMyUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface ListPublicQuizzesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicQuizzesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicQuizzesData, undefined>;
  operationName: string;
}
export const listPublicQuizzesRef: ListPublicQuizzesRef;

export function listPublicQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListPublicQuizzesData, undefined>;
export function listPublicQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicQuizzesData, undefined>;

interface ListMyAttemptsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAttemptsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyAttemptsData, undefined>;
  operationName: string;
}
export const listMyAttemptsRef: ListMyAttemptsRef;

export function listMyAttempts(options?: ExecuteQueryOptions): QueryPromise<ListMyAttemptsData, undefined>;
export function listMyAttempts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAttemptsData, undefined>;

interface GetQuizDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizDetailsVariables): QueryRef<GetQuizDetailsData, GetQuizDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuizDetailsVariables): QueryRef<GetQuizDetailsData, GetQuizDetailsVariables>;
  operationName: string;
}
export const getQuizDetailsRef: GetQuizDetailsRef;

export function getQuizDetails(vars: GetQuizDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizDetailsData, GetQuizDetailsVariables>;
export function getQuizDetails(dc: DataConnect, vars: GetQuizDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizDetailsData, GetQuizDetailsVariables>;

