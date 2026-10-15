function SaveTripToggle({ checked, destinationName, onChange }) {
  return (
    <button
      className={`save-trip${checked ? ' is-saved' : ''}`}
      type="button"
      aria-pressed={checked}
      aria-label={`${checked ? 'Remove' : 'Save'} ${destinationName} ${checked ? 'from' : 'to'} saved trips`}
      onClick={() => onChange(!checked)}
    >
      {checked ? '♥ Saved' : '♡ Save trip'}
    </button>
  )
}

export default SaveTripToggle
