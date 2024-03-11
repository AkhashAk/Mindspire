import "./Navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, authorizedUser } from '../features/userSlice';

export const Navbar = () => {
    const auth = useSelector(authorizedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch(setAuth(null));
        localStorage.removeItem("token");
        // console.log("Auth after logout =", auth);
        navigate("/login");
    }
    return (
        <nav className='navBar'>
            <ul className='nav'>
                <li>
                    <Link to="/"><FontAwesomeIcon icon="fa-solid fa-house" size="lg" /></Link>
                </li>
                <li>
                    <Link to="/create"><FontAwesomeIcon icon="fa-solid fa-feather-pointed" size="lg" /> write</Link>
                </li>
            </ul>
            <ul className='nav'>
                <li>
                    <span>Welcome {auth?.name}</span>
                </li>
                <li>
                    <Link to="/logout" >
                        <FontAwesomeIcon onClick={logout} icon="fa-solid fa-arrow-right-from-bracket" size="lg" />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}