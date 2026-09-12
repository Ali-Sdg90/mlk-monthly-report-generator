function RegionScopeGraphic({ title, scopeText }) {
  return (
    <div className="region-scope-graphic" aria-label={`نمای کلی ${title}`}>
      <svg viewBox="0 0 280 150" aria-hidden="true">
        <ellipse cx="140" cy="75" rx="112" ry="52" />
        <ellipse cx="140" cy="75" rx="76" ry="36" />
        <path d="M28 75h224M140 23c28 22 43 39 43 52s-15 30-43 52c-28-22-43-39-43-52s15-30 43-52Z" />
        <circle cx="140" cy="75" r="8" />
        <circle cx="66" cy="54" r="4" />
        <circle cx="214" cy="96" r="4" />
      </svg>
      <strong>{title}</strong>
      <span>{scopeText}</span>
    </div>
  )
}

export default RegionScopeGraphic
