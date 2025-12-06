
const express = require('express')
const app = express()
const port = 3010


// respond with static webpages
app.use(express.static('public'))

// allow us to send json
app.use(express.json())

app.use('/api/v1/menu', require('./routes/api/v1/menu'))
app.use('/api/v1/events', require('./routes/api/v1/events'))

app.use('/', require('./routes/static'))

app.listen(port, () => console.log(`http://localhost:${port}/`))