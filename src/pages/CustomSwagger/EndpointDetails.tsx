import React from 'react';

import SchemaTable from '../../componentes/Properties';
import RequestBodyViewer from '../../componentes/RequestBody';
import ResponsesViewer from '../../componentes/ResponseBody';
import ShareButton from '../../componentes/ShareButton';
import { resolveActionWrappers } from '../../util/schema';

export function EndpointDetails({ selected, swaggerSpec, setApiResponse, setOnLoad }) {

  const renderDetails = () => {
    if (!selected) {
      return <p>Selecione um método para ver os detalhes</p>;
    }

    if (!swaggerSpec) {
      return <p>Selecione um arquivo</p>;
    }

    const { path, method } = selected;

    let operation;
    try {
      operation = swaggerSpec.paths?.[path]?.[method];
    } catch {
      return <p>Selecione um arquivo</p>;
    }

    if (!operation) {
      return <p>Nenhum detalhe encontrado para {method.toUpperCase()} {path}</p>;
    }

    let schema = {};
    if (method === 'get') {
      schema.properties = swaggerSpec.components?.parameters || {};
    }
    let actionWrappers = [];

    if (['post', 'put', 'patch'].includes(method)) {
      actionWrappers = resolveActionWrappers(operation, swaggerSpec);
    }

    return (
      <div className={`opblock opblock-${method}`}>
        {/* Cabeçalho */}
        <div className={`opblock-summary opblock-summary-${method}`}>
          <button className="btn execute opblock-control__btn opblock-summary-method">
            {method.toUpperCase()}
          </button>

          <div className="opblock-summary-path-description-wrapper">
            <span className="opblock-summary-path">{path}</span>
            {operation.summary && (
              <span className="opblock-summary-description">
                {operation.summary}
              </span>
            )}
          </div>
        </div>

        {/* Corpo */}
        <div className="opblock-body">
          {/* Parameters */}
          {schema?.properties && (
            <SchemaTable
              schema={schema}
              operation={operation}
              path={path}
              method={method}
              setApiResponse={setApiResponse}
              setOnLoad={setOnLoad}
            />
          )}

          {/* Request Body */}
          {actionWrappers.length > 0 && (
            <RequestBodyViewer
              wrappers={actionWrappers}
              operation={operation}
              path={path}
              setApiResponse={setApiResponse}
              setOnLoad={setOnLoad}
            />
          )}

          {/* Responses */}
          {operation.responses && (
            <ResponsesViewer
              spec={swaggerSpec}
              responses={operation.responses}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', position: 'relative' }}>
      <ShareButton />
      {renderDetails()}
    </div>
  );
}

export default EndpointDetails;
