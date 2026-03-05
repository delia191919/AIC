import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import conditionsService from '../services/conditionsService';
import metadataService from '../services/metadataService';
import { ChevronLeft, MapPin, Calendar, Info, Cloud, Thermometer, Wind, Eye } from 'lucide-react';

const ConditionsDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conditions, setConditions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState({
        massifs: [],
        regions: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [data, massifs, regions] = await Promise.all([
                    conditionsService.getById(id),
                    metadataService.getMassifs(),
                    metadataService.getRegions()
                ]);
                setConditions(data);
                setMetadata({ massifs, regions });
            } catch (err) {
                console.error('Error loading condition details:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center py-40">
            <div className="text-primary animate-pulse">Se încarcă detaliile condițiilor...</div>
        </div>
    );

    if (!conditions) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Raportul de condiții nu a fost găsit.</h2>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <ChevronLeft size={20} /> Înapoi la Acasă
            </Link>
        </div>
    );

    const massifName = metadata.massifs.find(m => m.id === conditions.massifId)?.name || 'Masiv necunoscut';
    const regionName = metadata.regions.find(r => r.id === conditions.regionId)?.name || 'Regiune necunoscută';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-glass-bg rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold">Stare Condiții</h1>
                        <div className="flex items-center gap-3 text-text-muted mt-1">
                            <span className="flex items-center gap-1 text-sm"><Calendar size={14} /> Acum</span>
                            <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> {massifName}, {regionName}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card glass p-8 space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-3 border-b border-glass-border pb-4">
                        <Cloud className="text-primary" size={24} /> Meteorologie
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-glass-bg p-6 rounded-2xl border border-glass-border flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary"><Thermometer size={24} /></div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-muted block">Temperatură</label>
                                    <span className="text-2xl font-bold">{conditions.temperature || 'N/A'} °C</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-glass-bg p-6 rounded-2xl border border-glass-border flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary"><Wind size={24} /></div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-muted block">Vânt (Viteză & Direcție)</label>
                                    <span className="text-xl font-bold">{conditions.windSpeed || 'N/A'} km/h - {conditions.windDirection || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-glass-bg p-6 rounded-2xl border border-glass-border flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary"><Eye size={24} /></div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-muted block">Vizibilitate</label>
                                    <span className="text-xl font-bold">{conditions.visibility || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card glass p-8 space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-3 border-b border-glass-border pb-4">
                        <Info className="text-primary" size={24} /> Strat de Zăpadă
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-glass-bg p-6 rounded-2xl border border-glass-border">
                            <label className="text-[10px] uppercase font-bold text-text-muted block mb-2 text-center">Grosime Strat Zăpadă</label>
                            <div className="text-center">
                                <span className="text-6xl font-black text-primary">{conditions.snowDepth || 0}</span>
                                <span className="text-xl font-bold text-text-muted ml-2">cm</span>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 min-h-[140px]">
                            <h3 className="font-bold mb-3 flex items-center gap-2 text-primary text-sm uppercase">
                                <Info size={16} /> Observații Generale
                            </h3>
                            <p className="text-text-muted leading-relaxed italic">
                                "{conditions.generalConditions || 'Nu au fost furnizate observații suplimentare.'}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConditionsDetailsPage;
