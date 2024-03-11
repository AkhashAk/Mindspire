import "./SignUp.css";
import { useState, useRef, useEffect } from "react";
import { axiosUsers } from "../components/http-common";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const userRef = useRef();
    const userEmailRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
        setErrMsg(<p>&nbsp;</p>);
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [name, emailID, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !emailID || !password) {
            return setErrMsg("Name or EmailID or Password can't be empty");
        }
        try {
            const response = await axiosUsers.post("/signup", { name, emailID, password });
            // console.log(response.data.createdUser);
            setErrMsg(`Successfully registered! Welcome ${response.data.createdUser.name}`);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            console.log(err.toString());
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('User already exists!');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Sign-up Failed');
            }
            userEmailRef.current.focus();
        }
    };

    return (
        <div className="signup-body">
            <div className="signup">
                <form onSubmit={handleSubmit}>
                    <span className="formTitle">Sign Up</span>
                    <div style={{display: "flex", rowGap: 30, flexDirection: "column"}}>
                        <div className="input-group">
                            <input
                                type="text"
                                id="name"
                                className="input-group__input"
                                ref={userRef}
                                value={name}
                                autoComplete="on"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="email" className="input-group__label">Full Name</label>
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                className="input-group__input"
                                ref={userEmailRef}
                                value={emailID}
                                autoComplete="off"
                                required
                                onChange={(e) => setEmailID(e.target.value)}
                            />
                            <label htmlFor="email" className="input-group__label">Email address</label>
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                className="input-group__input"
                                value={errMsg === "" ? password : ""}
                                required
                                minLength={6}
                                maxLength={15}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="email" className="input-group__label">Password</label>
                        </div>
                    </div>
                    <Link to="/login">Already registered? Login here</Link>
                    <p ref={errRef} className={errMsg ? "errmsg-signup" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <button type="submit" className="submitButton">
                        submit
                    </button>
                </form>
            </div>
        </div>
    )
};