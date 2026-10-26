# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useCreateQuiz, useCreateQuestion, useCreateAttempt, useCreateFavorite, useUpdateUser, useUpdateQuiz, useDeleteFavorite, useDeleteQuiz, useGetMyUser } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateQuiz(createQuizVars);

const { data, isPending, isSuccess, isError, error } = useCreateQuestion(createQuestionVars);

const { data, isPending, isSuccess, isError, error } = useCreateAttempt(createAttemptVars);

const { data, isPending, isSuccess, isError, error } = useCreateFavorite(createFavoriteVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateQuiz(updateQuizVars);

const { data, isPending, isSuccess, isError, error } = useDeleteFavorite(deleteFavoriteVars);

const { data, isPending, isSuccess, isError, error } = useDeleteQuiz(deleteQuizVars);

const { data, isPending, isSuccess, isError, error } = useGetMyUser();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, createQuiz, createQuestion, createAttempt, createFavorite, updateUser, updateQuiz, deleteFavorite, deleteQuiz, getMyUser } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation CreateQuiz:  For variables, look at type CreateQuizVars in ../index.d.ts
const { data } = await CreateQuiz(dataConnect, createQuizVars);

// Operation CreateQuestion:  For variables, look at type CreateQuestionVars in ../index.d.ts
const { data } = await CreateQuestion(dataConnect, createQuestionVars);

// Operation CreateAttempt:  For variables, look at type CreateAttemptVars in ../index.d.ts
const { data } = await CreateAttempt(dataConnect, createAttemptVars);

// Operation CreateFavorite:  For variables, look at type CreateFavoriteVars in ../index.d.ts
const { data } = await CreateFavorite(dataConnect, createFavoriteVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation UpdateQuiz:  For variables, look at type UpdateQuizVars in ../index.d.ts
const { data } = await UpdateQuiz(dataConnect, updateQuizVars);

// Operation DeleteFavorite:  For variables, look at type DeleteFavoriteVars in ../index.d.ts
const { data } = await DeleteFavorite(dataConnect, deleteFavoriteVars);

// Operation DeleteQuiz:  For variables, look at type DeleteQuizVars in ../index.d.ts
const { data } = await DeleteQuiz(dataConnect, deleteQuizVars);

// Operation GetMyUser: 
const { data } = await GetMyUser(dataConnect);


```