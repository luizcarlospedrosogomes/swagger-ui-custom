import React, { useEffect, useState } from "react";
import { useSwaggerServer } from "../context/SwaggerServerContext";
import { read } from "../services/api";

interface ApiFileSelectorProps {
    files: string[];
}

const ApiFileSelector: React.FC<ApiFileSelectorProps> = ({ files, }) => {
    const { schema, setSchema, setServerUrl } = useSwaggerServer();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedFile) return;

        const fetchSchema = async () => {
            try {
                const data = await read(`swagger-custom-files/file/${selectedFile}`);
                setSchema(data);
                const url = data.servers?.[0]?.url || "";
                setServerUrl(url);
            } catch (err) {
                console.error(err);
            } finally {
              ;
            }
        };

        fetchSchema();
    }, [selectedFile, setSchema])

    if (!files || files.length === 0) return null;
    return (
        <div className="api-file-wrapper">
            <label htmlFor="api-file-select" className="api-file-label">
                Select a definition
            </label>

            <select className="api-file-select"
                value={selectedFile || ""}
                onChange={e => setSelectedFile(e.target.value)}
            >
                <option value="" disabled>-- Selecione --</option>
                {files.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>
        </div>
    );
};

export default ApiFileSelector;
