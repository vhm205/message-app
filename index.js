const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<h1> Hello World </h1>')
})

const PORT = process.env.PORT || 1002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
