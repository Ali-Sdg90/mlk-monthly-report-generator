function AppHeader() {
  return (
    <header className="site-header">
      <img
        className="project-logo"
        src={`${import.meta.env.BASE_URL}project-logo.webp`}
        alt=""
        width="1254"
        height="1254"
      />
      <div className="brand-copy">
        <h1>MLK Monthly Report Generator</h1>
        <p>Create professional monthly real estate reports with ease.</p>
      </div>
    </header>
  )
}

export default AppHeader
