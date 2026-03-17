export const Button = ({ variant, onClick, children }) => {

  const classes = {
    confirm: "btn-confirm",
    cancel: "btn-cancel",
    add: "btn-add",
    neutral: "btn-neutral"
  }

  return (
    <button className={classes[variant]} onClick={onClick}>
      {children}
    </button>
  )
}