const Router = require('@koa/router')
const router = Router({prefix: '/api'})

router.get('/box/:boxId', async (ctx) => {
    const boxId = ctx.params.boxId
    const box = await ctx.db.query('SELECT title FROM boxes WHERE _id = $1;', [boxId])
    const questions = await ctx.db.query('SELECT * FROM questions WHERE box_id = $1;', [boxId])
    // TODO: get full responses & questions
    // WIP: ctx.body = {boxTitle: box.rows[0].title};
})

// other routes

module.exports = router
