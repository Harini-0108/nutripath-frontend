// ===== NutriPath API helper =====
// Frontend is now a standalone project (separate from backend), so we
// call the backend on its own URL. For local testing this is localhost:8080.
// When you deploy the backend (Render/Railway/etc.), change this to that
// deployed backend URL — e.g. "https://nutripath-backend.onrender.com"
const BASE_URL = "https://nutripath-backend.onrender.com";

function getToken() {
  return localStorage.getItem("np_token");
}

function getRole() {
  return localStorage.getItem("np_role");
}

function getEmail() {
  return localStorage.getItem("np_email");
}

function saveSession(token, email, role) {
  localStorage.setItem("np_token", token);
  localStorage.setItem("np_email", email);
  localStorage.setItem("np_role", role);
}

function clearSession() {
  localStorage.removeItem("np_token");
  localStorage.removeItem("np_email");
  localStorage.removeItem("np_role");
}

function isLoggedIn() {
  return !!getToken();
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

function isAdmin() {
  return getRole() === "ADMIN";
}

// decode role from a JWT (fallback in case we need it)
function decodeJwtRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (e) {
    return null;
  }
}

/**
 * Generic API call wrapper.
 * @param {string} path - e.g. "/foods"
 * @param {string} method - GET/POST/PUT/DELETE
 * @param {object|null} body
 */
async function apiCall(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = { method, headers };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + path, options);

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text; // plain string response (e.g. "Food item deleted successfully.")
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.classList.add("visible");
  }
}

function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = "";
    el.classList.remove("visible");
  }
}
