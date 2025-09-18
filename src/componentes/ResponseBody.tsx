import React from 'react';

const ResponsesViewer = ({ spec, responses }) => {
  if (!responses) {
    return null; // Evita renderizar se não houver responses
  }

  function findRefsWithKeys(o: any): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    for (const key in o) {
      const refs = [];

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

  const refs = findRefsWithKeys(responses)
  for (const status in refs) {
    refs[status].forEach(ref => {
      const refKey = ref.ref.split('/').pop();
      ref['properties'] = spec.components.schemas[refKey].properties || {};

    });
  }
  console.log(refs);

  return (
    <div>
      <h3>Responses</h3>
      {Object.entries(refs).map(([status, refList]) => (
        <div key={status} style={{ marginBottom: "1rem" }}>
          <h4>Status {status}</h4>
          {refList.map((refObj, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <strong>{'$ref:'}</strong> {refObj.ref}
              <pre
                style={{
                  background: "#f6f8fa",
                  padding: "10px",
                  borderRadius: "4px",
                  overflowX: "auto",
                }}
              >
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
