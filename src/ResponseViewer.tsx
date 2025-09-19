import React from "react";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
const ResponseViewer = ({ response }) => {
  if (!response) {
    return <div><h3>Resultado</h3><p>Nenhuma requisição feita ainda.</p></div>;
  }

  return (
    <div>
      <h3>Resultado</h3>
      
        <JsonView data={response} shouldExpandNode={allExpanded} style={darkStyles} />
    </div>
    
  );
};

export default ResponseViewer;
