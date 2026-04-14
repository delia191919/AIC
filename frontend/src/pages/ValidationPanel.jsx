import { useState, useEffect } from 'react';
import avalancheService from '../services/avalancheService';
import { ShieldCheck, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';

const ValidationPanel = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPending();
    }, []);

    const [debugInfo, setDebugInfo] = useState('');

    const loadPending = async () => {
        try {
            const params = { page: 0, size: 100, sort: 'id,desc' };
            const response = await avalancheService.getAll(params);
            const allItems = response?.content || [];
            
            setDebugInfo(`Fetched ${allItems.length} items from server.`);
            
            const unvalidated = allItems.filter(a => a.status !== 'VALIDATED');
            setPending(unvalidated);
        } catch (err) {
            console.error(err);
            setDebugInfo(`Error fetching: ${err.message}`);
            setPending([]);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async (id) => {
        await avalancheService.validate(id);
        loadPending();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ești sigur că vrei să ștergi acest raport?')) {
            await avalancheService.delete(id);
            loadPending();
        }
    };

    if (loading) return <div className="text-center py-20">Se încarcă rapoartele...</div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Panou de Validare</h1>
                <p className="text-text-muted mt-2">Gestionează rapoartele ce necesită verificare expertă.</p>
            </header>

            {pending.length === 0 ? (
                <div className="card glass p-20 text-center">
                    <ShieldCheck className="mx-auto mb-4 text-accent-green opacity-20" size={64} />
                    <p className="text-text-muted">Nu există rapoarte în așteptare.</p>
                    <p className="text-xs text-text-muted mt-2 opacity-50">Debug info: {debugInfo}</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pending.map(av => (
                        <div key={av.id} className="card glass flex justify-between items-center p-6 border-l-4 border-primary">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{av.title}</h3>
                                <div className="flex gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {av.date}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {av.massifName}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleValidate(av.id)}
                                    className="bg-accent-green hover:bg-accent-green/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                                >
                                    <ShieldCheck size={18} /> Validare
                                </button>
                                <button
                                    onClick={() => handleDelete(av.id)}
                                    className="bg-accent-red/10 hover:bg-accent-red/20 text-accent-red px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                                >
                                    <Trash2 size={18} /> Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ValidationPanel;
