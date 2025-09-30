const express = require("express")
const path = require("path")
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname+"/abenteuer")))

app.listen(PORT, () => {
  console.log(`Example app listening on http://127.0.0.1:${PORT}`)
})