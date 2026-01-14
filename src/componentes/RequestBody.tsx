import React, { useEffect, useState } from 'react';
import "./swaggerStyles.css";
import { useSwaggerServer } from '../context/SwaggerServerContext';
import { create } from '../services/api';
import { canRenderAsForm, generateEmptyArray, generateEmptyObject } from '../util/schema';
import TableArrayPropeties from './TableArrayPropeties';

const RequestBodyViewer = ({ wrappers, setApiResponse, setOnLoad, path }) => {
  const { serverUrl } = useSwaggerServer();

  const [activeTab, setActiveTab] = useState('properties');
  const [formData, setFormData] = useState({});
  const [jsonText, setJsonText] = useState('{}');

  const canShowForm =
    wrappers.length > 0 &&
    wrappers.every(w => canRenderAsForm(w.innerSchema));

  useEffect(() => {
    const initial = {};
      wrappers.forEach(({ wrapperName, wrapperSchema, innerSchema }) => {
    if (wrapperSchema.type === 'array') {
      initial[wrapperName] = generateEmptyArray(innerSchema);
    } else {
      initial[wrapperName] = generateEmptyObject(innerSchema);
    }
  });

  setFormData(initial);
  setJsonText(JSON.stringify(initial, null, 2));
  }, [wrappers]);


  const setFieldValue = (wrapper, path, value) => {
    setFormData(prev => {
      const updated = structuredClone(prev);
      let ref = updated[wrapper];

      path.forEach((p, idx) => {
        if (idx === path.length - 1) {
          ref[p] = value;
        } else {
          ref = ref[p];
        }
      });

      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  const handleJsonChange = (value) => {
    setJsonText(value);
    try {
      setFormData(JSON.parse(value));
    } catch {
      // ignore invalid json
    }
  };

  const handleSubmit = async () => {
    try {
      const payload =
        activeTab === 'json'
          ? JSON.parse(jsonText)
          : formData;

      setOnLoad(true);
      const response = await create({
        path: serverUrl + path,
        data: payload
      });
      setApiResponse(response);
    } catch (error) {
      setApiResponse(error);
    } finally {
      setOnLoad(false);
    }
  };

  if (!wrappers?.length) return null;

  // =========================
  // RENDER
  // =========================
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

        {canShowForm && (
          <button
            className={activeTab === 'form' ? 'btn active' : 'btn'}
            onClick={() => setActiveTab('form')}
          >
            Form
          </button>
        )}

        <button
          className={activeTab === 'json' ? 'btn active' : 'btn'}
          onClick={() => setActiveTab('json')}
        >
          JSON
        </button>
      </div>

      {/* PROPERTIES */}
      {activeTab === 'properties' && (
        <textarea
          className="swagger-code-block"
          value={JSON.stringify(wrappers, null, 2)}
          rows={20}
          readOnly
        />
      )}

      {/* FORM */}
      {activeTab === 'form' && canShowForm && (
  <div className="swagger-form">
    {wrappers.map(({ wrapperName, wrapperSchema, innerSchema }) => {
      if (wrapperSchema.type === 'array') {
        return (
          <fieldset key={wrapperName}>
            <legend>{wrapperName}</legend>
            {TableArrayPropeties(wrapperName, innerSchema, formData, setFormData, setJsonText)}
          </fieldset>
        );
      }

      return (
        <fieldset key={wrapperName}>
          <legend>{wrapperName}</legend>

          {Object.entries(innerSchema.properties).map(([key, prop]) => (
            <div key={key} className="swagger-form-field">
              <label>{key}</label>
              <input
                type="text"
                value={formData[wrapperName]?.[key] ?? ''}
                onChange={e =>
                  setFieldValue(wrapperName, [key], e.target.value)
                }
              />
            </div>
          ))}
        </fieldset>
      );
    })}
  </div>
)}


      {/* JSON */}
      {activeTab === 'json' && (
        <textarea
          className="swagger-code-block"
          value={jsonText}
          rows={20}
          onChange={(e) => handleJsonChange(e.target.value)}
        />
      )}

      {/* ACTION */}
      {(activeTab === 'form' || activeTab === 'json') && (
        <div className="swagger-actions column-width">
          <button
            className="btn execute opblock-control__btn"
            onClick={handleSubmit}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestBodyViewer;
