import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Key, User as UserIcon, Shield, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.email, formData.password, formData.role);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Eroare la înregistrare. Utilizatorul sau email-ul ar putea exista deja.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="card glass p-10 text-center max-w-md">
                    <CheckCircle className="text-accent-green mx-auto mb-4" size={64} />
                    <h1 className="text-3xl font-bold mb-2">Cont creat cu succes!</h1>
                    <p className="text-text-muted">Te redirecționăm către pagina de login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-10">
            <div className="card glass w-full max-w-lg p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/20 p-4 rounded-full mb-4">
                        <UserPlus className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold">Creare Cont</h1>
                    <p className="text-text-muted mt-2">Alătură-te comunității de monitorizare</p>
                </div>

                {error && (
                    <div className="bg-accent-red/10 border border-accent-red/20 text-accent-red p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                                <UserIcon size={16} /> Nume utilizator
                            </label>
                            <input
                                name="username"
                                className="w-full"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                                <Mail size={16} /> Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                className="w-full"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                            <Key size={16} /> Parolă
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="w-full"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                            <Shield size={16} /> Rol dorit
                        </label>
                        <select
                            name="role"
                            className="w-full"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">User - Doar raportare</option>
                            <option value="contributor">Contributor - Raportare avansată</option>
                            <option value="expert">Expert - Validare rapoarte</option>
                            <option value="admin">Admin - Manager sistem</option>
                        </select>
                        <p className="text-[10px] text-text-muted px-1">* Rolurile de Expert și Admin pot necesita aprobare manuală (opțional).</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 mt-4"
                    >
                        {loading ? 'Se înregistrează...' : 'Creează cont'}
                    </button>
                </form>

                <p className="text-center mt-8 text-text-muted text-sm">
                    Ai deja cont? <Link to="/login" className="text-primary hover:underline font-medium">Autentifică-te</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
