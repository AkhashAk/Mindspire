import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useSelector } from 'react-redux';
import { authorizedUser } from '../features/userSlice';

const Layout = () => {
    const auth = useSelector(authorizedUser);
    return (
        <>
            {auth ? <Navbar /> : null}
            <div className="App">
                <Outlet />
            </div>
        </>
    )
}

export default Layout