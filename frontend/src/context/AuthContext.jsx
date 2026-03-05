import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/signin', { username, password });
        const data = response.data;
        if (data.accessToken || data.token) {
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const register = (username, email, password, role) => {
        return api.post('/auth/signup', {
            username,
            email,
            password,
            role
        });
    };

    const isAdmin = user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');
    const isExpert = user?.roles?.some(role => role === 'ROLE_EXPERT' || role === 'EXPERT') || isAdmin;

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAdmin, isExpert, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
