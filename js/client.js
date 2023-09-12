const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('notification.mp3');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position === 'left') {
    audio.play();
  }
};

let name;

function promptForName() {
  name = prompt('Enter your name to join');
  if (!name) {

    return promptForName();
  }
  socket.emit('new-user-joined', name);
}

promptForName();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});

socket.on('user-joined', (user) => {
  append(`${user} joined the chat`, 'centre');
});

socket.on('receiver', (data) => {
  append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (user) => {
  append(`${user} left the chat`, 'centre');
});




