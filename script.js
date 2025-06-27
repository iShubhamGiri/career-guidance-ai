const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

const apiUrl = "https://career-guidance-ai-1.onrender.com".trim();

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

    if (res.ok && data.reply) {
      addMessage(data.reply, "bot");
    } else {
      console.error("API error:", data);
      addMessage("⚠️ AI didn't respond as expected.", "bot");
    }
  } catch (err) {
    removeTyping();
    addMessage("❌ Could not reach server.", "bot");
    console.error("Network error:", err);
  }
});

function addMessage(text, sender, isTemp = false) {
  const el = document.createElement("div");
  el.className = `message ${sender}`;
  el.textContent = text;
  if (isTemp) el.classList.add("temp");
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const temp = document.querySelector(".message.bot.temp");
  if (temp) temp.remove();
}
