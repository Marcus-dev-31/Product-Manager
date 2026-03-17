export const Button = ({ variant, onClick, children }) => {
    
  const classes = {
    confirm: "btn-confirm",
    cancel: "btn-cancel",
    add: "btn-add"
  }

  return (
    <button className={classes[variant]} onClick={onClick}>
      {children}
    </button>
  )
}