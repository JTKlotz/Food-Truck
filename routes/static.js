const path = require('path')
const router = require('express').Router()


const root = path.join(__dirname, '..', 'public') 

router.get('/', (request, response) => {
    response.sendFile('index.html', {root})
})


module.exports = router