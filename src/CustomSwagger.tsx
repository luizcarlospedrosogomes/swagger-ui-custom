import React, { useState } from 'react';
import swaggerSpec from './swagger.json';
import 'swagger-ui-react/swagger-ui.css';
import { EndpointList } from './EndpointList';
import SchemaTable from './componentes/Properties';
import RequestBodyViewer from './componentes/RequestBody';
import ResponsesViewer from './componentes/ResponseBody';


export function CustomSwagger() {
    const [selected, setSelected] = useState(null);

    const renderDetails = () => {
        if (!selected) {
            return <p>Selecione um método para ver os detalhes</p>;
        }

        const { path, method } = selected;
        const operation = swaggerSpec.paths[path][method];
    
        let ref = null;
        let schema = {}
        let schemaRequest = {}
        if (method === 'post' || method === 'put' || method === 'patch') {
            ref = operation.requestBody.content['application/json'].schema.$ref;
            const refKey = ref.split('/').pop();
            schemaRequest = swaggerSpec.components.schemas[refKey].properties;
        }

        if (method === 'get') {
            schema.properties = swaggerSpec.components.parameters || {}
        }
        if (!operation) {
            return <p>Nenhum detalhe encontrado para {method.toUpperCase()} {path}</p>;
        }

        if (Array.isArray(operation)) {
            operation.parameters = operation
        }
        console.log("operation", operation)
        return (
            <div>
                <h2>{method.toUpperCase()} {path}</h2>
                {operation.summary && <p><b>Resumo:</b> {operation.summary}</p>}
                {operation.description && <p><b>Descrição:</b> {operation.description}</p>}

                {/* Parâmetros */}
                {schema && schema.properties && (
                     <SchemaTable schema={schema} operation={operation} path={path} method={method}  />
                )}

                {/* Request body */}
                {schemaRequest && (
                     <RequestBodyViewer schemaRequest={schemaRequest} />
                )}

                {/* Responses */}
                {operation.responses && (
                    <ResponsesViewer spec={swaggerSpec} responses={operation.responses} />
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: '"Open Sans", sans-serif' }}>
            <EndpointList onSelect={setSelected} />
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {renderDetails()}
            </div>
        </div>
    );
}


export default CustomSwagger;