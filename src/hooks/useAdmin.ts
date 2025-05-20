import { useState, useEffect } from "react";

// Simple admin authentication (in a real app, this would use proper authentication)
// This is a placeholder implementation - in a production app you'd use proper auth
export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [adminPassword, setAdminPassword] = useState<string>("");
    const correctPassword = "admin123"; // In a real app, this would be securely stored

    useEffect(() => {
        // Check local storage for admin status on component mount
        const storedAdminStatus = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(storedAdminStatus);
    }, []);

    const login = (password: string) => {
        setAdminPassword(password);
        const loginSuccessful = password === correctPassword;

        if (loginSuccessful) {
            setIsAdmin(true);
            localStorage.setItem("isAdmin", "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        setAdminPassword("");
        localStorage.removeItem("isAdmin");
    };

    return {
        isAdmin,
        login,
        logout,
        adminPassword,
    };
};
