/**
 * Configuración para URLs firmadas en React
 */
import { useState, useEffect } from 'react';

// URL base para el servidor de URLs firmadas
const getSignedUploadsBaseUrl = () => {
    if (process.env.REACT_APP_SIGNED_UPLOADS_URL) {
        return process.env.REACT_APP_SIGNED_UPLOADS_URL;
    }
    return 'https://hseq.meridianltda.com/backend/signed-uploads.php';
};

export const SIGNED_UPLOADS_BASE = getSignedUploadsBaseUrl();

/**
 * Cliente para manejar URLs firmadas
 */
class SignedUrlClient {
    constructor(baseUrl = SIGNED_UPLOADS_BASE) {
        this.baseUrl = baseUrl;
    }

    /**
     * Obtiene una URL firmada desde el backend
     * @param {string} fileName - Nombre del archivo
     * @param {number} ttl - Tiempo de vida en segundos (opcional)
     * @returns {Promise<string>} URL firmada
     */
    async getSignedUrl(fileName, ttl = 600) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseUrl.replace('/signed-uploads.php', '/api/signed-url')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileName,
                    ttl
                })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.signedUrl;
        } catch (error) {
            console.error('Error obteniendo URL firmada:', error);
            throw error;
        }
    }

    /**
     * Obtiene múltiples URLs firmadas
     * @param {string[]} fileNames - Lista de nombres de archivos
     * @param {number} ttl - Tiempo de vida en segundos (opcional)
     * @returns {Promise<Object>} Objeto con URLs firmadas
     */
    async getMultipleSignedUrls(fileNames, ttl = 600) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseUrl.replace('/signed-uploads.php', '/api/signed-urls')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileNames,
                    ttl
                })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.signedUrls;
        } catch (error) {
            console.error('Error obteniendo URLs firmadas:', error);
            throw error;
        }
    }
}

// Instancia global
export const signedUrlClient = new SignedUrlClient();

/**
 * Hook personalizado para usar URLs firmadas
 */
export const useSignedUrl = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSignedUrl = async (fileName, ttl = 600) => {
        setLoading(true);
        setError(null);
        
        try {
            const url = await signedUrlClient.getSignedUrl(fileName, ttl);
            return url;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getSignedUrl,
        loading,
        error
    };
};

/**
 * Componente de imagen con URL firmada
 */
export const SignedImage = ({ fileName, alt, className, ttl = 600, fallbackSrc, ...props }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { getSignedUrl } = useSignedUrl();

    useEffect(() => {
        if (!fileName) {
            setLoading(false);
            return;
        }

        const loadSignedUrl = async () => {
            try {
                const url = await getSignedUrl(fileName, ttl);
                setImageUrl(url);
            } catch (err) {
                console.error('Error cargando imagen firmada:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadSignedUrl();
    }, [fileName, ttl]);

    if (loading) {
        return <div className={`${className} bg-gray-200 animate-pulse`} {...props} />;
    }

    if (error || !imageUrl) {
        return fallbackSrc ? (
            <img src={fallbackSrc} alt={alt} className={className} {...props} />
        ) : (
            <div className={`${className} bg-gray-300 flex items-center justify-center`} {...props}>
                <span className="text-gray-500">Error cargando imagen</span>
            </div>
        );
    }

    return (
        <img 
            src={imageUrl} 
            alt={alt} 
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default {
    signedUrlClient,
    useSignedUrl,
    SignedImage
};
