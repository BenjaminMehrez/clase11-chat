import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'


import viewsRouter from './routes/views.js'


const app = express() 
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static(`${__dirname}/public`))
const server = app.listen(8080, () => console.log('Server Run'))


app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('views engine', 'handlebars')


app.use('/views', viewsRouter)


const io = new Server(server)

let message= []

io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('message', data => {
        message.push(data)
        io.emit('messageLogs', message)
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data)
    })
})
 