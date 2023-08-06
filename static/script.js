const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fetch chat history from server when the page loads
//window.onload = fetchHistory;

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();  // Prevents the default action (form submit) to happen
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = userInput.value;
    if (userMessage) {
        appendMessage(userMessage, 'user');
        userInput.value = ''; // clear input field as soon as Enter is hit
        const aiMessage = await fetchMessage(userMessage);
        appendMessage(aiMessage, 'assistant'); // Changed 'ai' to 'assistant'
    }
}


async function fetchMessage(message) {
    const response = await fetch(`/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.message;
}

function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Adjust the class name based on the sender
    if (sender === 'assistant') {
        messageDiv.classList.add('assistant-message');
    } else {
        messageDiv.classList.add(`${sender}-message`);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}



async function fetchHistory() {
    const response = await fetch(`/get_history`);
    const data = await response.json();
    const chatHistory = data.history;
    chatHistory.forEach(({ role, content }) => appendMessage(content, role));  
}
