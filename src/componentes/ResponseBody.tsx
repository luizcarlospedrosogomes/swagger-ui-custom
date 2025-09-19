import React from 'react';
import "./swaggerStyles.css"; // 👈 reutiliza o mesmo CSS

const ResponsesViewer = ({ spec, responses }) => {
  if (!responses) {
    return null; // Evita renderizar se não houver responses
  }

  function findRefsWithKeys(o: any): Record<string, any[]> {
    const result: Record<string, any[]> = {};

    for (const key in o) {
      const refs: any[] = [];

      function collectRefs(node: any) {
        if (typeof node === "object" && node !== null) {
          for (const k in node) {
            if (k === "$ref") {
              refs.push({ ref: node[k] });
            } else {
              collectRefs(node[k]);
            }
          }
        }
      }

      collectRefs(o[key]);

      if (refs.length > 0) {
        result[key] = refs;
      }
    }

    return result;
  }

  const refs = findRefsWithKeys(responses);

  for (const status in refs) {
    refs[status].forEach(ref => {
      const refKey = ref.ref.split("/").pop();
      ref["properties"] = spec.components.schemas[refKey]?.properties || {};
    });
  }

  return (
    <div className="swagger-section">
      <h3 className="swagger-section-title">Responses</h3>
      {Object.entries(refs).map(([status, refList]) => (
        <div key={status} className="swagger-subsection">
          <h4 className="swagger-subsection-title">Status {status}</h4>
          {refList.map((refObj, i) => (
            <div key={i} className="swagger-response-block">
              <strong className="swagger-ref-label">$ref:</strong> {refObj.ref}
              <pre className="swagger-code-block">
                {JSON.stringify(refObj.properties, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ResponsesViewer;
