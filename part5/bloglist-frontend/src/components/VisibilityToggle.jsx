const VisibilityToggle = ({ children, buttonLabel, visible, setVisible }) => {
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <button name={buttonLabel} onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button name="cancel" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </>
  )
}

export default VisibilityToggle
