import React, { useState } from 'react';
import swaggerSpec from '../swagger.json';
import 'swagger-ui-react/swagger-ui.css';
import { EndpointList } from './EndpointList';

// ---------------- Painel principal ----------------
export function CustomSwagger() {
    const [selected, setSelected] = useState(null);

    const renderDetails = () => {
        if (!selected) {
            return <p>Selecione um método para ver os detalhes</p>;
        }

        const { path, method } = selected;
        const operation = swaggerSpec.paths[path][method];
        console.log(operation)
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
                    <div>
                        <h3>Parâmetros</h3>
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '6px' }}>Nome</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px' }}>Tipo</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px' }}>Obrigatório</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px' }}>Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(schema.properties).map(([name, prop]) => (
                                    <tr key={name}>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{name}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{prop.type}{prop.maxLength ? `(${prop.maxLength})` : ''}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{schema.required?.includes(name) ? 'Sim' : 'Não'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{prop.description || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Request body */}
                {schemaRequest && (
                    <div>
                        <h3>Request Body</h3>
                        <pre style={{
                            background: '#f6f8fa',
                            padding: '10px',
                            borderRadius: '4px',
                            overflowX: 'auto'
                        }}>
                            {JSON.stringify(schemaRequest, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Responses */}
                {operation.responses && (
                    <div>
                        <h3>Responses</h3>
                        <pre style={{
                            background: '#f6f8fa',
                            padding: '10px',
                            borderRadius: '4px',
                            overflowX: 'auto'
                        }}>
                            {JSON.stringify(operation.responses, null, 2)}
                        </pre>
                    </div>
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