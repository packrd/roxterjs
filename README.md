<h1> ROXTER JS </h1>

![Generic badge](https://img.shields.io/badge/NODE-19.8.1-<COLOR>.svg) ![Generic badge](https://img.shields.io/badge/NPM-9.4.0-<COLOR>.svg)

<p align="left"> Pacote experimental, <b>open source</b>, para gerenciamento de requisições de verbos HTTP/s. </p>

### Status da api

- [x] Staging
- [ ] Instavel na versão x.x.x

### Features

<p>O RoxterJS possui um mecanismo de rotas baseado no conceito de pastas, sendo, subpastas um mecanismo automático para gerar rotas aninhadas. O mecanismo iniciará na raíz, a partir de <b>__root/src</b>.</p>

### Primeiros passos (exemplo):

<p> 1. Inicie um novo projeto: </p>

```bash
# Crie um novo package.json
$ npm init -y
```
<p> 2. Crie um arquivo <b>app.route.js</b> na raiz com o seguinte código: </p>

```bash
# app.route.js
$ export default {}
```
<p><i> O arquivo recebe o build das routes.</i></p>

<p> 3. Crie uma pasta <b> src </b> na raiz: </p>

```bash
# Crie um novo package.json
$ mkdir ./src
```
<p> 4. Instale o pacote RoxterJS </p>

```bash
# app.js
$ npm i roxterjs
```

<p> 5. Agora, vamos criar o arquivo <b>app.js</b> n raíz e importar o pacote RoxterJS </p>

```bash
# app.js
import AppRoute from "./app.route.js";
import { Start } from "roxterjs"

(async () => {
    await Start(AppRoute);
})();
```


### Criando uma rota:

<p> A partir da pasta "<i>__root</i>/<b>src</b>", criaremos dois níveis de subpastas: "/app/test".  </p>
<p>Na pasta "/test/", adicionaremos o arquivo com o nome do verbo responsável por receber a requisição: <b>GET</b>, <b>POST</b>, <b>PUT</b> ou <b>DELETE</b>. Neste exemplo, iremos utilizar o <i>GET</i>, ficando o caminho da seguinte forma: "<i>__root</i>/<b>src/app/test/get.js</b>". Agora, é só colocar o lógica da função neste arquivo.</p>

```bash
# Teste a função abaixo:
export default async function AppTest({ endJson }){
    return endJson({ status:200, data:{ name:"RoxterJS" }})
}
```

<p> O endepoint da requisição será <b>"http://localhost:3002/app/test"</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test
```

### Manipulando respostas
```bash
# Retornando um Objeto, use "endJson({status:statusCode, ...})"
export default async function AppTest({ endJson }){
    return endJson({ status:200, data:{ name:"RoxterJS" }})
}

# Retornando uma String, use "end(statusCode, "...")
export default async function AppTest({ endJson }){
    return end(201, "Texto de resposta")
}
```

### Recebendo parametros [keys]

<p> Para criar chaves (keys) em uma url, basta adicionar colchetes entre o nome de uma subpasta. Exemplo: <b>__root/src/app/test/[id]/get.js</b>.</p>

```bash
# Recebendo o valor de uma chave
export default async function AppTest({ end, keys }){
    const { id } = await keys
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endepoint da requisição será <b>"http://localhost:3002/app/test/191919"</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test/191919
```

### Recebendo parametros [querys]

<p> Para pegar parâmetros de uma url:</p>

```bash
# Recebendo o valor de uma query
export default async function AppTest({ end, query }){
    const { id } = await query
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endepoint da requisição será <b>"http://localhost:3002/app/test/?id=191919"</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test/?id=191919
```

### Recebendo um body

<p> Para receber dados via API, renomearemos o arquivo para <b>post.js</b> </p>

```bash
# Recebendo o body
export default async function AppTest({ end, body }){
    const { id } = await body
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endepoint da requisição será <b>"http://localhost:3002/app/test/"</b> </p>

```bash
# Teste cURL:
$ curl -X POST http://localhost:3002/app/test/ -d '{"id":"191919"}'
```


### 🎲 Rodando o projeto localhost

```bash
# Clone este repositório
$ git clone https://github.com/packrd/roxterjs.git

# Acesse a pasta do projeto no terminal/cmd
$ cd roxterjs

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run start

# O servidor inciará na porta:3002 - acesse <http://127.0.0.1:3002>
```


### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [x] [NodeJs](https://nodejs.org/en/)
- [x] [Javascript](https://www.javascript.com/)
- [ ] [TypeScript](https://www.typescriptlang.org/)


### Autores

:person_fencing: Rodrigo Buttura @robuttura
:1st_place_medal: <b>Fundador e colaborador Roxter</b>