const express = require("express")
const app = express()
const port = 3000
app.use('/', express.static('dist'))
app.use('/', express.static('src'))
app.use('/src', express.static('src'))
app.listen(port, () => { console.log(`Listening at http://localhost:${port}`) })