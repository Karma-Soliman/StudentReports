export const logMiddleware = (req, res, next) => {
  const date = new Date().toISOString()
  console.log(`[${date}] ${req.method} ${req.url}`)
  next()
}


//app.use(async (req, res, next) => {
//    const date = new Date().toISOString()
//  console.log(`[${date}] ${req.method} ${req.url}`)

//  const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
//  const data = await response.json()
//  req.data = data
//  console.log(data)

//  next()
//})
