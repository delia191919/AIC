import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Activity, Shield, Users, RefreshCw, X } from 'lucide-react';
import avalancheService from '../services/avalancheService';
import conditionsService from '../services/conditionsService';
import metadataService from '../services/metadataService';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [view, setView] = useState('avalanches');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters state
    const [filters, setFilters] = useState({
        title: '',
        massifId: '',
        regionId: '',
        typeId: '',
        causeId: '',
        orientationId: '',
        startDate: '',
        endDate: '',
        minAltitude: '',
        maxAltitude: '',
        minSlope: '',
        size: '',
        hasVictims: false,
        status: ''
    });

    const [metadata, setMetadata] = useState({
        massifs: [],
        regions: [],
        types: [],
        causes: [],
        orientations: []
    });

    useEffect(() => {
        const loadMetadata = async () => {
            const [massifs, regions, types, causes, orientations] = await Promise.all([
                metadataService.getMassifs(),
                metadataService.getRegions(),
                metadataService.getTypes(),
                metadataService.getCauses(),
                metadataService.getOrientations()
            ]);
            setMetadata({ massifs, regions, types, causes, orientations });
        };
        loadMetadata();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const clearFilters = () => {
        setFilters({
            title: '',
            massifId: '',
            regionId: '',
            typeId: '',
            causeId: '',
            orientationId: '',
            startDate: '',
            endDate: '',
            minAltitude: '',
            maxAltitude: '',
            minSlope: '',
            size: '',
            hasVictims: false,
            status: ''
        });
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // Clean up empty filters
            const cleanParams = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '' && v !== false)
            );

            let data = [];
            if (view === 'avalanches') {
                data = await avalancheService.search(cleanParams);
            } else {
                data = await conditionsService.search(cleanParams);
            }
            setResults(data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Run search when view changes
    useEffect(() => {
        handleSearch();
    }, [view]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Căutare Avansată</h1>
                    <p className="text-text-muted mt-2">Explorează baza de date folosind filtre complexe</p>
                </div>
                <div className="flex p-1 bg-glass-bg rounded-2xl border border-glass-border w-fit">
                    <button
                        onClick={() => setView('avalanches')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'avalanches' ? 'bg-primary text-white' : 'hover:bg-glass-bg'}`}
                    >
                        Avalanșe
                    </button>
                    <button
                        onClick={() => setView('conditions')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'conditions' ? 'bg-primary text-white' : 'hover:bg-glass-bg'}`}
                    >
                        Condiții Meteo
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleSearch} className="card glass p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-glass-border pb-4">
                            <h2 className="font-bold flex items-center gap-2"><Filter size={18} /> Filtre</h2>
                            <button type="button" onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <RefreshCw size={12} /> Resetează
                            </button>
                        </div>

                        {/* General Filters */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-text-muted px-1">Cuvânt cheie</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        name="title"
                                        value={filters.title}
                                        onChange={handleFilterChange}
                                        placeholder="Caută în titlu..."
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-text-muted px-1">Masiv</label>
                                <select name="massifId" value={filters.massifId} onChange={handleFilterChange} className="w-full">
                                    <option value="">Toate masivele</option>
                                    {metadata.massifs.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>

                            {view === 'conditions' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-text-muted px-1">Regiune</label>
                                    <select name="regionId" value={filters.regionId} onChange={handleFilterChange} className="w-full">
                                        <option value="">Toate regiunile</option>
                                        {metadata.regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-text-muted px-1">De la</label>
                                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-text-muted px-1">Până la</label>
                                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Avalanche Specific Filters */}
                        {view === 'avalanches' && (
                            <div className="space-y-4 pt-4 border-t border-glass-border">
                                <details className="group">
                                    <summary className="flex items-center justify-between cursor-pointer list-none">
                                        <span className="text-xs font-bold uppercase text-primary">Detalii Tehnice</span>
                                        <Filter size={14} className="group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-text-muted px-1">Tip</label>
                                            <select name="typeId" value={filters.typeId} onChange={handleFilterChange} className="w-full text-sm">
                                                <option value="">Oricare</option>
                                                {metadata.types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-text-muted px-1">Orientare</label>
                                            <select name="orientationId" value={filters.orientationId} onChange={handleFilterChange} className="w-full text-sm">
                                                <option value="">Toate</option>
                                                {metadata.orientations.map(o => <option key={o.id} value={o.id}>{o.direction}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-text-muted px-1">Alt. Min (m)</label>
                                                <input type="number" name="minAltitude" value={filters.minAltitude} onChange={handleFilterChange} placeholder="1500" className="w-full text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-text-muted px-1">Max Slope (°)</label>
                                                <input type="number" name="minSlope" value={filters.minSlope} onChange={handleFilterChange} placeholder="35" className="w-full text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-1 py-1">
                                            <input
                                                type="checkbox"
                                                id="hasVictims"
                                                name="hasVictims"
                                                checked={filters.hasVictims}
                                                onChange={handleFilterChange}
                                                className="w-4 h-4 rounded border-glass-border"
                                            />
                                            <label htmlFor="hasVictims" className="text-xs font-medium cursor-pointer flex items-center gap-1">
                                                <Users size={12} className="text-accent-red" /> Doar cu victime
                                            </label>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        )}

                        <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                            <Search size={18} /> Aplică Filtrele
                        </button>
                    </form>
                </aside>

                {/* Search Results */}
                <main className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                            {loading ? 'Se caută...' : `${results.length} rezultate găsite`}
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card glass h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.map(item => (
                                <div key={item.id} className="card glass group hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
                                    <div className="p-6 flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xl font-bold line-clamp-1">{item.title}</h4>
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${view === 'avalanches' ? 'bg-accent-red/10 text-accent-red' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {view === 'avalanches' ? 'Avalanșă' : 'Condiții'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.date || item.createdAt).toLocaleDateString('ro-RO')}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {metadata.massifs.find(m => m.id === item.massifId)?.name}</span>
                                        </div>

                                        {view === 'avalanches' && (
                                            <div className="flex gap-4 pt-2">
                                                <div className="text-xs">
                                                    <span className="block text-text-muted font-bold uppercase text-[9px]">Altitudine</span>
                                                    <span className="flex items-center gap-1"><Shield size={12} className="text-primary" /> {item.technicalDetails?.altitude || 'N/A'}m</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="block text-text-muted font-bold uppercase text-[9px]">Înclinație</span>
                                                    <span className="flex items-center gap-1"><Activity size={12} className="text-primary" /> {item.technicalDetails?.slopeInterpolation || 'N/A'}°</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        to={view === 'avalanches' ? `/avalanche/${item.id}` : `/conditions/${item.id}`}
                                        className="w-full bg-glass-bg border-t border-glass-border p-4 text-center text-sm font-bold hover:bg-primary hover:text-white transition-all rounded-b-3xl"
                                    >
                                        Vezi Detalii Complete
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card glass p-20 text-center space-y-4">
                            <div className="bg-glass-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <Search size={40} className="text-text-muted" />
                            </div>
                            <h3 className="text-2xl font-bold">Niciun rezultat găsit</h3>
                            <p className="text-text-muted max-w-sm mx-auto">Încearcă să ajustezi filtrele sau să folosești cuvinte cheie mai generale.</p>
                            <button onClick={clearFilters} className="btn-primary-outline mx-auto">
                                Resetează toate filtrele
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
