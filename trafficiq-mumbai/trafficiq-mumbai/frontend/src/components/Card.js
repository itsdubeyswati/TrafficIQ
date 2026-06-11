import React from "react";

export default function Card({ title, subtitle, children, actions, status }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-titles">
          <h3>{title}</h3>
          {subtitle && <small>{subtitle}</small>}
        </div>
        {status && (
          <span className={`status ${status.type || ""}`}>{status.label}</span>
        )}
      </div>
      {actions && (
        <div className="section-actions subtle-separator">{actions}</div>
      )}
      {children}
    </div>
  );
}
