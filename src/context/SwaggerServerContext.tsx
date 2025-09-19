// SwaggerServerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SwaggerServerContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  schema: any; // conteúdo inteiro do swagger.json
  setSchema: (schema: any) => void;
  files: any; 
  setFiles: (files: any) => void;
  config: any; 
  setConfig: (files: any) => void;
}

const SwaggerServerContext = createContext<SwaggerServerContextType | undefined>(undefined);

export const SwaggerServerProvider = ({ children }: { children: ReactNode }) => {
  const [serverUrl, setServerUrl] = useState("");
  const [schema, setSchema] = useState<any>(null);
  const [files, setFiles] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  return (
    <SwaggerServerContext.Provider value={{ serverUrl, setServerUrl, schema, setSchema, files, setFiles, config, setConfig }}>
      {children}
    </SwaggerServerContext.Provider>
  );
};

// Hook para usar o context facilmente
export const useSwaggerServer = () => {
  const context = useContext(SwaggerServerContext);
  if (!context) {
    throw new Error("useSwaggerServer must be used within a SwaggerServerProvider");
  }
  return context;
};
