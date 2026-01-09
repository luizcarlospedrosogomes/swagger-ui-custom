import React, { useEffect, useState } from 'react';

import { EndpointList } from './EndpointList';
import "./swaggerLayout.css";
import EndpointDetails from './EndpointDetails';
import ResponseViewer from './ResponseViewer';
import SwaggerLoader from './SwaggerLoader';
import { useSwaggerServer } from './context/SwaggerServerContext';
import ApiFileSelector from './componentes/ApiFileSelector';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


export function CustomSwagger() {
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const { schema, files, config } = useSwaggerServer(); // pega a spec do contexto
    const navigate = useNavigate();
    const { method, pathParam } = useParams();
    const location = useLocation();
    const [leftWidth, setLeftWidth] = useState(280);
    const [rightWidth, setRightWidth] = useState(420);

    useEffect(() => {
        if (method && pathParam) {
            setSelectedEndpoint({ method, path: "/" + pathParam });
        }
    }, [method, pathParam]);

    if (!files) {
        return (
            <>
                <SwaggerLoader /> {/* dispara o fetch */}
                <div>Carregando Swagger...</div>
            </>
        );
    }

    const setEnpointSelected = ({ method, path }) => {
        setApiResponse(null)
        setSelectedEndpoint({ method, path })
        const params = new URLSearchParams(location.search);
        navigate(`/endpoint${path.startsWith("/") ? path : `/${path}`}/${method}?${params.toString()}`);
    }
    
    const startResize = (side: 'left' | 'right', e: React.MouseEvent) => {
  const startX = e.clientX;

  const onMove = (ev: MouseEvent) => {
    const delta = ev.clientX - startX;

    if (side === 'left') {
      setLeftWidth(w => Math.max(180, w + delta));
    } else {
      setRightWidth(w => Math.max(280, w - delta));
    }
  };

  const onUp = () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
};

    return (<>
        <header className="swagger-header swagger-ui">
            <div className="header-left">
                <h1>{config?.titleApp}</h1>
            </div>

            <div className="header-right">
                <ApiFileSelector files={files} />
                <button
                    className="btn-destroy opblock opblock-delete"
                    onClick={() => {
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        </header>

        <div className="swagger-container swagger-ui">
            <section className="swagger-service-info swagger-ui">
                <h2>{schema?.info?.title}</h2>
                <p>{schema?.info?.description}</p>
                <span className="version">Version: {schema?.info?.version}</span>
            </section>
            <div className="swagger-layout">

                {/* Coluna 1: Endpoints */}
                <div className="swagger-column endpoints">
                    <EndpointList onSelect={setEnpointSelected} />
                </div>
                <div className="column-divider" onMouseDown={(e) => startResize('left', e)}>
                    
                </div>
                {/* Coluna 2: Detalhes */}
                <div className="swagger-column details" style={{ width: leftWidth }}>
                    <EndpointDetails
                        selected={selectedEndpoint}
                        setApiResponse={setApiResponse}
                        swaggerSpec={schema}
                    />
                </div>
                {/* Divider direito */}
                <div className="column-divider" onMouseDown={(e) => startResize('right', e)}>
                    
                </div>

                {/* Coluna direita */}
                {/* Coluna 3: Resultado */}
                <div className="swagger-column results" style={{ width: rightWidth }}>
                    <ResponseViewer response={apiResponse} />
                </div>
            </div>
        </div>
    </>
    );
};

export default CustomSwagger;