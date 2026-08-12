import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        username: "",
        password: "",
    });

    const [isloading, setisloading] = useState(false);

    function handlechange(e: React.ChangeEvent<HTMLInputElement>) {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    }

    const handlesubmit = async (e: any) => {
        e.preventDefault();
        if (login.username === "" || login.password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            setisloading(true);
            await axios.post("http://localhost:5000/api/admin/adminlogin", login);
            toast.success("Logged in successfully");
            navigate("/adminPanel");
        } catch (error) {
            console.log(error);
            toast.error("Invalid Username or Password");
        } finally {
            setisloading(false);
        }
    };

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
                <form className="admin-form" onSubmit={handlesubmit}>
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

                    <button type="submit" className="admin-signin-btn" disabled={isloading}>
                        {isloading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;