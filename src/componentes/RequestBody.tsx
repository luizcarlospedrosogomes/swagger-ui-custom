import React, { useEffect, useState } from 'react';
import "./swaggerStyles.css"; // 👈 importa seu CSS global
import { useSwaggerServer } from '../context/SwaggerServerContext';
import { create, getData } from '../services/api';

const RequestBodyViewer = ({ schemaRequest, setApiResponse, setOnLoad, path }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [formData, setFormData] = useState({});
  const [jsonText, setJsonText] = useState('{}');
  const { serverUrl } = useSwaggerServer();

  useEffect(() => {
    const initialData = {};
    Object.keys(schemaRequest).forEach((key) => {
      initialData[key] = '';
    });

    setFormData(initialData);
    setJsonText(JSON.stringify(initialData, null, 2));
  }, [schemaRequest]);

  const handleFormChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleJsonChange = (value) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setFormData(parsed);
    } catch {
      // JSON inválido → ignora sync
    }
  };

  if (!schemaRequest || Object.keys(schemaRequest).length === 0) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      const payload = activeTab === 'json' ? JSON.parse(jsonText) : formData;
      setOnLoad(true)
      const response = await create({ path: serverUrl+path, data: payload });
      setOnLoad(false)
      setApiResponse(response);
    } catch (error) {
      console.error(error)
    }
  };
  return (
    <div className="swagger-section">
      <h3 className="swagger-section-title">Request Body</h3>

      {/* Tabs */}
      <div className="swagger-tabs">
        <button
          className={activeTab === 'properties' ? 'btn active' : 'btn'}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={activeTab === 'form' ? 'btn active' : 'btn'}
          onClick={() => setActiveTab('form')}
        >
          Form
        </button>

        <button
          className={activeTab === 'json' ? ' btn active' : ' btn'}
          onClick={() => setActiveTab('json')}
        >
          JSON
        </button>
      </div>

      {/* FORM TAB */}
      {activeTab === 'form' && (
        <div className="swagger-form">
          {Object.entries(schemaRequest).map(([key, prop]) => (
            <div key={key} className="swagger-form-field">
              <label>
                {key}
                {schemaRequest.required?.includes(key) && ' *'}
              </label>

              <input
                type="text"
                placeholder={prop.description || key}
                value={formData[key] ?? ''}
                maxLength={prop.maxLength}
                onChange={(e) => handleFormChange(key, e.target.value)}
              />


            </div>
          ))}
        </div>
      )}

      {/* JSON TAB */}
      {activeTab === 'json' && (
        <textarea
          className="swagger-code-block"
          value={jsonText}
          rows={20}
          onChange={(e) => handleJsonChange(e.target.value)}
        />
      )}

      {/* JSON TAB */}
      {activeTab === 'properties' && (
        <textarea
          className="swagger-code-block"
          value={schemaRequest && JSON.stringify(schemaRequest, null, 2)}
          rows={20}
          onChange={(e) => handleJsonChange(e.target.value)}
        />
      )}
      {/* ACTION BAR */}
      {(activeTab === 'form' || activeTab === 'json') && (
        <div className="swagger-actions column-width">
          <button className="btn execute opblock-control__btn" onClick={handleSubmit}>Enviar</button>
        </div>
      )}
    </div>
  );

};

export default RequestBodyViewer;
