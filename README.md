<h1> ROXTERJS </h1>

![Generic badge](https://img.shields.io/badge/NODE-19.8.1-<COLOR>.svg) ![Generic badge](https://img.shields.io/badge/NPM-9.4.0-<COLOR>.svg)

<p align="left"> Pacote experimental, <b>open source</b>, para gerenciamento de requisições de verbos HTTP/s. </p>

### Status da api

- [x] Aprovado em staging
- [x] Estável na produção
- [x] Última versão v0.0.18


### Atualizações 

<p> 22/08/2023 - Para retornar uma resposta com JSON com a nova versão: json({...}) - anteriormente: endJson({...}) </p>
<p> 22/08/2023 - Para retornar uma resposta em STRING: end(status, "contexto") - ou - end("contexto", status) - possibilitando escolher a ordem do parâmetro da função </p>

<p> 26/05/2023 -> Adicionado o módulo de cluster capaz de distribui o número de requisições, atuando como um balanceador de carga (load balancer) para os workers. O processo principal envia cada request para um único worker, alternando entre eles para tentar manter uma carga constante para cada um (estratégia round-robin). O cluster é capaz de entregar mais que o dobro do número de requests, e isto é um ganho excepcional. Vale lembrar que o poder de processamento da máquina não está sendo modificado, mas simplesmente se está evitando uma grande quantidade de tempo ocioso de CPU. Desta forma, a aplicação está fazendo um melhor aproveitamento dos recursos disponíveis. Você ainda poderá multiplicar o número de processamento através da variável. Exemplo: </p>

```bash
# .env.test
$ ROXTER_OS_CPU_FORK = "2"
```

### Features

<p>O RoxterJS possui um mecanismo de rotas baseado no conceito de pastas, sendo, subpastas um mecanismo automático para gerar rotas aninhadas. O projeto se inicia na raíz, a partir de <b>/src</b>.</p>

### Primeiros passos (exemplo):

<p> 1. Inicie um novo projeto: </p>

```bash
# Crie um novo package.json
$ npm init -y
```

<p> 2. Crie a pasta <b> `src` </b> na raiz: </p>

```bash
# root
$ mkdir ./src
```
<p> 3. Instale o pacote RoxterJS </p>

```bash
# npm ou yarn
$ npm i roxterjs
```

<p> 4.(<b>update</b>) Agora, vamos criar o arquivo <b>app.js</b> na raíz e importar o pacote RoxterJS </p>

```bash
# app.js
import Roxter from "roxterjs"
await Roxter();
```

<p> 5. Para iniciar o projeto em modo de desenvolvimento, crie um arquivo <i><b>.env.test</b></i> e insira a seguinte variável: </p>

```bash
# .env.test
ROXTER_START_MODE = "DEVELOP"
```

<p> 6. Outras variáveis com valores default que podem ser alteradas: </p>

6.1. Pasta onde as rotas serão construídas:

```bash
# .env.test ou .env (prod)
ROXTER_PATH = "./src"
```

6.2. Porta de entrada:

```bash
# .env.test
PORT = "3012"
```

6.3. Hostname:

```bash
# .env.test
ROXTER_HOSTNAME = "localhost"
```

### Criando uma rota:

<p> A partir da pasta `<i>__root</i>/<b>src</b>`, criaremos dois níveis de subpastas: `/app/test`.  </p>
<p>Na pasta `/test/`, adicionaremos o arquivo com o nome do verbo responsável por receber a requisição: <b>GET</b>, <b>POST</b>, <b>PUT</b> ou <b>DELETE</b>. Para este exemplo, iremos utilizar o `method` <i>GET</i>; seguindo o caminho: `<i>__root</i>/<b>src/app/test/get.js</b>`. Agora, é só colocar a lógica da função neste arquivo.</p>

```bash
# __root/src/app/test/get.js

export default async function AppTest({ json }){
    return json({ status:200, data:{ name:"RoxterJS" }})
}
```

<p> O endpoint da requisição será <b>`http://localhost:3002/app/test`</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test
```

### Manipulando respostas
```bash
# __root/src/app/test/get.js

# Retornando um Objeto, use >  "json({status:statusCode, ...})"
export default async function AppTest({ json }){
    return json({ status:200, data:{ name:"RoxterJS" }})
}

# __root/src/app/test/get.js

# Retornando uma String, use > "end(statusCode, "...")
export default async function AppTest({ end }){
    return end(201, "Texto de resposta")
}
```

### Recebendo uma [key]

<p> Para criar chaves (keys) em uma url, basta adicionar colchetes entre o nome de uma subpasta. Exemplo: <b>`__root/src/app/test/[id]/get.js`</b>.</p>

```bash
# __root/src/app/test/get.js

# Recebendo o valor de uma chave
export default async function AppTest({ end, keys }){
    const { id } = await keys
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3002/app/test/191919`</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test/191919
```

### Recebendo uma [query]

<p> Para receber parâmetros de uma url:</p>

```bash
# __root/src/app/test/get.js

# Recebendo o valor de uma query
export default async function AppTest({ end, query }){
    const { id } = await query
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3002/app/test/?id=191919`</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3002/app/test/?id=191919
```

### Recebendo um [body]

<p> Para receber dados via API, criaremos um novo arquivo: <b>post.js</b> </p>

```bash
# __root/src/app/test/post.js

# Recebendo o body
export default async function AppTest({ end, body }){
    const { id } = await body
    return end(200,`Sua chave é ${id}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3002/app/test/`</b> </p>

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


### Colaboradores

:1st_place_medal: <b>@robuttura</b> 
