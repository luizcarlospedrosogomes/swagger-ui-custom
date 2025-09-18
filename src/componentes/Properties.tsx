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

const SchemaTable = ({ schema, operation, path, method }: { schema: Schema, operation: any, path: string, method: string }) => {
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
      url: serverUrl+path, // ex: '/analysCode' ou qualquer path dinâmico
      params: method.toLowerCase() === 'get' ? q : undefined, // query params para GET
      data: method.toLowerCase() !== 'get' ? q : undefined   // corpo para POST/PUT
    });
      setRes(response.data);
    } catch (err: any) {
      setRes({ error: err?.message ?? 'Erro' });
    }
  };

  return (
    <div>
      <h3>Parâmetros</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        {Object.entries(schema.properties).map(([name, prop]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor={name}>{name}</label>
            {prop.type === 'boolean' ? (
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={q[name]}
                onChange={handleChange}
              />
            ) : (
              <input
                type={prop.type === 'integer' ? 'number' : 'text'}
                id={name}
                name={name}
                value={q[name]}
                onChange={handleChange}
                placeholder={name}
              />
            )}
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>

      
    </div>
  );
};

export default SchemaTable;
