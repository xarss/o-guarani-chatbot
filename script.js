document.getElementById("question").addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    askQuestion();
  }
});

async function testConnection() {
  const url = document.getElementById('url').value.trim();

  if (!url) {
    alert('Please enter the ngrok URL!');
    return;
  }

  try {
    const response = await fetch(`${url}/test_connection`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      }
    });

    if (response.ok) {
      appendMessage("Hello! Connection successfull!", 'bot');

      document.getElementById('url-container')
        .classList.add('hidden')

      document.getElementById('askBtn').disabled = false;
      document.getElementById('chat-container')
        .classList.remove('hidden');
    } else {
      throw new Error('Failed to connect');
    }
  } catch (error) {
    document.getElementById('response').textContent = `Error: ${error.message}`;
  }
}

async function askQuestion() {
  const url = document.getElementById('url').value.trim();
  const questionText = document.getElementById('question').value.trim();

  if (!questionText) {
    alert('Please enter a question!');
    return;
  }

  appendMessage(questionText, 'user');

  try {
    const response = await fetch(`${url}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: questionText }),
    });

    const data = await response.json();

    if (data.success) {
      appendMessage(data.answer, 'bot');
    } else {
      appendMessage("Failed to get an answer.", 'bot');
    }
  } catch (error) {
    appendMessage(`Error: ${error.message}`, 'bot');
  }

  // Clear the question input
  document.getElementById('question').value = '';
  scrollToBottom();
}

// Function to append messages to the chatbox
function appendMessage(message, sender) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (sender === 'user') {
    messageDiv.classList.add('user-message');
    messageDiv.textContent = message;
  } else {
    messageDiv.textContent = message;
  }

  chatBox.appendChild(messageDiv);
}

// Function to scroll to the bottom of the chatbox
function scrollToBottom() {
  const chatBox = document.getElementById('chatBox');
  chatBox.scrollTop = chatBox.scrollHeight;
}