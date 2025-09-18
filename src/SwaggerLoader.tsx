import React, { useEffect } from "react";
import swaggerSpec from "./swagger.json";
import { useSwaggerServer } from "./SwaggerServerContext";

const SwaggerLoader = () => {
  const { setServerUrl } = useSwaggerServer();

  useEffect(() => {
    // Pega o primeiro servidor do swagger.json
    const url = swaggerSpec.servers?.[0]?.url || "";
    setServerUrl(url);
  }, [setServerUrl]);

  return null; // apenas carrega os dados
};

export default SwaggerLoader;
