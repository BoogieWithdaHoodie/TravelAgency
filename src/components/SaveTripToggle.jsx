// Controlled button: its parent provides the saved value and handles changes.
function SaveTripToggle({ checked, destinationName, onChange }) {
  return (
    <button
      className={`absolute right-3 top-3 inline-flex min-h-10 items-center rounded-full border border-white/70 px-3 text-xs font-bold shadow-sm transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-travel-accent ${
        checked
          ? 'bg-travel-primary text-white'
          : 'bg-white/95 text-travel-primary-dark hover:bg-travel-accent-light'
      }`}
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
