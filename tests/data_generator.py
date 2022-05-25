from os import fwalk
from progress.bar import Bar
from secrets import choice
from uuid import uuid4
from random import randint
from hashlib import sha256
from sys import stdin
from sys import argv
import json
from pprint import pprint


def new_response(_id: str, content: str, responses: list[dict]) -> dict:
    return {
        '_id': _id if _id is not None else str(uuid4()),
        'response': content,
        'follow_ups': responses
    }


def new_question(_id: str, content: str, answer: list[dict]) -> dict:
    return {
        '_id': _id if _id is not None else str(uuid4()),
        'question': content,
        'answer': answer
    }


def new_box(_id:str, title: str, password: str, email: str, questions: list[dict]) -> dict:
    return {
        "_id": _id,
        "title": title,
        "_notify_email": email,
        "password": password,
        "questions": questions
    }


def random_title():
    titles = ["I'm soooo boring...", "Come and ask me something!",
              "Come and chat!", "Ask me anything.", ";D"]
    return titles[randint(0, len(titles)-1)]


def str_uuid():
    return str(uuid4())


def turn_a_list_into_a_random_response_tree(v):
    AVG_LAYER = 2
    v_len = len(v)  # initial length of v
    # scramble v
    for i in range(v_len):
        x = randint(0, v_len-1)
        v[i], v[x] = v[x], v[i]
    # horrible efficiency but works
    root = new_response(str_uuid(), v.pop(), [])
    update_list = [root['follow_ups']]
    while len(v) > 0 and len(update_list) > 0:
        front = update_list.pop()
        children_count = min(
            randint(0 if v_len > AVG_LAYER else 1, v_len//AVG_LAYER), len(v))
        # print(f'{children_count} responses in layer; {len(v)} remaining.')
        if children_count == 0 and len(update_list) == 0:
            # suck it back
            update_list.append(front)
        for _ in range(children_count):

            cur = new_response(str_uuid(), v.pop(), [])
            update_list.append(cur['follow_ups'])
            front.append(cur)

    return root


lines = []
last = 0

for line in stdin:
    lines.append(line.replace('\n', ''))

lines_len = len(lines)
boxes = []


with Bar('processing...',max=100000) as bar:
    while last < lines_len:
        name = lines[last]
        last += 1
        email = lines[last]
        last += 1
        following_lines = int(lines[last])
        last += 1
        av_pairs = {}
        for _ in range(following_lines):
            attribute, value = lines[last].split(',')
            av_pairs[attribute] = av_pairs.get(attribute, []) + [value]
            last += 1
        questions = []
        for k, v in av_pairs.items():

            unanswered = (randint(1, 10) > 5)

            answers = turn_a_list_into_a_random_response_tree(
                v) if unanswered else []

            questions.append(new_question(
                str_uuid(), f"What's your {k}?", answers))
        boxes.append(
            new_box(
                str_uuid(),
                random_title(),
                sha256(bytes(f'{name}123456', encoding='UTF-8')).hexdigest(),
                email,
                questions
            )
        )
        if last < lines_len:
            assert(lines[last] == '')

        last += 1  # skip empty line
        bar.next()
from progress.spinner import MoonSpinner

with MoonSpinner('Writing to files...') as spinner:
    spinner.next()
    with open(f'{argv[1]}.json','w') as fw:
        spinner.next()
        json.dump(boxes, fw)
        spinner.next()
        fw.flush()
        spinner.next()

    import pickle
    spinner.next()
    with open(f'{argv[1]}.blob','wb') as fw:
        spinner.next()
        pickle.dump(boxes, fw)
        spinner.next()
        fw.flush()
        spinner.next()
