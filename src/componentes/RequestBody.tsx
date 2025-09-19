import React from 'react';
import "./swaggerStyles.css"; // 👈 importa seu CSS global

const RequestBodyViewer = ({ schemaRequest }) => {
  if (!schemaRequest || Object.keys(schemaRequest).length === 0) {
    return null;
  }

  return (
    <div className="swagger-section">
      <h3 className="swagger-section-title">Request Body</h3>
      <pre className="swagger-code-block">
        {JSON.stringify(schemaRequest, null, 2)}
      </pre>
    </div>
  );
};

export default RequestBodyViewer;
