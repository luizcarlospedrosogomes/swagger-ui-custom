import React, { useState } from 'react';
import swaggerSpec from './swagger.json';

import { EndpointList } from './EndpointList';
import "./swaggerLayout.css";
import EndpointDetails from './EndpointDetails';
import ResponseViewer from './ResponseViewer';
import LoginForm from './LoginForm';

export function CustomSwagger() {
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    const handleLogin = (username: string, password: string) => {
        // Aqui você pode fazer a chamada de autenticação real
        console.log('Usuário:', username, 'Senha:', password);
        setUser(username);
        setShowLogin(false);
    };


    return (<>

        <div className="swagger-layout">
          
            {/* Coluna 1: Endpoints */}
            <div className="swagger-column endpoints">
                <EndpointList onSelect={setSelectedEndpoint} />
            </div>

            {/* Coluna 2: Detalhes */}
            <div className="swagger-column details">
                <EndpointDetails
                    selected={selectedEndpoint}
                    setApiResponse={setApiResponse}
                    swaggerSpec={swaggerSpec} // 👈 envia resposta para terceira coluna
                />
            </div>

            {/* Coluna 3: Resultado */}
            <div className="swagger-column results">
                <ResponseViewer response={apiResponse} />
            </div>
        </div>
    </>
    );
};

export default CustomSwagger;