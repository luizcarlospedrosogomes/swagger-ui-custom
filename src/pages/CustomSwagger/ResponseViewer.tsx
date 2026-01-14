import React from "react";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
const ResponseViewer = ({ response, loading }) => {
  if (!response) {
    return <div><h3>Resultado</h3><p>Nenhuma requisição feita ainda.</p></div>;
  }
  console.log(response)
  if(loading) { 
    return <div><h3>Carregando...</h3></div>;
  }
  
  return (
    <div>
      <h3>Resultado</h3>
      
        <JsonView data={response} shouldExpandNode={allExpanded} style={darkStyles} />
    </div>
    
  );
};

export default ResponseViewer;
