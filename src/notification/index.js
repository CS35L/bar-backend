const { send } = require("./email");
const { newQuestionNotification, newAnswerNotification, newReplyNotification } = require('./formatter');


async function notifyQuestion(email, question, questionId) {
    const rendered = newQuestionNotification(question, questionId);
    await send(email,
        'Someone asked you a new question!',
        rendered.formatText(),
        rendered.formatHTML()
    );
}

async function notifyAnswer(email, responseId) {
    const rendered = newAnswerNotification(responseId);
    await send(email,
        'You\'re question has been answered!',
        rendered.formatText(),
        rendered.formatHTML()
    );
}


async function notifyReply(email, responseId) {
    const rendered = newReplyNotification(responseId);
    await send(email,
        'You\'ve received a new reply!',
        rendered.formatText(),
        rendered.formatHTML()
    );
}

