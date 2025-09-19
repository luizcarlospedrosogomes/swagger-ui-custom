import React, { useState } from 'react';
import axios from 'axios';
import { useSwaggerServer } from "../SwaggerServerContext";

interface SchemaProperty {
  type: string;
  minimum?: number;
  example?: any;
}

interface Schema {
  properties: Record<string, SchemaProperty>;
}

const SchemaTable = ({ schema, operation, path, method, setApiResponse }: { setApiResponse: any, schema: Schema, operation: any, path: string, method: string }) => {
  const initialState = Object.keys(schema.properties).reduce((acc, key) => {
    const type = schema.properties[key].type;
    acc[key] = type === 'boolean' ? false : '';
    return acc;
  }, {} as Record<string, any>);

  const [q, setQ] = useState(initialState);
  const [res, setRes] = useState<any>(null);

  const { serverUrl } = useSwaggerServer();
  if (!schema || !schema.properties) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setQ(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios({
        method,   // 'get', 'post', etc.
        url: serverUrl + path, // ex: '/analysCode' ou qualquer path dinâmico
        params: method.toLowerCase() === 'get' ? q : undefined, // query params para GET
        data: method.toLowerCase() !== 'get' ? q : undefined   // corpo para POST/PUT
      });
      setApiResponse(response);
    } catch (error: any) {
      setApiResponse(error);
    }
  };
  
  console.log(schema.properties)
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
                  name={name}
                  checked={q[name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={prop.schema.type === 'integer' ? 'number' : 'text'}
                  id={name}
                  name={name}
                  onChange={handleChange}
                  value={q[name] || prop.example}
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
