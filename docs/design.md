Design
======

# Overall Architecture

This application will be built in a typical frontend-backend structure, 
with NodeJS as backend server and a React-built SPA as the frontend client.

# Backend API

Backend API starts with `/api` route.

Since this is a documentation mostly for inexperienced developers and mostly students, I will write it in a less *serious* way.

*So **bear** my weird sense of humor when writing documentations - we're **bruins!***  `// see? I've already started!`

## Conventions (in this documentation)

### Variable Notation

Contents inside `< >` means variable/replaceable values; variable names follow the convention of the programming language.

For example, `/api/<box-id>` means there is a variable `box-id` under route `/api` that will get passed into a variable `boxId` (JavaScript naming convention) when using JavaScript to handle, or `box_id` (C, Python naming convention) when using C or Python.

### Type Notation

When specifying types, the **JSON-like** object has its type followed by its name. Double-slash comments are used to note complex types in human readable language. Normally, words are not capitalized, so if you see [Camels](https://en.wikipedia.org/wiki/Camel_case), this means ~~you're in southern California~~ a type notation (following the convention of JavaScript); most of the times, they will appear later (so the data type can be explained more clearly and easily). 

Also, this notation can be seen as a guideline for backend development, but still, variable naming strictly follows the conventions of the language that is being used (so, say, if I'm using C (or Python) to develop the backend, the type noted `ComplexType` will be something like `struct complex_type` )

> Special cases aren't special enough to break the rules.
> -- Tim Peters

For recursively repeating structures, `...` will be used to end the repetition.

So, for example,

```JavaScript
{
    stringVariable: string,
    integerVariable: int,
    floatingPointVariable: float,
    complexType: { // a ComplexType
        aCuteString: string,
        anotherCuteString: string,
        complexType: {...} // a nested ComplexType object; can be empty
    }
}
```

This specifies an object that could be (in **REAL** JSON), for example:

```JavaScript
{
    "stringVariable": "this is a string",
    "integerVariable": 114514, // it stinks, isn't it?
    "complexType": {
        "aCuteString": "Acute indeed, isn't it?",
        "anotherCuteString": "Not acute at all...",
        "complexType": null
    }
}
```

### Response Status

Unless specified otherwise, the return values in the API document are all under a successful request that has a status code in 200-299.

This project uses the standard [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) to identify the response status. This means the client should check if the response status is in 200-299 (Successful Responses) before further processing, as errors will be identified in other response codes. Unless specified otherwise, a Redirection message (300-399) should be followed until the final response is available. 

When the response code is not a *Successful Response*, unless specified otherwise, the response payload will always be a JSON object consists of two entries: one fixed error code (string) and a human readable error message (string) subject to future changes. Notice that in a successful response the payload can be empty (see specific API).

## Backend APIs

### Gets

#### GET `/api/box/<box-id>`

Returns a JSON object that consists all answered questions and responses.

```JavaScript
{
    boxTitle: string,
    questions: [
        { // question
            content: string,
            answer: { // an Response object
                id: string, // should be in UUID hex format
                content: string,
                followUps: [
                    {
                        id: string,
                        content: string,
                        followUps: [...] // array of Response objects
                    }, ... // other Response objects
                ]
            }
        }
    ]
}
```

#### GET `/api/unanswered-questions/<box-id>`

Gets all unanswered questions in this box.

Here, password is required for authorization; the password is passed in a [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization), with the base64 encoded password being the Basic token. The format is `Authorization: Basic <token>`. For example, `Authorization: Basic cGFzc3dvcmQ=`. 

Returns a list of question objects, with an id at their identifier (for answering them).

```JavaScript
[
    {
        id: string, // ID, used for answering
        content: string // the question itself
    },
    {
        id: string,
        content: string
    },
    {
        id: string,
        content: string
    },
    ... // many questions
]
```

### Posts

#### POST `/api/create-box`

Create a box. 

User-defined password is stored in the body (this means it should have a Content Type header being `application/json` identifying that body is a JSON). Also, this request is protected by a CAPTCHA service.

The request body is:

```JavaScript
{
    email: optional string, // optional email, used for notifications and saving passwords.
    title: string, // the title, or name of the box
    description: optional string, // the box's description
    password: string, // user-entered password for this box
    captchaCode: string, // CAPTCHA code, for verification
}
```

The response is a the box id, in plain string; The header is 201 Created, meaning the resource (box) is created.

#### POST `/api/ask/<box-id>`

Ask question to a box.

The request body is a JSON object:

```JavaScript
{
    email: optional string, // optional email, used for notifications when question is answered
    question: string, // the question
}
```

The response is an empty 201 Created response, meaning the resource (anonymously asked question) is created.

#### POST `/api/answer/<question-id>`

Answer a question by its question id.

Here, password is required for authorization; see [here](#get-apiunanswered-questionsbox-id) for the authorization header details.

The request is:

```JavaScript
{
    private: bool, // if checked, the answer will only be send to the asker (via email); 
                   // if the email is not available then the answer will be discarded.
    answer: string,
}
```

Returns an empty 201 Created response, meaning the resource (the answer, or, in other words user's *response*) is created.

#### POST `/api/follow-up/<response-id>`

**In this section, unless specified, the term `response` refer to to the user's answer or follow-ups, not HTTP response.**

The request is the response itself, in `text/plain` (plain text) format.
