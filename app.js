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
    //Default User
    socket.username = "Anonymous"
    socket.avatar = "assets/avatar-default.png"

    //New user message
    io.sockets.emit('new_user')

    //User disconnected message
    socket.on('disconnect', function() {
        io.sockets.emit('user_disconnect', {username : socket.username})
    })

    //Username Handling
    socket.on('change_username', (data) => {
        if(data.username == "")
            socket.username = "Anonymous"
        else
            socket.username = data.username

        //Easter eggs
        if(data.username == "Zane")
            socket.avatar = "assets/zane.jpg"
        else if(data.username == "Edgar")
            socket.avatar = "assets/edgar.jpg"
        
        //Default avatar    
        else
            socket.avatar = "assets/avatar-default.png"
    })

    //Message Handling
    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message : data.message, username : socket.username, avatar: socket.avatar});
    })

    //Misc
    socket.on('typing', () => {
        io.sockets.emit('someone_typing', socket.username)
    })
})