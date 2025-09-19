import React, { useState } from 'react';

import { EndpointList } from './EndpointList';
import "./swaggerLayout.css";
import EndpointDetails from './EndpointDetails';
import ResponseViewer from './ResponseViewer';
import SwaggerLoader from './SwaggerLoader';
import { useSwaggerServer } from './context/SwaggerServerContext';
import ApiFileSelector from './componentes/ApiFileSelector';
import { useNavigate } from 'react-router-dom';


export function CustomSwagger() {
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const { schema, files, config } = useSwaggerServer(); // pega a spec do contexto
    const navigate = useNavigate();

    if (!files) {
        return (
            <>
                <SwaggerLoader /> {/* dispara o fetch */}
                <div>Carregando Swagger...</div>
            </>
        );
    }

    const setEnpointSelected = ({method, path}) => {
        setApiResponse(null)
        setSelectedEndpoint({ method, path })
    }
    console.log(config)
    return (<>
        <h1 className="swagger-ui">{config?.titleApp}</h1>
        <div className="swagger-container swagger-ui">
            {/* File selector no topo, à direita */}
            <div className="file-selector-wrapper">
                <ApiFileSelector files={files} />
                <button
                    className=" btn-destroy opblock opblock-delete opblock opblock-delete " // reutiliza estilo do Swagger
                    onClick={() => {
                        localStorage.setItem('jwtToken', null);
                        navigate('/login');
                    }}
                >
                    Logout
                </button>
            </div>
            <h2>{schema?.info?.title}</h2>
            <p>{schema?.info?.description}</p>
            {schema?.info?.version}
            <div className="swagger-layout">

                {/* Coluna 1: Endpoints */}
                <div className="swagger-column endpoints">
                    <EndpointList onSelect={setEnpointSelected} />
                </div>

                {/* Coluna 2: Detalhes */}
                <div className="swagger-column details">
                    <EndpointDetails
                        selected={selectedEndpoint}
                        setApiResponse={setApiResponse}
                        swaggerSpec={schema}
                    />
                </div>

                {/* Coluna 3: Resultado */}
                <div className="swagger-column results">
                    <ResponseViewer response={apiResponse} />
                </div>
            </div>
        </div>
    </>
    );
};

export default CustomSwagger;