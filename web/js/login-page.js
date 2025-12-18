// web/js/login-page.js

const out = document.getElementById("loginStatus");
const setStatus = (msg) => { if (out) out.textContent = msg; };

// Google calls this by name from data-callback="handleCredentialResponse"
window.handleCredentialResponse = async (response) => {
  try {
    setStatus("Signing in with Google...");

    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google login failed");

    // Store YOUR app session
    localStorage.setItem("pd_session", data.token);
    localStorage.setItem("pd_user", JSON.stringify(data.user));

    setStatus(`✅ Signed in as ${data.user.email}`);
    window.location.href = "../index.html";
  } catch (err) {
    setStatus(`❌ ${err.message}`);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clearLoginStatus")?.addEventListener("click", () => {
    localStorage.removeItem("pd_session");
    localStorage.removeItem("pd_user");
    setStatus("Signed out locally.");
  });
});
