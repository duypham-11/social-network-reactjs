let users = []

//Edit Data
const EditData = (data, id, call) => {
    const newData = data.map(item =>
        item.id === id ? { ...item, call } : item
    )
    return newData;
}

const SocketServer = (socket) => {
    //Connect
    socket.on('joinUser', user => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers })
        // console.log( users )
    })
    //Disconnect
    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id)
        // console.log(data)
        if (data) {
            const clients = users.filter(user =>
                data.followers.find(item => item._id === user.id)
            )
            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
                })
            }
            if (data.call) {
                const callUser = users.find(user => user.id === data.call)
                if (callUser) {
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
            // console.log(clients)
        }
        users = users.filter(user => user.socketId !== socket.id)

        // console.log({ users })
    })

    //Likes (SocketClient and redux(postAction))
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    //UnLikes (SocketClient and redux(postAction))
    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })

    //Create Comments (SocketClient and redux(commentAciotn))
    socket.on('createComment', newPost => {

        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    //Delete Comments (SocketClient and redux(commentAciotn))
    socket.on('deleteComment', newPost => {

        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })
    //FollowBtn (SocketClient and redux(profileAction))
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })
    //UnFollowBtn (SocketClient and redux(profileAction))
    socket.on('unfollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })

    //Notify redux(notifyAction)
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })
        }
    })

    //Notify redux(notifyAction)
    socket.on('removeNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))
        // console.log(clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
            })
        }
    })

    //Message redux(messageAciotn)
    socket.on('addMessage', msg => {
        // console.log(msg)
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    //Check user online /offline
    socket.on('checlUserOnline', data => {
        const following = users.filter(user =>
            data.following.find(item => item._id === user.id)
        )
        // console.log(following)
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user =>
            data.followers.find(item => item._id === user.id)
        )
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
        // console.log(clients)
    })

    //Call
    socket.on('callUser', data => {
        // console.log({ oldUser: users })

        users = EditData(users, data.sender, data.recipient)

        const client = users.find(user => user.id === data.recipient)
        if (client) {
            if (client.call) {
                users = EditData(users, data.sender, null)
                socket.emit('userBusy', data)
            } else {
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }

        // console.log({ newUser: users })      
    })

    socket.on('endCall', data => {
        // console.log({ old: users })
        
        const client = users.find(user => user.id === data.sender)

        if (client) {
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            //Clear call: null
            users = EditData(users, client.id, null)


            if (client.call) {
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

                //Clear call: null
                users = EditData(users, client.call, null)

            }
        }

        // console.log({ new: users })
    })
}

module.exports = SocketServer