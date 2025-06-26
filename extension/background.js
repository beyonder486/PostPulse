chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "POST_METRICS") {
    chrome.storage.local.get("supabase_token", ({ supabase_token }) => {
      if (!supabase_token) {
        console.warn("No Supabase token found in chrome.storage.local");
        sendResponse({ success: false, error: "No Supabase token found" });
        return;
      }

      fetch("http://localhost:3000/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: message.data,
          user_token: supabase_token
        })
      })
        .then((res) => {
          console.log("✅ Metrics sent to API with status:", res.status);
          sendResponse({ success: true });
        })
        .catch(err => {
          console.error("❌ Failed to send metrics", err);
          sendResponse({ success: false, error: err.message });
        });
    });

    return true; // Keeps the message channel alive
  }

  if (message.type === "PING") {
    sendResponse({ pong: true });
  }

  if (message.type === "GET_SUPABASE_TOKEN") {
    chrome.storage.local.get("supabase_token", (result) => {
      sendResponse({ supabase_token: result.supabase_token });
    });
    return true; // Keep the message channel open for async response
  }

  console.log("📦 Background received message:", message);
});
