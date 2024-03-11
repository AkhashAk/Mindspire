import "./Logout.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/userSlice";

export default function Login() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAuth(null));
        localStorage.removeItem("token");
    }, []);

    return (
        <div className="logout-body">
            <div className="logout">
                <form className="logout-form">
                    <span className="formTitle">Successfully Logged out!</span>
                    <Link to="/login">Need to login again? Click here</Link>
                </form>
            </div>
        </div>
    )
};