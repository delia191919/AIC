import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import avalancheService from '../services/avalancheService';
import metadataService from '../services/metadataService';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Activity, ChevronLeft, Info, Users, Shield, Ruler, Maximize, Thermometer, Edit, Trash2 } from 'lucide-react';

const AvalancheDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [avalanche, setAvalanche] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState({
        massifs: [],
        types: [],
        causes: [],
        orientations: []
    });

    const { isAdmin, isExpert } = useAuth();
    const canEditOrDelete = isAdmin || isExpert;

    const handleDelete = async () => {
        if (window.confirm('Sunteți sigur că doriți să ștergeți această avalanșă? Datele vor fi pierdute definitiv!')) {
            try {
                await avalancheService.delete(id);
                navigate('/');
            } catch (err) {
                alert('Eroare la ștergerea avalanșei: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [data, massifs, types, causes, orientations] = await Promise.all([
                    avalancheService.getById(id),
                    metadataService.getMassifs(),
                    metadataService.getTypes(),
                    metadataService.getCauses(),
                    metadataService.getOrientations()
                ]);
                setAvalanche(data);
                setMetadata({ massifs, types, causes, orientations });
            } catch (err) {
                console.error('Error loading details:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center py-40">
            <div className="text-primary animate-pulse">Se încarcă detaliile evenimentului...</div>
        </div>
    );

    if (!avalanche) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Evenimentul nu a fost găsit.</h2>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <ChevronLeft size={20} /> Înapoi la Acasă
            </Link>
        </div>
    );

    const massifName = metadata.massifs.find(m => m.id === avalanche.massifId)?.name || 'Masiv necunoscut';
    const typeName = metadata.types.find(t => t.id === avalanche.typeId)?.name || 'Nespecificat';
    const causeName = metadata.causes.find(c => c.id === avalanche.causeId)?.name || 'Nespecificat';
    const orientationName = metadata.orientations.find(o => o.id === avalanche.orientationId)?.direction || 'N/A';

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-glass-bg rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold">{avalanche.title}</h1>
                        <div className="flex items-center gap-3 text-text-muted mt-1">
                            <span className="flex items-center gap-1 text-sm"><Calendar size={14} /> {new Date(avalanche.date).toLocaleDateString('ro-RO')}</span>
                            <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> {massifName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {canEditOrDelete && (
                        <div className="flex gap-2">
                            <Link 
                                to={`/avalanche/edit/${avalanche.id}`} 
                                className="btn-primary bg-blue-500 hover:bg-blue-600 flex items-center gap-2 py-2 px-4 shadow-lg"
                                title="Editează Avalanșă"
                            >
                                <Edit size={20} /> <span className="hidden sm:inline">Editează</span>
                            </Link>
                            <button 
                                onClick={handleDelete} 
                                className="btn-primary bg-accent-red hover:bg-red-600 flex items-center gap-2 py-2 px-4 shadow-lg mr-2"
                                title="Șterge Avalanșă"
                            >
                                <Trash2 size={20} /> <span className="hidden sm:inline">Șterge</span>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${avalanche.status === 'VALIDATED' ? 'bg-accent-green/20 text-accent-green' : 'bg-primary/20 text-primary'
                        }`}>
                        {avalanche.status === 'VALIDATED' ? 'Validat' : 'În așteptare'}
                    </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card glass p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-primary border-b border-glass-border pb-2">
                            <Info size={18} /> Clasificare
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Tip Eveniment</label>
                                <p className="font-medium">{typeName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Cauză Probabilă</label>
                                <p className="font-medium">{causeName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Orientare Pantă</label>
                                <p className="font-medium">{orientationName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Coordonate</label>
                                <p className="text-sm font-mono">
                                    {avalanche.latitude != null ? avalanche.latitude.toFixed(4) : 'N/A'},
                                    {avalanche.longitude != null ? avalanche.longitude.toFixed(4) : 'N/A'}
                                </p>
                            </div>
                            {avalanche.zone && (
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Zonă / Vale</label>
                                    <p className="font-medium">{avalanche.zone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card glass p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-accent-red border-b border-glass-border pb-2">
                            <Users size={18} /> Victime și Pagube
                        </h2>
                        {avalanche.damagesAndVictims ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                                    <label className="text-[10px] uppercase text-text-muted block">Prinși</label>
                                    <span className="text-xl font-bold">{avalanche.damagesAndVictims.personsCaught}</span>
                                </div>
                                <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                                    <label className="text-[10px] uppercase text-text-muted block">Decedați</label>
                                    <span className="text-xl font-bold text-accent-red">{avalanche.damagesAndVictims.personsKilled}</span>
                                </div>
                                <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                                    <label className="text-[10px] uppercase text-text-muted block">Răniți</label>
                                    <span className="text-xl font-bold">{avalanche.damagesAndVictims.personsInjured}</span>
                                </div>
                                <div className="bg-glass-bg p-3 rounded-xl border border-glass-border">
                                    <label className="text-[10px] uppercase text-text-muted block">Total Acop.</label>
                                    <span className="text-xl font-bold">{avalanche.damagesAndVictims.personsFully}</span>
                                </div>
                                <div className="col-span-2 bg-glass-bg p-3 rounded-xl border border-glass-border">
                                    <label className="text-[10px] uppercase text-text-muted block">Pagube Materiale</label>
                                    <span className="text-lg font-bold">{avalanche.damagesAndVictims.materialDamage || 0} unități</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-text-muted text-sm italic">Nu au fost raportate victime sau pagube.</p>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Technical Specs */}
                    <div className="card glass p-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                            <Activity className="text-primary" size={28} /> Detalii Tehnice
                        </h2>

                        {avalanche.technicalDetails ? (
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-text-muted text-xs uppercase font-bold tracking-wider">
                                            <Shield size={14} /> Altitudine
                                        </div>
                                        <p className="text-2xl font-bold">{avalanche.technicalDetails.altitude} <span className="text-sm font-normal text-text-muted">m</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-text-muted text-xs uppercase font-bold tracking-wider">
                                            <Thermometer size={14} /> Înclinație
                                        </div>
                                        <p className="text-2xl font-bold">{avalanche.technicalDetails.slopeInterpolation}°</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-text-muted text-xs uppercase font-bold tracking-wider">
                                            <Ruler size={14} /> Lungime
                                        </div>
                                        <p className="text-2xl font-bold">{avalanche.technicalDetails.trackLength} <span className="text-sm font-normal text-text-muted">m</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-text-muted text-xs uppercase font-bold tracking-wider">
                                            <Maximize size={14} /> Mărime
                                        </div>
                                        <p className="text-2xl font-bold">{avalanche.technicalDetails.relativeSize || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-glass-border">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Grosime Coroană</label>
                                        <p className="font-bold text-lg">{avalanche.technicalDetails.crownDepth} cm</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Lățime Coroană</label>
                                        <p className="font-bold text-lg">{avalanche.technicalDetails.crownWidth} m</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Cădere Verticală</label>
                                        <p className="font-bold text-lg">{avalanche.technicalDetails.verticalDrop} m</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Arie Acumulare</label>
                                        <p className="font-bold text-lg">{avalanche.technicalDetails.accumulationArea} m²</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Cădere Runout</label>
                                        <p className="font-bold text-lg">{avalanche.technicalDetails.runoutVerticalDrop} m</p>
                                    </div>
                                </div>

                                {avalanche.technicalDetails.crownDepthText && (
                                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                        <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
                                            <Info size={18} /> Observații Zăpadă
                                        </h3>
                                        <p className="text-text-muted leading-relaxed">
                                            {avalanche.technicalDetails.crownDepthText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                                                    <p className="text-text-muted text-center py-10 italic">Nu există detalii tehnice pentru acest eveniment.</p>
                        )}
                    </div>

                    {/* Images Section */}
                    {avalanche.imageUrls && avalanche.imageUrls.length > 0 && (
                        <div className="card glass p-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                                <Maximize className="text-accent-green" size={28} /> Galerie Foto
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {avalanche.imageUrls.flatMap(urlGroup => urlGroup.split(';')).filter(url => url.trim().length > 0).map((url, idx) => {
                                    const cleanUrl = url.trim();
                                    const backendUrl = window.location.origin.includes('localhost') ? 'http://localhost:8080' : window.location.origin.replace(':8081', ':8080');
                                    const imgSrc = cleanUrl.startsWith('http') ? cleanUrl : `${backendUrl}${cleanUrl}`;
                                    
                                    return (
                                        <div key={idx} className="relative group overflow-hidden rounded-xl border border-glass-border">
                                            <img 
                                                src={imgSrc} 
                                                alt={`Avalanșă imagine ${idx + 1}`} 
                                                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => { e.target.src = '/placeholder-mountain.jpg'; e.target.onerror = null; }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvalancheDetailsPage;
