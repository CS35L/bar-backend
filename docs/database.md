# Data Base Documentation

Name: BAR

Platform: PostgreSQL

## Data Organization

`_id` are unique and used as a primary key.

`notify_email` refers to the email that notifications will be sent to (can be `NULL`).
### Boxes

| _id | title | password | notify_email |
|-----|-------|----------|--------------|

`title` refers to the box title.

`password` refers to the password of the box.

### Questions

| _id | question | box_id | notify_email |
|-----|----------|--------|--------------|

`question` refers to the content of the question.

`box_id` represents the box that the question is posted in.

`box_id` correspond to `box_id` in `boxes`.
### Reponses

| _id | response | response_id | question_id | notify_email |
|-----|----------|-------------|-------------|--------------|

`content` refers to the conetent of the reponse.

`response_id` or `question_id` represents the question/response the current response replying to.

`response_id` correspond to `_id`.

`question_id` correspond to `_id` in `questions`.

One and only one of `response_id` and `question_id` will be `NULL`. 