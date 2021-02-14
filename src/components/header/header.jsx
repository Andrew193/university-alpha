import { NavLink } from "react-router-dom"
import styles from "./style.module.css"
function Header(props) {
    return(
        <div className={styles.Container}>
            <nav className={styles.NavBar}>
                <NavLink exact to="/" activeClassName={styles.ActiveLink}>Главная</NavLink>
            </nav>
        </div>
    )
}
export default Header;