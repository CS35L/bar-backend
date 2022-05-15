from sys import argv
import pickle
from urllib.parse import quote
from click import progressbar

boxes = []

with open(argv[1], 'rb') as fr:
    boxes = pickle.load(fr)


def new_box_sql(_id, title, password, _notify_email):
    # apparently no injection prevention
    return f"INSERT INTO boxes VALUES ('{_id}','{title}','{password}', '{_notify_email}');"


def new_question_sql(_id, question, box_id):
    return f"INSERT INTO questions VALUES ('{_id}','{question}','{box_id}');"


def new_response_sql(_id, response, parent_id, is_answer):
    return f"INSERT INTO responses VALUES ('{_id}','{response}','eggie@cs.ucla.edu',null,'{parent_id}');" if is_answer\
        else f"INSERT INTO responses VALUES ('{_id}','{response}',null,'{parent_id}',null);"


sql_commands = []


def process_response_list(cmds: list, response_list, parent_id):
    if len(response_list) < 1:
        return
    for response in response_list:
        cmds.append(new_response_sql(
            response['_id'],
            quote(response['response']),
            parent_id,
            False
        ))
        process_response_list(cmds, response['follow_ups'], response['_id'])

for box in boxes[:10]:
    sql_commands.append(
        new_box_sql(
            box['_id'],
            quote(box['title']),
            box['password'],
            box['_notify_email']
        )
    )
    for question in box['questions']:
        sql_commands.append(
            new_question_sql(
                question['_id'],
                quote(question['question']),
                box['_id'],  # link to box id
            )
        )
        if len(question['answer']) > 0:
            sql_commands.append(
                new_response_sql(
                    question['answer']['_id'],
                    quote(question['answer']['response']),
                    question['_id'],  # link to box id
                    True,
                )
            )
            process_response_list(
                sql_commands, question['answer']['follow_ups'], question['answer']['_id'])

with open(argv[2], 'w') as fw:
    for cmd in sql_commands:
        fw.write(cmd+'\n')
        fw.flush()
