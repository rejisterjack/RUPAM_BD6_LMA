const { app, port } = require("./server")


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
