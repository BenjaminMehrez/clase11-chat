const socket = io()

let user;

let chatBox = document.querySelector('#chatbox')


Swal.fire({
    title: 'What is your name??',
    input: 'text',
    text: 'Enter the username to identify yourself',
    inputValidator: (value) => {
        return !value && 'You need to enter a username'
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value
    socket.emit('authenticated', user)
})


chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {user: user, message: chatBox.value})
            chatBox.value = ''
        }
    }
})


socket.on('messageLogs', data => {
    if(!user) return 
    let log = document.getElementById('messageLogs')
    let messages = ''
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    });
    log.innerHTML = messages
})


socket.on('newUserConnected', user =>{
    if(!user) return 
    Swal.fire({
        toast: true,
        position: 'top-right',
        text: 'New user conected',
        title: `${user} se ha unido al chat`,
        timer: 4000,
        showConfirmationButton: false
    })
    
})