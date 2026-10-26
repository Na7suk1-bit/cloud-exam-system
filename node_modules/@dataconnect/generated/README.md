# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyUser*](#getmyuser)
  - [*ListPublicQuizzes*](#listpublicquizzes)
  - [*ListMyAttempts*](#listmyattempts)
  - [*GetQuizDetails*](#getquizdetails)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateQuiz*](#createquiz)
  - [*CreateQuestion*](#createquestion)
  - [*CreateAttempt*](#createattempt)
  - [*CreateFavorite*](#createfavorite)
  - [*UpdateUser*](#updateuser)
  - [*UpdateQuiz*](#updatequiz)
  - [*DeleteFavorite*](#deletefavorite)
  - [*DeleteQuiz*](#deletequiz)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyUser
You can execute the `GetMyUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyUser(options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface GetMyUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserData, undefined>;
}
export const getMyUserRef: GetMyUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface GetMyUserRef {
  ...
  (dc: DataConnect): QueryRef<GetMyUserData, undefined>;
}
export const getMyUserRef: GetMyUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyUserRef:
```typescript
const name = getMyUserRef.operationName;
console.log(name);
```

### Variables
The `GetMyUser` query has no variables.
### Return Type
Recall that executing the `GetMyUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyUserData {
  user?: {
    username: string;
    email: string;
  };
}
```
### Using `GetMyUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyUser } from '@dataconnect/generated';


// Call the `getMyUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyUserRef } from '@dataconnect/generated';


// Call the `getMyUserRef()` function to get a reference to the query.
const ref = getMyUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListPublicQuizzes
You can execute the `ListPublicQuizzes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListPublicQuizzesData, undefined>;

interface ListPublicQuizzesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicQuizzesData, undefined>;
}
export const listPublicQuizzesRef: ListPublicQuizzesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicQuizzesData, undefined>;

interface ListPublicQuizzesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicQuizzesData, undefined>;
}
export const listPublicQuizzesRef: ListPublicQuizzesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicQuizzesRef:
```typescript
const name = listPublicQuizzesRef.operationName;
console.log(name);
```

### Variables
The `ListPublicQuizzes` query has no variables.
### Return Type
Recall that executing the `ListPublicQuizzes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicQuizzesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    category: string;
  } & Quiz_Key)[];
}
```
### Using `ListPublicQuizzes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicQuizzes } from '@dataconnect/generated';


// Call the `listPublicQuizzes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicQuizzes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicQuizzes(dataConnect);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
listPublicQuizzes().then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `ListPublicQuizzes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicQuizzesRef } from '@dataconnect/generated';


// Call the `listPublicQuizzesRef()` function to get a reference to the query.
const ref = listPublicQuizzesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicQuizzesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

## ListMyAttempts
You can execute the `ListMyAttempts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyAttempts(options?: ExecuteQueryOptions): QueryPromise<ListMyAttemptsData, undefined>;

interface ListMyAttemptsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAttemptsData, undefined>;
}
export const listMyAttemptsRef: ListMyAttemptsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyAttempts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAttemptsData, undefined>;

interface ListMyAttemptsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyAttemptsData, undefined>;
}
export const listMyAttemptsRef: ListMyAttemptsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyAttemptsRef:
```typescript
const name = listMyAttemptsRef.operationName;
console.log(name);
```

### Variables
The `ListMyAttempts` query has no variables.
### Return Type
Recall that executing the `ListMyAttempts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyAttemptsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyAttemptsData {
  attempts: ({
    score: number;
    quiz: {
      title: string;
    };
  })[];
}
```
### Using `ListMyAttempts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyAttempts } from '@dataconnect/generated';


// Call the `listMyAttempts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyAttempts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyAttempts(dataConnect);

console.log(data.attempts);

// Or, you can use the `Promise` API.
listMyAttempts().then((response) => {
  const data = response.data;
  console.log(data.attempts);
});
```

### Using `ListMyAttempts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyAttemptsRef } from '@dataconnect/generated';


// Call the `listMyAttemptsRef()` function to get a reference to the query.
const ref = listMyAttemptsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyAttemptsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.attempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.attempts);
});
```

## GetQuizDetails
You can execute the `GetQuizDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getQuizDetails(vars: GetQuizDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizDetailsData, GetQuizDetailsVariables>;

interface GetQuizDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizDetailsVariables): QueryRef<GetQuizDetailsData, GetQuizDetailsVariables>;
}
export const getQuizDetailsRef: GetQuizDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizDetails(dc: DataConnect, vars: GetQuizDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizDetailsData, GetQuizDetailsVariables>;

interface GetQuizDetailsRef {
  ...
  (dc: DataConnect, vars: GetQuizDetailsVariables): QueryRef<GetQuizDetailsData, GetQuizDetailsVariables>;
}
export const getQuizDetailsRef: GetQuizDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizDetailsRef:
```typescript
const name = getQuizDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetQuizDetails` query requires an argument of type `GetQuizDetailsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizDetailsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetQuizDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizDetails, GetQuizDetailsVariables } from '@dataconnect/generated';

// The `GetQuizDetails` query requires an argument of type `GetQuizDetailsVariables`:
const getQuizDetailsVars: GetQuizDetailsVariables = {
  id: ..., 
};

// Call the `getQuizDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizDetails(getQuizDetailsVars);
// Variables can be defined inline as well.
const { data } = await getQuizDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizDetails(dataConnect, getQuizDetailsVars);

console.log(data.quiz);

// Or, you can use the `Promise` API.
getQuizDetails(getQuizDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.quiz);
});
```

### Using `GetQuizDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizDetailsRef, GetQuizDetailsVariables } from '@dataconnect/generated';

// The `GetQuizDetails` query requires an argument of type `GetQuizDetailsVariables`:
const getQuizDetailsVars: GetQuizDetailsVariables = {
  id: ..., 
};

// Call the `getQuizDetailsRef()` function to get a reference to the query.
const ref = getQuizDetailsRef(getQuizDetailsVars);
// Variables can be defined inline as well.
const ref = getQuizDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizDetailsRef(dataConnect, getQuizDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quiz);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  username: string;
  email: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateQuiz
You can execute the `CreateQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createQuiz(vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuiz(dc: DataConnect, vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  (dc: DataConnect, vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuizRef:
```typescript
const name = createQuizRef.operationName;
console.log(name);
```

### Variables
The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuizVariables {
  title: string;
  category: string;
  description?: string | null;
  isPublic?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}
```
### Using `CreateQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuiz, CreateQuizVariables } from '@dataconnect/generated';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  title: ..., 
  category: ..., 
  description: ..., // optional
  isPublic: ..., // optional
};

// Call the `createQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuiz(createQuizVars);
// Variables can be defined inline as well.
const { data } = await createQuiz({ title: ..., category: ..., description: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuiz(dataConnect, createQuizVars);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
createQuiz(createQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

### Using `CreateQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuizRef, CreateQuizVariables } from '@dataconnect/generated';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  title: ..., 
  category: ..., 
  description: ..., // optional
  isPublic: ..., // optional
};

// Call the `createQuizRef()` function to get a reference to the mutation.
const ref = createQuizRef(createQuizVars);
// Variables can be defined inline as well.
const ref = createQuizRef({ title: ..., category: ..., description: ..., isPublic: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuizRef(dataConnect, createQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

## CreateQuestion
You can execute the `CreateQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createQuestion(vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuestion(dc: DataConnect, vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  (dc: DataConnect, vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuestionRef:
```typescript
const name = createQuestionRef.operationName;
console.log(name);
```

### Variables
The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuestionVariables {
  quizId: UUIDString;
  text: string;
  correctAnswer: string;
  options: string;
  pointValue?: number | null;
}
```
### Return Type
Recall that executing the `CreateQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuestionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuestionData {
  question_insert: Question_Key;
}
```
### Using `CreateQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuestion, CreateQuestionVariables } from '@dataconnect/generated';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  quizId: ..., 
  text: ..., 
  correctAnswer: ..., 
  options: ..., 
  pointValue: ..., // optional
};

// Call the `createQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuestion(createQuestionVars);
// Variables can be defined inline as well.
const { data } = await createQuestion({ quizId: ..., text: ..., correctAnswer: ..., options: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuestion(dataConnect, createQuestionVars);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
createQuestion(createQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

### Using `CreateQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuestionRef, CreateQuestionVariables } from '@dataconnect/generated';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  quizId: ..., 
  text: ..., 
  correctAnswer: ..., 
  options: ..., 
  pointValue: ..., // optional
};

// Call the `createQuestionRef()` function to get a reference to the mutation.
const ref = createQuestionRef(createQuestionVars);
// Variables can be defined inline as well.
const ref = createQuestionRef({ quizId: ..., text: ..., correctAnswer: ..., options: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuestionRef(dataConnect, createQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

## CreateAttempt
You can execute the `CreateAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAttempt(vars: CreateAttemptVariables): MutationPromise<CreateAttemptData, CreateAttemptVariables>;

interface CreateAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAttemptVariables): MutationRef<CreateAttemptData, CreateAttemptVariables>;
}
export const createAttemptRef: CreateAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAttempt(dc: DataConnect, vars: CreateAttemptVariables): MutationPromise<CreateAttemptData, CreateAttemptVariables>;

interface CreateAttemptRef {
  ...
  (dc: DataConnect, vars: CreateAttemptVariables): MutationRef<CreateAttemptData, CreateAttemptVariables>;
}
export const createAttemptRef: CreateAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAttemptRef:
```typescript
const name = createAttemptRef.operationName;
console.log(name);
```

### Variables
The `CreateAttempt` mutation requires an argument of type `CreateAttemptVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAttemptVariables {
  quizId: UUIDString;
  score: number;
}
```
### Return Type
Recall that executing the `CreateAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAttemptData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAttemptData {
  attempt_insert: Attempt_Key;
}
```
### Using `CreateAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAttempt, CreateAttemptVariables } from '@dataconnect/generated';

// The `CreateAttempt` mutation requires an argument of type `CreateAttemptVariables`:
const createAttemptVars: CreateAttemptVariables = {
  quizId: ..., 
  score: ..., 
};

// Call the `createAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAttempt(createAttemptVars);
// Variables can be defined inline as well.
const { data } = await createAttempt({ quizId: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAttempt(dataConnect, createAttemptVars);

console.log(data.attempt_insert);

// Or, you can use the `Promise` API.
createAttempt(createAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.attempt_insert);
});
```

### Using `CreateAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAttemptRef, CreateAttemptVariables } from '@dataconnect/generated';

// The `CreateAttempt` mutation requires an argument of type `CreateAttemptVariables`:
const createAttemptVars: CreateAttemptVariables = {
  quizId: ..., 
  score: ..., 
};

// Call the `createAttemptRef()` function to get a reference to the mutation.
const ref = createAttemptRef(createAttemptVars);
// Variables can be defined inline as well.
const ref = createAttemptRef({ quizId: ..., score: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAttemptRef(dataConnect, createAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attempt_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attempt_insert);
});
```

## CreateFavorite
You can execute the `CreateFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFavorite(vars: CreateFavoriteVariables): MutationPromise<CreateFavoriteData, CreateFavoriteVariables>;

interface CreateFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFavoriteVariables): MutationRef<CreateFavoriteData, CreateFavoriteVariables>;
}
export const createFavoriteRef: CreateFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFavorite(dc: DataConnect, vars: CreateFavoriteVariables): MutationPromise<CreateFavoriteData, CreateFavoriteVariables>;

interface CreateFavoriteRef {
  ...
  (dc: DataConnect, vars: CreateFavoriteVariables): MutationRef<CreateFavoriteData, CreateFavoriteVariables>;
}
export const createFavoriteRef: CreateFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFavoriteRef:
```typescript
const name = createFavoriteRef.operationName;
console.log(name);
```

### Variables
The `CreateFavorite` mutation requires an argument of type `CreateFavoriteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFavoriteVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFavoriteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFavoriteData {
  favorite_insert: Favorite_Key;
}
```
### Using `CreateFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFavorite, CreateFavoriteVariables } from '@dataconnect/generated';

// The `CreateFavorite` mutation requires an argument of type `CreateFavoriteVariables`:
const createFavoriteVars: CreateFavoriteVariables = {
  quizId: ..., 
};

// Call the `createFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFavorite(createFavoriteVars);
// Variables can be defined inline as well.
const { data } = await createFavorite({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFavorite(dataConnect, createFavoriteVars);

console.log(data.favorite_insert);

// Or, you can use the `Promise` API.
createFavorite(createFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.favorite_insert);
});
```

### Using `CreateFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFavoriteRef, CreateFavoriteVariables } from '@dataconnect/generated';

// The `CreateFavorite` mutation requires an argument of type `CreateFavoriteVariables`:
const createFavoriteVars: CreateFavoriteVariables = {
  quizId: ..., 
};

// Call the `createFavoriteRef()` function to get a reference to the mutation.
const ref = createFavoriteRef(createFavoriteVars);
// Variables can be defined inline as well.
const ref = createFavoriteRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFavoriteRef(dataConnect, createFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.favorite_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.favorite_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  username?: string | null;
  email?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  username: ..., // optional
  email: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ username: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  username: ..., // optional
  email: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ username: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateQuiz
You can execute the `UpdateQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateQuiz(vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;

interface UpdateQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
}
export const updateQuizRef: UpdateQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuiz(dc: DataConnect, vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;

interface UpdateQuizRef {
  ...
  (dc: DataConnect, vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
}
export const updateQuizRef: UpdateQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuizRef:
```typescript
const name = updateQuizRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuizVariables {
  id: UUIDString;
  title?: string | null;
}
```
### Return Type
Recall that executing the `UpdateQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuizData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `UpdateQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuiz, UpdateQuizVariables } from '@dataconnect/generated';

// The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`:
const updateQuizVars: UpdateQuizVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuiz(updateQuizVars);
// Variables can be defined inline as well.
const { data } = await updateQuiz({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuiz(dataConnect, updateQuizVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
updateQuiz(updateQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `UpdateQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuizRef, UpdateQuizVariables } from '@dataconnect/generated';

// The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`:
const updateQuizVars: UpdateQuizVariables = {
  id: ..., 
  title: ..., // optional
};

// Call the `updateQuizRef()` function to get a reference to the mutation.
const ref = updateQuizRef(updateQuizVars);
// Variables can be defined inline as well.
const ref = updateQuizRef({ id: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuizRef(dataConnect, updateQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## DeleteFavorite
You can execute the `DeleteFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFavorite(vars: DeleteFavoriteVariables): MutationPromise<DeleteFavoriteData, DeleteFavoriteVariables>;

interface DeleteFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFavoriteVariables): MutationRef<DeleteFavoriteData, DeleteFavoriteVariables>;
}
export const deleteFavoriteRef: DeleteFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFavorite(dc: DataConnect, vars: DeleteFavoriteVariables): MutationPromise<DeleteFavoriteData, DeleteFavoriteVariables>;

interface DeleteFavoriteRef {
  ...
  (dc: DataConnect, vars: DeleteFavoriteVariables): MutationRef<DeleteFavoriteData, DeleteFavoriteVariables>;
}
export const deleteFavoriteRef: DeleteFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFavoriteRef:
```typescript
const name = deleteFavoriteRef.operationName;
console.log(name);
```

### Variables
The `DeleteFavorite` mutation requires an argument of type `DeleteFavoriteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFavoriteVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFavoriteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFavoriteData {
  favorite_deleteMany: number;
}
```
### Using `DeleteFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFavorite, DeleteFavoriteVariables } from '@dataconnect/generated';

// The `DeleteFavorite` mutation requires an argument of type `DeleteFavoriteVariables`:
const deleteFavoriteVars: DeleteFavoriteVariables = {
  quizId: ..., 
};

// Call the `deleteFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFavorite(deleteFavoriteVars);
// Variables can be defined inline as well.
const { data } = await deleteFavorite({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFavorite(dataConnect, deleteFavoriteVars);

console.log(data.favorite_deleteMany);

// Or, you can use the `Promise` API.
deleteFavorite(deleteFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.favorite_deleteMany);
});
```

### Using `DeleteFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFavoriteRef, DeleteFavoriteVariables } from '@dataconnect/generated';

// The `DeleteFavorite` mutation requires an argument of type `DeleteFavoriteVariables`:
const deleteFavoriteVars: DeleteFavoriteVariables = {
  quizId: ..., 
};

// Call the `deleteFavoriteRef()` function to get a reference to the mutation.
const ref = deleteFavoriteRef(deleteFavoriteVars);
// Variables can be defined inline as well.
const ref = deleteFavoriteRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFavoriteRef(dataConnect, deleteFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.favorite_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.favorite_deleteMany);
});
```

## DeleteQuiz
You can execute the `DeleteQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteQuiz(vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuiz(dc: DataConnect, vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizRef:
```typescript
const name = deleteQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizData {
  quiz_delete?: Quiz_Key | null;
}
```
### Using `DeleteQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuiz, DeleteQuizVariables } from '@dataconnect/generated';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuiz(deleteQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuiz({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuiz(dataConnect, deleteQuizVars);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
deleteQuiz(deleteQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

### Using `DeleteQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizRef, DeleteQuizVariables } from '@dataconnect/generated';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizRef(deleteQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizRef(dataConnect, deleteQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

