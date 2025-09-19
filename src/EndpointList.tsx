import React, { useState } from 'react';
import swaggerSpec from './swagger.json';
import 'swagger-ui-react/swagger-ui.css';

// ---------------- Sidebar ----------------
export function EndpointList({ onSelect }) {
  const [open, setOpen] = useState({});

  const toggleOpen = (path: string) => {
    setOpen((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  console.log(swaggerSpec)
  const endpoints = Object.entries(swaggerSpec.paths)

  return (
    <div className="swagger-ui" style={{
      width: '280px',
      borderRight: '1px solid #e1e4e8',
      padding: '10px 0',
      backgroundColor: '#f7f7f7',
      fontFamily: '"Open Sans", sans-serif',
      overflowY: 'auto'
    }}>
      <h3 style={{
        margin: '0 10px 10px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#323232'
      }}>
        Endpoints analysCode ({endpoints.length})
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {endpoints.map(([path, methods]) => (
          <li key={path} style={{ marginBottom: '4px' }}>
            {/* Cabeçalho do path */}
            <div
              onClick={() => toggleOpen(path)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0366d6',
                backgroundColor: open[path] ? '#eaf5ff' : 'transparent'
              }}
            >
              {path}</div>

            {/* Métodos */}
            {open[path] && (
              <ul style={{
                listStyle: 'none',
                padding: '4px 0 4px 24px',
                margin: 0
              }}>
                {Object.keys(methods).map(method => (
                  <li
                    key={`${method}-${path}`}
                    onClick={() => onSelect && onSelect({ method, path })}
                    style={{
                      padding: '4px 0',
                      fontSize: '13px',
                      color: '#444',
                      cursor: 'pointer'
                    }}
                  >
                    <span  className="opblock-summary-method" style={{
                      display: 'inline-block',
                      minWidth: '50px',
                      fontWeight: 600,
                      color: method === 'get' ? '#0f6ab4'
                        : method === 'post' ? '#10a54a'
                        : method === 'put' ? '#c5862b'
                        : method === 'delete' ? '#a41e22'
                        : '#555'
                    }}>
                      {method.toUpperCase()}
                    </span>
                    {path}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Painel principal ----------------
export function CustomSwagger() {
  const [selected, setSelected] = useState(null);

  const renderDetails = () => {
    if (!selected) {
      return <p>Selecione um método para ver os detalhes</p>;
    }

    const { path, method } = selected;
    const operation = swaggerSpec.paths[path][method];

    if (!operation) {
      return <p>Nenhum detalhe encontrado para {method.toUpperCase()} {path}</p>;
    }

    return (
      <div>
        <h2>{method.toUpperCase()} {path}</h2>
        {operation.summary && <p><b>Resumo:</b> {operation.summary}</p>}
        {operation.description && <p><b>Descrição:</b> {operation.description}</p>}

        {/* Parâmetros */}
        {operation.parameters && operation.parameters.length > 0 && (
          <div>
            <h3>Parâmetros</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '6px' }}>Nome</th>
                  <th style={{ border: '1px solid #ddd', padding: '6px' }}>Local</th>
                  <th style={{ border: '1px solid #ddd', padding: '6px' }}>Obrigatório</th>
                  <th style={{ border: '1px solid #ddd', padding: '6px' }}>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {operation.parameters.map((param) => (
                  <tr key={param.name}>
                    <td style={{ border: '1px solid #ddd', padding: '6px' }}>{param.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '6px' }}>{param.in}</td>
                    <td style={{ border: '1px solid #ddd', padding: '6px' }}>{param.required ? 'Sim' : 'Não'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '6px' }}>{param.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Request body */}
        {operation.requestBody && (
          <div>
            <h3>Request Body</h3>
            <pre style={{
              background: '#f6f8fa',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto'
            }}>
              {JSON.stringify(operation.requestBody, null, 2)}
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
