const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const historyBox = document.getElementById("history");

let conversation = [];

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  conversation.push({ role: "user", content: message });
  historyBox.innerHTML += `<div class="history-item">${message}</div>`;

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const { reply } = await res.json();

    appendMessage(reply, "bot");
    conversation.push({ role: "bot", content: reply });

  } catch {
    appendMessage("Error: Could not reach server.", "bot");
  }
});

function appendMessage(text, sender) {
  const el = document.createElement("div");
  el.className = `message ${sender}`;
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

historyBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-item")) {
    userInput.value = e.target.textContent;
    userInput.focus();
  }
});
