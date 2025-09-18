// SwaggerServerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SwaggerServerContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
}

const SwaggerServerContext = createContext<SwaggerServerContextType | undefined>(undefined);

export const SwaggerServerProvider = ({ children }: { children: ReactNode }) => {
  const [serverUrl, setServerUrl] = useState("");

  return (
    <SwaggerServerContext.Provider value={{ serverUrl, setServerUrl }}>
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
