const connectToMongo = require('./db');
connectToMongo();



const express = require('express')
const app = express()
const port = 5000

app.use(express.json()) // ata use hoi jate request marle undefine na dekhai body ar content ta dekhay
// Available Routes->
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Arka VAi let learn mongoDb happily!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 

