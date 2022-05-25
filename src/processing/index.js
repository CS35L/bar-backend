const Router = require('@koa/router')
const crypto = require('node:crypto')

const router = Router({ prefix: '/api' })


router.get('/box/:boxId', async (ctx) => {
    const boxId = ctx.params.boxId
    const box = await ctx.db.query('SELECT title FROM boxes WHERE _id = $1;', [boxId])
    const questions = await ctx.db.query('SELECT * FROM questions WHERE box_id = $1;', [boxId])

    ctx.body = {
        boxTitle: box.rows[0].title,
        questions: await Promise.all(
            questions.rows.map(
                async (e) => Object(
                    {
                        question: e.question,
                        followUps: await getChildren(ctx.db, e._id, e.question, true)
                    }
                )
            )
        )
    };
})

async function verifyPasswordFromHeader(ctx, boxId) {
    const password = ctx.get('Authorization');
    if (password === '') {
        ctx.throw(400, 'No Authorization header provided; request will not be processed.');
        return;
    }
    const hashedPassword = crypto
        .createHash('sha256')
        .update(Buffer.from(
            password.replace('Basic ', ''),
            'base64'
        ).toString()).digest('hex');
    const box = await ctx.db.query('SELECT _id FROM boxes WHERE _id = $1 AND password = $2;', [boxId, hashedPassword]);
    if (box.rows.length !== 1) {
        ctx.throw(401, 'Wrong password provided; unauthorized request.');
        return;
    }
}
//get all unanswered question
router.get('/unanswered-questions/:boxId', async (ctx) => {
    const boxId = ctx.params.boxId;
    await verifyPasswordFromHeader(ctx, boxId);
    const questions = await ctx.db.query('SELECT * FROM questions WHERE box_id = $1 AND EXISTS ( SELECT question_id FROM responses );', [boxId])
    // console.log(questions.rows, typeof (questions.rows))
    ctx.body = {
        questions: questions.rows.map(e => Object({ _id: e._id, question: e.question }))
    };
})

//create an box
//TODO: ADD CAPTCHA
router.post('/create-box', async (ctx) => {
    let box = ctx.request.body;
    box = createBox(box);
    await ctx.db.query('INSERT INTO boxes(_id, title, password, notify_email) VALUES ($1, $2, $3, $4);', [box._id, box.title, box.password, box.email])
    ctx.response.status = 201;
    ctx.body = box._id;
})

//ask a question in a box
router.post('/ask/:boxId', async (ctx) => {
    const boxId = ctx.params.boxId;
    let question = ctx.request.body;
    question = createQuestion(question);
    await ctx.db.query('INSERT INTO questions(_id, question, notify_email, box_id) VALUES ($1, $2, $3, $4);', [question._id, question.question, question.email, boxId])
    ctx.response.status = 201;
})

//post a response to a response/question
router.post('/follow-up/:responseId', async (ctx) => {
    const responseId = ctx.params.responseId;
    const test = await ctx.db.query('SELECT _id FROM questions WHERE _id = $1', [responseId]);
    let response = ctx.request.body;
    response = createResponse(response);
    await ctx.db.query('INSERT INTO responses(_id, response, notify_email, response_id) VALUES ($1, $2, $3, $4);', [response._id, response.response, response.email, responseId])
    ctx.response.status = 201;
})


//Answer a question (password required unless NULL)
router.post('/answer/:questionId', async (ctx) => {
    const questionId = ctx.params.questionId;
    let response = ctx.request.body;
    let boxId = (await ctx.db.query('SELECT box_id FROM questions WHERE _id = $1;', [questionId])).rows[0].box_id;
    await verifyPasswordFromHeader(ctx, boxId);
    response = createResponse(response);
    await ctx.db.query('INSERT INTO responses(_id, response, notify_email, question_id) VALUES ($1, $2, $3, $4);', [response._id, response.response, response.email, questionId])
    ctx.response.status = 201;
})



//
async function getChildren(db, id, content, isQuestion) {
    const children = await db.query('SELECT _id, response FROM responses WHERE (response_id=$1 or question_id=$1);', [id])
    // console.log("DB: ", db);
    // console.log(children);
    return isQuestion ? {
        id,
        content,
        answer: children.rows.length > 0 ? (await getChildren(db, children.rows[0]._id, children.rows[0].response)) : null
    } : {
        id,
        content,
        followUps: children.rows.length > 0 ? await Promise.all(children.rows.map(async (e) => await getChildren(db, e._id, e.response))) : null
    };
}




//create a Box
const createBox = ({ email, title, password, captchaCode }) => {
    return {
        _id: crypto.randomUUID(),
        title,
        password: `${crypto.createHmac('sha256', password).digest('hex')}`,
        email,
    };
};

//create a Question
const createQuestion = ({ email, question }) => {
    return {
        _id: crypto.randomUUID(),
        question,
        email,
    }
}

const createResponse = ({ email, response }) => {
    return {
        _id: crypto.randomUUID(),
        response,
        email,
    }
}
module.exports = router