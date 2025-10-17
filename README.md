<h1 align="center">🚀 RoxterJS</h1>
<p align="center"><b>O framework backend inspirado no Next.js — rotas automáticas via pastas e performance 2x maior que Express.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/NODE-19.8.1-green.svg" />
  <img src="https://img.shields.io/badge/NPM-9.4.0-blue.svg" />
  <img src="https://img.shields.io/badge/status-produção-success.svg" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" />
</p>

---

## ✨ Por que usar o RoxterJS?

✅ **Roteamento automático baseado em estrutura de pastas** (estilo Next.js, porém para backend)  
✅ **2x mais rápido que Express** em cenários de concorrência alta  
✅ **Zero configuração** — apenas crie os arquivos e a rota existe  
✅ **Cluster nativo via `ROXTER_CPUS` com round-robin**  
✅ **Suporte pronto para params, query, body e headers**

---

## ⚡ Comparação com Express

| Recurso            | Express                            | RoxterJS                         |
| ------------------ | ---------------------------------- | -------------------------------- |
| Definição de rotas | Manual via código (`app.get(...)`) | Automática via pastas e arquivos |
| Performance        | 🟡 Média                           | 🟢 🚀 2x mais rápido             |
| Cluster embutido   | ❌ Não nativo                      | ✅ Sim (`ROXTER_CPUS`)           |
| Aprendizado        | Médio                              | Fácil e intuitivo                |
| Filosofia          | Flexível                           | Convenção sobre configuração     |

---

## 📦 Instalação

```bash
npm install roxterjs
```

---

## 🔥 Hello World em 30 segundos

**app.js**

```js
import Roxter from "roxterjs";
const roxter = await Roxter();
roxter.Start();
```

**Estrutura de pastas**

Se a pasta "routes" não existir, ela será criada automaticamente na raiz do projeto ou no caminho definido na variável ROXTER_PATH_ROUTE do arquivo .env. A partir dessa pasta, toda a estrutura de rotas — incluindo os níveis de aninhamento — deve ser organizada conforme o padrão demonstrado.

```
root_projeto
 ├─ app.js
 └─ src/
    └─ routes/
       └─ api/
          └─ view/
             └─ get.js
             └─ [id]/
                └─ get.js
          └─ form/
             └─ post.js
             └─ [slug]/
                └─ post.js
```

**src/routes/api/view/get.js**

```js
export default async function App({ res }) {
  return res.end(
    JSON.stringify({
      name: "RoxterJS",
      version: "0.1.9",
    })
  );
}
```

**Teste:**

```bash
curl -X GET http://localhost:4444/api/view
```

---

## 🌱 Configuração via .env

| Variável            | Descrição                       | Default | Apontar em Produção |
| ------------------- | ------------------------------- | ------- | ------------------- |
| `ROXTER_MODE`       | `"dev"` ou `"prod"`             | dev     | ✅ Sim              |
| `ROXTER_PORT`       | Porta do servidor               | 4444    | ❌ Não Obrig.       |
| `ROXTER_PATH_ROUTE` | Caminho da pasta raiz das rotas | `./`    | ❌ Não Obrig.       |
| `ROXTER_TIMEOUT`    | Timeout de resposta (ms)        | 10000   | ❌ Não Obrig.       |
| `ROXTER_CPUS`       | Número de workers (0 = auto)    | 0       | ❌ Não Obrig.       |

**Exemplo (.env.test):**

```env
ROXTER_MODE=dev
ROXTER_PORT=3000
```

---

## 🧠 Exemplos Rápidos

### ✅ URL Params (`[id]`)

```js
// src/routes/api/view/[id]/get.js
export default async function App({ res, keys }) {
  const { id } = await keys;
  return res.end(`ID recebido: ${id}`);
}
```

**Teste:**

```bash
curl -X GET http://localhost:4444/api/view/123456
```

### ✅ Query Params

```js
// src/routes/api/view/get.js
export default async function App({ res, params }) {
  const { color } = await params;
  return res.end(`Cor escolhida: ${color}`);
}
```

**Teste:**

```bash
curl -X GET http://localhost:4444/api/view?param1=a&param2=b
```

### ✅ Body (POST)

```js
// src/routes/api/form/post.js
export default async function App({ res, body }) {
  const { id } = await body;
  return res.end(`Recebi o body ID=${id}`);
}
```

**Teste:**

```
curl -X POST http://localhost:4444/api/form \
  -H "Content-Type: application/json" \
  -d '{"id":123456789}'
```

### ✅ Body (POST) (`[slug]`)

```js
// src/routes/api/form/[slug]/post.js
export default async function App({ res, body, keys }) {
  const { id } = await body;
  const { slug } = await keys;
  return res.end(`Recebi o body ID=${id} e o SLUG=${slug}`);
}
```

**Teste:**

```
curl -X POST http://localhost:4444/api/form/blog \
  -H "Content-Type: application/json" \
  -d '{"id":123456}'
```

---

## 🔧 Adicionando Headers Globais

```js
roxter.Start({
  setHeaders: [
    { name: "Access-Control-Allow-Origin", value: "*" },
    { name: "Access-Control-Allow-Methods", value: "GET, OPTIONS, POST, PUT" },
  ],
});
```

---

## 🎯 Roadmap

- [ ] Suporte oficial TypeScript
- [ ] CLI para criar rotas rapidamente
- [ ] Hot Reload nativo

---

## 🤝 Contribua

Pull Requests são bem-vindos!
Reporte bugs ou ideias em: **[https://github.com/packrd/roxterjs/issues](https://github.com/packrd/roxterjs/issues)**

---

## 👨‍💻 Autor

:1st_place_medal: **@rodrigobuttura1**

---

## 📝 Licença

MIT — livre para usar em projetos pessoais e comerciais.
