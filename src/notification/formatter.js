class Container {
    constructor(children) {
        this.children = children;
    }
    formatHTML() {
        let rendered = this.children
            .map(child => child.formatHTML())
            .reduce((acc, curr) => `${acc}\n${curr}`)
        return `\n<div style="margin: 8px;">\n${rendered}\n</div>\n`
    }
    formatText() {
        let rendered = this.children
            .map(child => child.formatText())
            .reduce((acc, curr) => acc + '\n  ' + curr)
        return `\n${rendered}\n`
    }
}

class Question {
    constructor(txt) {
        this.txt = txt;
    }
    formatHTML() {
        return `<span style="font-size: larger; font-family: Times New Roman; color: blue;">${this.txt}</span>`;
    }
    formatText() {
        return this.txt;
    }
}

class Text {
    constructor(txt) {
        this.txt = txt;
    }
    formatHTML() {
        return `${this.txt}`;
    }
    formatText() {
        return this.txt;
    }
}

class Link {
    constructor(txt, href) {
        this.href = href;
        this.txt = txt;
    }
    formatHTML() {
        return `<a href="${this.href}">${this.txt}</a>`;
    }
    formatText() {
        return `${this.txt} (see ${this.href})`;
    }
}

class Header {
    constructor(level, txt) {
        this.level = (level < 5 ? (level > 0 ? level : 1) : 5)
        this.txt = txt
    }
    formatHTML() {
        return `<h${this.level}>${this.txt}</h${this.level}>`
    }
    formatText() {
        return `${'#'.repeat(this.level)} ${this.txt}\n`
    }
}

function newQuestionNotification(question, questionId) {
    return new Container([
        new Header(1, 'You have a new question:'),
        new Question(`${question}`),
        new Container([
            new Text('Click here to '),
            new Link('answer this question', `${process.env.APP_URL}#question:${questionId}`)
        ]),
    ])
}

function newAnswerNotification(questionId) {
    return new Container([
        new Header(1, 'Your question has been answered!'),
        new Text('Click here to '),
        new Link('view the answer', `${process.env.APP_URL}#question:${questionId}`)
    ])
}
function newReplyNotification(responseId) {
    return new Container([
        new Header(1, 'You have a new reply:'),
        new Text('Click here to '),
        new Link('see the discussion', `${process.env.APP_URL}#response:${responseId}`)
    ])
}

module.exports = { newQuestionNotification, newAnswerNotification, newReplyNotification }