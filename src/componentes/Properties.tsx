import React, { useState } from 'react';
import { useSwaggerServer } from "../context/SwaggerServerContext";
import { getData, read } from '../services/api';

interface SchemaProperty {
  type: string;
  minimum?: number;
  example?: any;
}

interface Schema {
  properties: Record<string, SchemaProperty>;
}

const SchemaTable = ({ schema, path,  setApiResponse, setOnLoad }: { setApiResponse: any, schema: Schema, operation: any, path: string, method: string, setOnLoad: any }) => {
  const initialState = Object.keys(schema.properties).reduce((acc, key) => {
    const type = schema.properties[key].type;
    const name = schema.properties[key].name
    // Se o nome já começa com $, mantém; senão mantém como está
    const paramName = name.startsWith('$') ? `$${key}` : key;

    acc[paramName] = type === 'boolean' ? false : '';
    return acc;
  }, {} as Record<string, any>);

  const [query, setQuery] = useState(initialState);
const { serverUrl } = useSwaggerServer();
  if (!schema || !schema.properties) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setQuery(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const formData = new FormData(e.currentTarget);

      const params = Object.fromEntries(
        Array.from(formData.entries())
          .filter(([_, v]) => v !== '' && v !== null)
          .map(([k, v]) => [k, v.toString()])
      );
      if (params['$count']) {
        params['$count'] = true;
      }
      setOnLoad(true)
      const response = await getData({ path: serverUrl + path, params })
      setOnLoad(false)
      setApiResponse(response);
    } catch (error: any) {
      console.error('Erro ao enviar a requisição:', error);
      setApiResponse(error);
      setOnLoad(false);
    }
  };

  return (
    <div className="swagger-ui">
      <div className="opblock-body">
        <h3 className="opblock-section-header">Parâmetros</h3>
        <form className="parameters" onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
          {Object.entries(schema.properties).map(([name, prop]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label className={`parameter__name ${name === 'top' && ' required'}`} htmlFor={name}>{prop.name} {name === 'top' && <span className="required">*</span>}</label>
              <div className="parameter__in">({prop.in})</div>
              {prop.schema.type === 'boolean' ? (
                <input
                  type="checkbox"
                  id={name}
                  name={prop.name}
                  checked={query[prop.name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={prop.schema.type === 'integer' ? 'number' : 'text'}
                  id={name}
                  name={prop.name}
                  onChange={handleChange}
                  value={query[prop.name] || prop.example}
                  placeholder={name}
                />
              )}
            </div>
          ))}
          <button className="btn execute opblock-control__btn" type="submit">Enviar</button>
        </form>


      </div>
    </div>
  );
};

export default SchemaTable;
