const app = require("./src/app")
const PORT = process.env.PORT || 3056
const server = app.listen(PORT, () => {
    console.log(`ecommerce start with port ${PORT}`)
})
process.on('SIGINT', () => {
    server.close(() => console.log(`Exit server`))
})