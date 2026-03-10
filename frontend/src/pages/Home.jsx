import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import avalancheService from '../services/avalancheService';
import conditionsService from '../services/conditionsService';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Activity, ShieldCheck, AlertTriangle, ArrowUpDown, Info, Wind, CloudRain, ListFilter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const [view, setView] = useState('avalanches'); // 'avalanches' or 'conditions'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { user, isExpert } = useAuth();

    useEffect(() => {
        setCurrentPage(0);
    }, [view, pageSize]);

    useEffect(() => {
        loadData();
    }, [view, sortOrder, currentPage, pageSize]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: pageSize,
                sort: `${view === 'avalanches' ? 'date' : 'createdAt'},${sortOrder}`
            };

            let response;
            if (view === 'avalanches') {
                response = await avalancheService.getAll(params);
            } else {
                response = await conditionsService.getAll(params);
            }

            setData(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (err) {
            console.error('Eroare la încărcarea datelor:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async (id) => {
        try {
            await avalancheService.validate(id);
            loadData();
        } catch (err) {
            alert('Eroare la validare');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Monitorizare Centralizată</h1>
                    <p className="text-text-muted text-lg font-medium">Situația în timp real din munții noștri</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* View Switcher */}
                    <div className="bg-glass-bg border border-glass-border p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setView('avalanches')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${view === 'avalanches' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-text-muted'
                                }`}
                        >
                            <AlertTriangle size={16} /> Avalanșe
                        </button>
                        <button
                            onClick={() => setView('conditions')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${view === 'conditions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-text-muted'
                                }`}
                        >
                            <CloudRain size={16} /> Condiții
                        </button>
                    </div>

                    {/* Sort Switcher */}
                    <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="bg-glass-bg border border-glass-border px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-all text-white"
                        title="Sortare după dată"
                    >
                        <ArrowUpDown size={16} className="text-primary" />
                        Date: {sortOrder === 'desc' ? 'Cele mai noi' : 'Cele mai vechi'}
                    </button>

                    {/* Page Size Selector */}
                    <div className="bg-glass-bg border border-glass-border px-3 py-2 rounded-xl flex items-center gap-2">
                        <span className="text-xs font-bold text-text-muted uppercase">Pe pagină:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                        >
                            <option value={10} className="bg-background">10</option>
                            <option value={20} className="bg-background">20</option>
                            <option value={50} className="bg-background">50</option>
                        </select>
                    </div>
                </div>
            </header>

            {!user && (
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <ShieldCheck className="text-primary" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Vrei să participi?</h4>
                        <p className="text-sm text-text-muted">Autentifică-te pentru a raporta evenimente și a ajuta comunitatea.</p>
                    </div>
                    <Link to="/login" className="ml-auto btn-primary py-2 px-6 text-sm">Logare</Link>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card glass h-64 animate-pulse bg-white/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.length === 0 ? (
                        <div className="col-span-full py-24 text-center card glass bg-white/2">
                            <ListFilter className="mx-auto mb-4 text-text-muted" size={48} />
                            <h3 className="text-xl font-bold mb-1">Niciun raport găsit</h3>
                            <p className="text-text-muted">Încă nu au fost adăugate date pentru această categorie.</p>
                        </div>
                    ) : (
                        data.map((item) => (
                            <div key={item.id} className="card glass hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'VALIDATED' ? 'bg-accent-green/20 text-accent-green' : 'bg-primary/20 text-primary'
                                        }`}>
                                        {item.status === 'VALIDATED' ? 'Validat' : 'În așteptare'}
                                    </span>
                                    <div className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                                        <Calendar size={14} />
                                        {new Date(item.date || item.createdAt).toLocaleDateString('ro-RO')}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors relative z-10">
                                    {item.title || (view === 'conditions' ? 'Raport Vizibilitate & Zăpadă' : 'Fără titlu')}
                                </h3>

                                <div className="space-y-3 mb-8 flex-grow relative z-10">
                                    <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-white transition-colors">
                                        <MapPin size={16} className="text-primary shrink-0" />
                                        <span>{item.massifName || 'Masiv necunoscut'}</span>
                                    </div>
                                    {view === 'avalanches' ? (
                                        <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-white transition-colors">
                                            <Activity size={16} className="text-primary shrink-0" />
                                            <span>Mărime: {item.size || 'N/A'}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-white transition-colors">
                                                <Wind size={16} className="text-primary shrink-0" />
                                                <span>Vânt: {item.windSpeed || 0} km/h {item.windDirection}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-text-muted group-hover:text-white transition-colors">
                                                <Info size={16} className="text-primary shrink-0" />
                                                <span>Zăpadă: {item.snowDepth || 0} cm</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="pt-5 border-t border-glass-border flex items-center justify-between mt-auto relative z-10">
                                    <Link
                                        to={`/${view === 'avalanches' ? 'avalanche' : 'conditions'}/${item.id}`}
                                        className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest"
                                    >
                                        Detalii <Search size={14} />
                                    </Link>

                                    {isExpert && item.status !== 'VALIDATED' && view === 'avalanches' && (
                                        <button
                                            onClick={() => handleValidate(item.id)}
                                            className="bg-accent-green hover:bg-accent-green/80 text-white p-2 rounded-lg transition-transform hover:scale-105"
                                            title="Validează Raport"
                                        >
                                            <ShieldCheck size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-text-muted font-medium">
                    Afișare <span className="text-white">{data.length}</span> din <span className="text-white">{totalElements}</span> rezultate
                </p>

                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="p-2 rounded-xl bg-glass-bg border border-glass-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => {
                                // Dynamic page numbering logic (show current, neighbors, and first/last if many pages)
                                if (
                                    totalPages <= 7 ||
                                    i === 0 ||
                                    i === totalPages - 1 ||
                                    (i >= currentPage - 1 && i <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${currentPage === i
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-glass-bg border-glass-border text-text-muted hover:text-white hover:border-white/20'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                } else if (
                                    (i === 1 && currentPage > 2) ||
                                    (i === totalPages - 2 && currentPage < totalPages - 3)
                                ) {
                                    return <span key={i} className="px-1 text-text-muted">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 rounded-xl bg-glass-bg border border-glass-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
