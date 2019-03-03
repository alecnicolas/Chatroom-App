const express = require('express')
const app = express()

//set template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

server = app.listen(4444)

//socket.io
const io = require('socket.io')(server)

//listen on every connection
io.on('connection', (socket) => {
    socket.username = "Anonymous"
    socket.avatar = "./avatar-default.png"

    io.sockets.emit('new_user')

    socket.on('disconnect', function() {
        io.sockets.emit('user_disconnect', {username : socket.username})
    })

    socket.on('change_username', (data) => {
        if(data.username == "")
            socket.username = "Anonymous"
        else
            socket.username = data.username

        //Easter eggs
        if(data.username == "Zane")
            socket.avatar = "./zane.jpg"
        else if(data.username == "Edgar")
            socket.avatar = "./edgar.jpg"
        
        //Default avatar    
        else
            socket.avatar = "./avatar-default.png"
    })

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message : data.message, username : socket.username, avatar: socket.avatar});
    })
})