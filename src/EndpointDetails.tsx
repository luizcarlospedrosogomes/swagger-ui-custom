import React, { useState } from 'react';

import SchemaTable from './componentes/Properties';
import RequestBodyViewer from './componentes/RequestBody';
import ResponsesViewer from './componentes/ResponseBody';


export function EndpointDetails({ selected, swaggerSpec, setApiResponse }) {

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
            try {
                ref = operation.requestBody.content['application/json'].schema.$ref;
                const refKey = ref.split('/').pop();
                schemaRequest = swaggerSpec.components.schemas[refKey].properties;
            } catch (error) {
                console.log(error)
                schemaRequest = {}
            }

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
            <div className={`opblock opblock-${method}`}>
                {/* Cabeçalho resumido */}
                <div className={`opblock-summary opblock-summary-${method}`}>
                    <span className="opblock-summary-method">{method.toUpperCase()}</span>
                    <span className="opblock-summary-path">{path}</span>
                    {operation.summary && (
                        <span className="opblock-summary-description">
                            {operation.summary}
                        </span>
                    )}
                </div>

                {/* Corpo da operação */}
                <div className="opblock-body">
                    {/* Parâmetros */}
                    {schema && schema.properties && (
                        <SchemaTable
                            schema={schema}
                            operation={operation}
                            path={path}
                            method={method}
                            setApiResponse={setApiResponse}
                        />
                    )}

                    {/* Request body */}
                    {schemaRequest && Object.keys(schemaRequest).length > 0 && (
                        <RequestBodyViewer schemaRequest={schemaRequest} />
                    )}

                    {/* Responses */}
                    {operation.responses && (
                        <ResponsesViewer spec={swaggerSpec} responses={operation.responses} />
                    )}
                </div>
            </div>
        );
    };

    return (

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {renderDetails()}
        </div>

    );
}

export default EndpointDetails;