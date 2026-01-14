import { generateEmptyObject } from "../util/schema";

const TableArrayPropeties = (wrapperName, innerSchema, formData, setFormData, setJsonText) => {
  const rows = formData[wrapperName] || [];
  const columns = Object.keys(innerSchema.properties);

  const updateCell = (rowIndex, key, value) => {
    setFormData(prev => {
      const updated = structuredClone(prev);
      updated[wrapperName][rowIndex][key] = value;
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  const addRow = () => {
    setFormData(prev => {
      const updated = structuredClone(prev);
      updated[wrapperName].push(generateEmptyObject(innerSchema));
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  return (
    <div className="swagger-table-wrapper">
      <table className="swagger-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => (
                <td key={col}>
                  <input
                    type="text"
                    value={row[col] ?? ''}
                    onChange={e =>
                      updateCell(rowIndex, col, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn" onClick={addRow}>
        + Adicionar linha
      </button>
    </div>
  );
};
export default TableArrayPropeties;