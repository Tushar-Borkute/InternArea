import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        username: "",
        password: "",
    });

    const handleLogin = () => {
    if (
        login.username === "Tushar" &&
        login.password === "12345"
    ) {
        alert("Login Successful!");
        navigate("/Padmin");
    } else {
        alert("Invalid Username or Password");
    }
};
    function handlechange(e: React.ChangeEvent<HTMLInputElement>) {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div className="admin-page">
            <div className="admin-card">
                {/* Header */}
                <div className="admin-header">
                    <div className="admin-icon">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your jobs, internships and applications</p>
                </div>

                {/* Form */}
                <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="admin-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            onChange={handlechange}
                            value={login.username}
                            autoComplete="username"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={handlechange}
                            value={login.password}
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="admin-signin-btn" onClick={handleLogin}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;