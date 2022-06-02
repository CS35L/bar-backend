const { send } = require("./email");
const { newQuestionNotification, newAnswerNotification, newReplyNotification } = require('./formatter');

async function notifyBox(email, boxId, title) {
    const rendered = newBoxNotification(title, boxId);
    await send(email,
        'You have a new box!',
        rendered.formatText(),
        rendered.formatHTML()
    );
}

async function notifyQuestion(email, boxId, question, questionId) {
    const rendered = newQuestionNotification(question, boxId, questionId);
    await send(email,
        'Someone asked you a new question!',
        rendered.formatText(),
        rendered.formatHTML()
    );
}

async function notifyAnswer(email, boxId, responseId) {
    const rendered = newAnswerNotification(boxId, responseId);
    await send(email,
        'You\'re question has been answered!',
        rendered.formatText(),
        rendered.formatHTML()
    ).then(e => console.log(e)).catch(e => console.warn(e));
}

module.exports = {notifyAnswer, notifyQuestion, notifyBox}
