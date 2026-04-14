import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mountain, LogOut, User, ShieldCheck, PlusCircle, Search, Users, Cloud } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin, isExpert } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 py-4 mb-10">
            <div className="container flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <Mountain className="text-primary" size={28} />
                    <span className="text-text-main">AIC Avalanse</span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Acasă</Link>

                        <Link to="/search" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <Search size={18} />
                            <span>Căutare</span>
                        </Link>

                        <a href="/api/meteo" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <Cloud size={18} />
                            <span>Risc Avalanșe (PDF)</span>
                        </a>

                        <Link to="/meteo" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <Cloud size={18} />
                            <span>Prognoză Montană</span>
                        </Link>

                        {user && (
                            <Link to="/add-avalanche" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                <PlusCircle size={18} />
                                <span>Eveniment Nou</span>
                            </Link>
                        )}

                        {isExpert && (
                            <Link to="/validation" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                <ShieldCheck size={18} />
                                <span>Validare</span>
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin/users" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                <Users size={18} />
                                <span>Utilizatori</span>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 text-xs text-text-muted bg-white/5 py-1.5 px-3 rounded-full">
                                    <User size={14} />
                                    <span className="font-medium">{user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-accent-red/20 text-accent-red rounded-xl transition-colors"
                                    title="Deconectare"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium hover:text-primary">Intră în cont</Link>
                                <Link to="/register" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Cont nou</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
