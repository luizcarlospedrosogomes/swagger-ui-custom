import React from 'react';

const RequestBodyViewer = ({ schemaRequest }) => {
  if (!schemaRequest) {
    return null; // Evita renderizar se não houver request body
  }
  if(Object.keys(schemaRequest).length === 0){
    return null; 
  }

  return (
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
  );
};

export default RequestBodyViewer;
