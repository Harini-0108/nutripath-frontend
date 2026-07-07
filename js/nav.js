// Injects the topbar + tab navigation into any page that includes this script.
// Expects a <div id="app-shell"></div> placeholder in the page body,
// and a data-page attribute on the <body> tag to mark the active tab.

function renderShell() {
  requireLogin();

  const activePage = document.body.getAttribute("data-page") || "";
  const role = getRole();
  const email = getEmail();

  const tabs = [
    { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { key: "foods", label: "Foods", href: "foods.html" },
    { key: "plans", label: "Plans", href: "plans.html" },
    { key: "profiles", label: "Profiles", href: "profiles.html" },
    { key: "trackers", label: "Meal Trackers", href: "trackers.html" },
  ];

  const tabsHtml = tabs
    .map(
      (t) =>
        `<a href="${t.href}" class="${t.key === activePage ? "active" : ""}">${t.label}</a>`
    )
    .join("");

  const shell = document.getElementById("app-shell");
  shell.innerHTML = `
    <div class="topbar">
      <div class="brand">Nutri<span>Path</span></div>
      <div class="session-info">
        <span>${email}</span>
        <span class="role-badge">${role}</span>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
    <nav class="tabs">${tabsHtml}</nav>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

renderShell();
