import React, { useEffect, useState } from "react";
import { useSwaggerServer } from "../context/SwaggerServerContext";
import { getData, read } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

interface ApiFileSelectorProps {
    files: string[];
}

const ApiFileSelector: React.FC<ApiFileSelectorProps> = ({ files, }) => {
    const { schema, setSchema, setServerUrl } = useSwaggerServer();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const { search } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const fileFromUrl = params.get("file");
        if (fileFromUrl && files.includes(fileFromUrl)) {
            setSelectedFile(fileFromUrl);
        }
    }, [search, files]);

    useEffect(() => {
        if (!selectedFile) return;

        const fetchSchema = async () => {
            try {
                const response = await getData({ path: `/swagger-custom-files/file/${selectedFile}`, params: {} });
                setSchema(response.data);
                const url = response.data.servers?.[0]?.url || "";
                setServerUrl(url);
            } catch (err) {
                console.error(err);
            } finally {
                ;
            }
        };

        fetchSchema();
    }, [selectedFile, setSchema])

    const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const fileName = event.target.value;
        setSelectedFile(fileName)
        const params = new URLSearchParams(search);
        params.set("file", fileName);

        navigate({ search: params.toString() }); // mantém rota atual, só troca query
    };

    if (!files || files.length === 0) return null;
    return (
        <div className="api-file-wrapper">
            <label htmlFor="api-file-select" className="api-file-label">
                Select a definition
            </label>

            <select className="api-file-select"
                value={selectedFile || ""}
                onChange={handleFileChange}
            >
                <option value="" disabled>-- Select --</option>
                {files.map(f => (
                    <option key={f} value={f}>{f}</option>
                ))}
            </select>
        </div>
    );
};
export default ApiFileSelector;
