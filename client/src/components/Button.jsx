const Button =({onClick,label,type}) =>{
    return(
        <button onClick={onClick} type={type}>{label}</button>
    )
}
export default Button;