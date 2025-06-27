const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

const apiUrl = "https://career-guidance-ai-1.onrender.com"; // backend URL

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  addMessage("Typing...", "bot", true);

  try {
    const res = await fetch(`${apiUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    removeTyping();
    addMessage(data.reply, "bot");
  } catch (err) {
    removeTyping();
    addMessage("❌ Unable to reach server. Try again later.", "bot");
  }
});

function addMessage(text, sender, isTyping = false) {
  const el = document.createElement("div");
  el.className = `message ${sender}`;
  if (isTyping) el.classList.add("typing");
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingMsg = document.querySelector(".message.bot.typing");
  if (typingMsg) typingMsg.remove();
}
