import React, { useState } from "react";

export default function Layout({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    const root = document.documentElement;
    if (next === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
  };
  return (
    <div className="app-shell">
      <header className="app-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="app-title">TrafficIQ Mumbai</div>
          <div className="tagline">
            Congestion Forecast • Signal Optimization • Infrastructure ROI
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            marginLeft: "auto",
          }}
        >
          <button
            className="icon-btn theme-toggle"
            aria-label={
              theme === "light" ? "Enable dark mode" : "Enable light mode"
            }
            title={theme === "light" ? "Dark mode" : "Light mode"}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              // Moon icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
              </svg>
            ) : (
              // Sun icon
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </header>
      {children}
      <div className="footer-note" role="contentinfo">
        © {new Date().getFullYear()} TrafficIQ Mumbai · Demo (synthetic data)
      </div>
    </div>
  );
}
