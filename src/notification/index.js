const { send } = require("./email");
const { newQuestionNotification, newAnswerNotification, newBoxNotification } = require('./formatter');

async function notifyBox(email, title, boxId) {
    console.log("Sending box notification to " + email);
    if (title===undefined){
        title = "Ask Me Anything";
    };
    const rendered = newBoxNotification(title, boxId);
    await send(email,
        'You have a new box!',
        rendered.formatText(),
        rendered.formatHTML()
    );
    console.log("Sent box notification to " + email);
}

async function notifyQuestion(email, boxId, question, questionId) {
    console.log("Sending question notification to " + email);
    const rendered = newQuestionNotification(question, boxId, questionId);
    await send(email,
        'Someone asked you a new question!',
        rendered.formatText(),
        rendered.formatHTML()
    );
    console.log("Sent question notification to " + email);
}

async function notifyAnswer(email, boxId, responseId) {
    console.log("Sending answer notification to " + email);
    const rendered = newAnswerNotification(boxId, responseId);
    await send(email,
        'You\'re question has been answered!',
        rendered.formatText(),
        rendered.formatHTML()
    ).then(e => console.log(e)).catch(e => console.warn(e));
    console.log("Sent answer notification to " + email);
}

module.exports = {notifyAnswer, notifyQuestion, notifyBox}
