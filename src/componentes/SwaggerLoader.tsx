import React, { useEffect } from "react";
import { useSwaggerServer } from "../context/SwaggerServerContext";
import { getData, read } from "../services/api";

const SwaggerLoader: React.FC = () => {
  const { setFiles } = useSwaggerServer();;

  useEffect(() => {
    const loadSwagger = async () => {
      try {
        // carrega o swagger.json do backend (pasta openapi)
        const response = await getData({ path: "/swagger-custom-files/list", params:{}});
        setFiles(response.data);
    
      } catch (err) {
        console.error("Erro ao carregar Swagger spec:", err);
      }
    };

    loadSwagger();
  }, [setFiles]);

  return null; // só efeito colateral
};

export default SwaggerLoader;
