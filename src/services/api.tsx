import axios from "axios"
const baseUrl = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `/api` : ``)
    ;
export const read = async (path: string) => {
    try {
        const res = await fetch(`${baseUrl}/${path}`);

        if (res.status >= 500) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error);
    }
};

export const getData = async ({ path, params }) => {
    const token = sessionStorage.getItem('jwtToken');
    const request = {
        method: 'get',
        url: baseUrl + path,
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
    }
    return await axios(request);
}

export const create = async ({ path, data }) => {
    const token = sessionStorage.getItem('jwtToken');
    const request = {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
           
        },
        url: baseUrl + path,
        data
    }
    request.headers['Authorization'] = `Bearer ${token}`;
    return await axios(request);
}

function sanitizeAuthorization(headerValue: string | undefined): string {
    if (!headerValue) return '';
    const keepLength = Math.ceil(headerValue.length * 0.05); // mantém 5%
    return headerValue.slice(0, keepLength) + '...'; // adiciona reticências
}

// Exemplo usando interceptor do axios
axios.interceptors.response.use(
    response => {
        if (response.config && response.config.headers && response.config.headers['Authorization']) {
            response.config.headers['Authorization'] = sanitizeAuthorization(response.config.headers['Authorization']);
        }
        return response;
    },
    error => {
        if (error.config && error.config.headers && error.config.headers['Authorization']) {
            error.config.headers['Authorization'] = sanitizeAuthorization(
                error.config.headers['Authorization']
            );
        }
        return Promise.reject(error);
    }
);