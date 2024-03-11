import "./Login.css";
import { useState, useRef, useEffect } from "react";
import { axiosUsers } from "../components/http-common";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/userSlice";

export default function Login() {
    const dispatch = useDispatch();
    const userRef = useRef();
    const passwordRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPass, setErrPass] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
        setErrEmail("");
        setErrPass("");
    }, [emailID, password]);

    const validateEmail = (email) => {
        // Regular expression htmlFor email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailID || !password) {
            return setErrMsg("EmailID or Password can't be empty");
        }
        if (!validateEmail(emailID)) return setErrEmail("Please enter valid email address");
        if (!(password.length >= 6 && password.length <= 15)) return setErrPass("Please enter valid password (password length should be between 6 to 15)")
        try {
            const response = await axiosUsers.post("/login", { emailID, password });
            // console.log(response);
            // console.log({ _id: response.data._id, name: response.data.name, emailID: response.data.emailID, token: response.data.token, refreshToken: response.data.refreshToken });
            dispatch(setAuth({ _id: response.data._id, name: response.data.name, emailID: response.data.emailID, token: response.data.token, refreshToken: response.data.refreshToken }));
            navigate("/");
        } catch (err) {
            console.log(err.toString());
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
                passwordRef.current.focus();
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="login-body">
            <div className="login">
                <form onSubmit={handleSubmit}>
                    <span className="formTitle">Login</span>
                    <div className="input-group">
                        <input
                            type="text"
                            id="email"
                            className="input-group__input"
                            ref={userRef}
                            value={emailID}
                            autoComplete="off"
                            required
                            onChange={(e) => setEmailID(e.target.value)}
                        />
                        <label htmlFor="email" className="input-group__label">Email address</label>
                        <p ref={errRef} className={errEmail ? "errmsg-input-fields" : "offscreen"} aria-live="assertive">{errEmail}</p>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            className="input-group__input"
                            ref={passwordRef}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="input-group__label">Password</label>
                        <p ref={errRef} className={errPass ? "errmsg-input-fields" : "offscreen"} aria-live="assertive">{errPass}</p>
                    </div>
                    <Link to="/signup">New here? Sign up now!</Link>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <button type="submit" className="submitButton">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
};