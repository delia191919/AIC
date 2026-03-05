import api from './api';

const metadataService = {
    getMassifs: async () => {
        const response = await api.get('/metadata/massifs');
        return response.data;
    },
    getTypes: async () => {
        const response = await api.get('/metadata/types');
        return response.data;
    },
    getCauses: async () => {
        const response = await api.get('/metadata/causes');
        return response.data;
    },
    getOrientations: async () => {
        const response = await api.get('/metadata/orientations');
        return response.data;
    },
    getRegions: async () => {
        const response = await api.get('/metadata/regions');
        return response.data;
    }
};

export default metadataService;
