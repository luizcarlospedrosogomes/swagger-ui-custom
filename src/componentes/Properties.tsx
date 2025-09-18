import React from 'react';

const SchemaTable = ({ schema }) => {
  if (!schema || !schema.properties) {
    return null; // Evita erros se schema não estiver definido
  }

  return (
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
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                {prop.type}{prop.maxLength ? `(${prop.maxLength})` : ''}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                {schema.required?.includes(name) ? 'Sim' : 'Não'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                {prop.description || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchemaTable;
