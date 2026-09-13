import isfahanMap from '../assets/esfapan-map.png'
import karajMap from '../assets/karaj-map.png'
import mashhadMap from '../assets/mashhad-map.png'
import northernMap from '../assets/northern-map.png'
import shirazMap from '../assets/shiraz-map.png'

const regionMaps = {
  isfahan: isfahanMap,
  karaj: karajMap,
  mashhad: mashhadMap,
  north: northernMap,
  shiraz: shirazMap,
}

function RegionScopeGraphic({ regionId, title, scopeText }) {
  const map = regionMaps[regionId]

  if (map) {
    return (
      <img
        className={`region-district-map region-district-map--${regionId}`}
        src={map}
        alt={`نقشه مناطق ${title}`}
        draggable="false"
      />
    )
  }

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
