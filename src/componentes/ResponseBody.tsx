import React from 'react';

const ResponsesViewer = ({ responses }) => {
  if (!responses) {
    return null; // Evita renderizar se não houver responses
  }

  return (
    <div>
      <h3>Responses</h3>
      <pre style={{
        background: '#f6f8fa',
        padding: '10px',
        borderRadius: '4px',
        overflowX: 'auto'
      }}>
        {JSON.stringify(responses, null, 2)}
      </pre>
    </div>
  );
};

export default ResponsesViewer;
