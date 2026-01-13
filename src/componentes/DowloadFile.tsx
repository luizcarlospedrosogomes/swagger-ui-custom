import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getData } from "../services/api";

const DownloadFile = ({ filePath }: { filePath: string }) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const { search } = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(search);
        const fileFromUrl = params.get("file");
        if (fileFromUrl) {
            setSelectedFile(fileFromUrl);
        }
    }, [search]);
    const downloadSpec = async () => {
  try {
    const response = await getData({ path: `/swagger-custom-files/file/${selectedFile}`, params: {} });

    const json = response.data;

    const blob = new Blob(
      [JSON.stringify(json, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = selectedFile || "openapi.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erro ao baixar OpenAPI:", err);
  }
};
    return (
        <div className="api-file-wrapper">
            <button className="btn authorize" style={{ marginLeft: "8px" }}
                title="Download OpenAPI JSON"
                 onClick={downloadSpec}
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M10 1v10.17l3.59-3.58L15 9l-5 5-5-5 1.41-1.41L9 11.17V1h1z" />
                    <path d="M3 17h14v2H3z" />
                </svg>
            </button>
        </div>
    );
};
export default DownloadFile;