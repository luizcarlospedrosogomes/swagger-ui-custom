# swagger-ui-custom
![tela inicial](tela_inicial.png)

### react + typescript + vite

# version
npm version patch -m "chore(release): %s"
git push --follow-tags

## install
npm install swaager-ui-custom --save

### nodejs
```
// setupSwagger.js
const path = require('path');
const fs = require('fs');
const express = require('express');

// Função para configurar o Swagger UI customizado
function setupSwagger(app, options) {
  options = options || {};

  // pasta dos arquivos Swagger JSON
  const docsDir = path.join(process.cwd(), 'docs', 'openapi');
  if (!fs.existsSync(docsDir)) {
    throw new Error(`Swagger directory not found: ${docsDir}`);
  }

  // pega todos os arquivos .json do Swagger
  const swaggerFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.json'));

  // localiza a pasta do pacote na node_modules da raiz
  const swaggerPkgPath = path.dirname(require.resolve('swagger-ui-custom/package.json'));
  const swaggerDist = path.join(swaggerPkgPath, 'dist');
  const config = {
    loginUrl: "/auth-service/token",
    titleApp: "TITLE API",
  }
  const configPath = path.join(swaggerDist, 'swagger-custom-config.json');
  fs.mkdirSync(swaggerDist, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Arquivo de configuração gerado: ${configPath}`);
  // rota para arquivos build do React
  app.use('/swagger-custom', express.static(swaggerDist));

  // rota para arquivos JSON do Swagger
  app.use('/openapi', express.static(docsDir));

  // rota principal do Swagger
  app.get('/swagger-custom', (req, res) => {
    res.sendFile(path.join(swaggerDist, 'index.html'));
  });

  async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const url = `${baseUrl}/analysis-service/analysisCode?$top=1`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      console.log(response)
      if (response.status === 401) {
        return res.status(401).json({ error: "Token inválido. Verificado contra a API", response});
      }

      next();
    } catch (error) {
      console.error(error)
      return res.status(401).json({ error: "Token inválido. Verificado contra  a API" });
    }

  }

  app.get("/swagger-custom-files/list", authenticateToken, (req, res) => {
    fs.readdir(docsDir, (err, files) => {
      if (err) return res.status(500).json({ error: "Falha ao listar arquivos" });

      const jsonFiles = files.filter(f => f.endsWith(".json"));
      res.json(jsonFiles); // retorna ["api1.json", "api2.json", ...]
    });
  });

  // rota para servir um arquivo específico
  app.get("/swagger-custom-files/file/:file", authenticateToken, (req, res) => {
    const file = req.params.file;
    const filePath = path.join(docsDir, file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    res.sendFile(filePath);
  });
  console.log(`Swagger UI disponível em /swagger-custom`);
  console.log(`Swagger JSONs servidos em /openapi`);

}

module.exports = setupSwagger;


```