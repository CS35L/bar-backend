
# Data Base Documentation

Name: BAR

Platform: PostgreSQL

## Data Organization

### Boxes

| box_id | title | password | email |
|--------|-------|----------|-------|
`box_id` are unique and used as a primary key.

`title` refers to the box title.

`password` refers to the password (can be `NULL`).

`email` refers to the email attached to the box (can be `NULL`).

### Questions

| question_id | content | box_id | 
|-------------|---------|--------|

`question_id` are unique and used as a primary key.

`content` refers to the content of the question.

`box_id` correspond to `box_id` in `boxes`.

`box_id` represents the box that the question is posted in.

### Reponses

| response_id | content | parent_id |
|-------------|---------|-----------|

`response_id` are unique and used as a primary key.

`content` refers to the conetent of the reponse.

`parent_id` correspond to both `response_id` and `question_id` in `questions`.

`parent_id` represents the question/response the current response replying to.