<h1> ROXTERJS </h1>

![Generic badge](https://img.shields.io/badge/NODE-19.8.1-<COLOR>.svg) ![Generic badge](https://img.shields.io/badge/NPM-9.4.0-<COLOR>.svg)

<p align="left"> Implemente endpoints de roteamento seguindo a convenção de estrutura de pastas, conforme praticado no <b>Next.js</b> </p>

<p align="left"> Pacote <b>OpenSource</b>, desenvolvido por <b>RoxterXteezer.</b></p>

### Status da api

- [x] Estável em produção
- [x] Ultima versão 2024-03-29
- [x] Versão atualizada v0.1.5


### Novidades 

<p> Gerencie as principais <b>envs</b> em ambiente de teste. </p>

```bash
# .env.test
$ ROXTER_MODE = "dev"|"prod" #default -> dev. Obrigatório mudar p/ "prod" em ambiente de produção.
$ ROXTER_PORT = 3333 #default -> porta de entrada (não obrigatório)
$ ROXTER_HOSTNAME = "localhost" #default (não obrigatório)
$ ROXTER_FILE_ROUTES = "app.routes.js" #default -> nome_do_arquivo onde as rotas serão salvas (não obrigatório)
$ ROXTER_TIMEOUT = 10000 #default -> tempo limite de espera para resposta do serviço (não obrigatório)
$ ROXTER_CPUS = 0 #default -> detalhes no texto abaixo...
```

#### ROXTER_CPUS

<p>Através da <i><b>env</b></i> <b>ROXTER_CPUS</b>, cria-se um cluster capaz de distribui o número de requisições, atuando como um balanceador de carga (load balancer) para os workers. O processo principal envia cada request para um único worker, alternando entre eles para tentar manter uma carga constante para cada um (estratégia round-robin). O cluster é capaz de entregar mais que o dobro do número de requests, e isto é um ganho excepcional. Vale lembrar que o poder de processamento da máquina não está sendo modificado, mas simplesmente se está evitando uma grande quantidade de tempo ocioso de CPU. Desta forma, a aplicação está fazendo um melhor aproveitamento dos recursos disponíveis. Você ainda poderá multiplicar o número de processamento através da variável. Exemplo:</p>


#### Primeiros passos (exemplo):

<p> 1. Inicie um novo projeto: </p>

```bash
# Crie um novo package.json
$ npm init -y
```

<p> 2. Instale o pacote RoxterJS </p>

```bash
# npm ou yarn
$ npm i roxterjs
```

<p> 3. Crie na raiz do seu projeto o arquivo <b>app.js</b>:  </p>

```bash
# app.js
```

<p> 3. Organize uma estrutura de pastas e defina qual será a <b>pasta principal</b> onde as rotas serão aninhadas. Neste exemplo, todas as rotas serão criadas a partir da pasta <b>/routes</b>: </p>

- root_projeto
  - app.js
  - package.json
  - README.md
  - src/
    - <b>routes/</b>
    - controller/
    - services/


<p> 4. No arquivo principal do projeto (<b>app.js</b>), importaremos a biblioteca e, informaremos o <b>caminho exato da pasta raiz das rotas</b>. Exemplo: </p>

```bash
# app.js
import Roxter from "roxterjs";
const roxter = await Roxter('./src/routes'); # <-caminho-> './src/routes'

# A função abaixo irá construir as rotas e iniciar o servidor
roxter.Start();
```

### Criando uma rota:

<p> A partir da pasta <b>/routes</b>, todas as subpastas são rotas aninhadas. Exemplo:</p>

- root_projeto
  - app.js
  - package.json
  - README.md
  - src/
    - <b>routes/</b>
        - api/
            - view/

<p> No exemplo acima, o <i><b>endpoint</b></i> ficará: </p>

```bash
# http://localhost:3333/api/view
```

<p> Para definir o <b>method</b> (get | post | put | delete) para o <i>endpoint</i>, basta adicionar o <b>verbo</b>(<i>method</i>) como <b>nome_do_arquivo.js</b>. Exemplo: </p>

- root_projeto
  - app.js
  - package.json
  - README.md
  - src/
    - <b>routes/</b>
        - api/
            - view/
                - <b>get.js</b>

<p> No exemplo acima, o <i><b>endpoint</b></i> se mantém: </p>

```bash
# http://localhost:3333/api/view
```
<p> Agora, é só colocar a lógica da função neste arquivo: </p>

```bash
# __root/src/routes/api/view/get.js

export default async function App({ res }){
    return res.end(JSON.stringfy({
        name: "RoxterJs",
        partner: "Roxter.Xteezer",
        address: "São Paulo - SP"
    }))
}
```

<p> Agora teste sua primeira rota: </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3333/api/view
```

#### Recebendo uma [parâmetros]

<p> Para criar <b>"slugs"</b> na url, basta adicionar colchetes entre o nome da subpasta. Exemplo: __root/src/routes/api/view/<b>[id]</b>/get.js`.</p>

```bash
# __root/src/routes/api/view/[id]/get.js

export default async function App({ res, keys }){
    const { id } = await keys;
    return res.end(`Sua chave é ${id}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3333/api/view/valor_do_id`</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3333/api/view/1234
```

#### Recebendo [querys]

<p> Para receber as "querys" pela url, adicione <b>params</b> na chave principal da função: </p>

```bash
# __root/src/routes/api/view/[id]/get.js

export default async function App({ res, keys, params }){
    const { color } = await params;
    const { id } = await keys;
    return res.end(`Sua chave é ${id}, sua cor é ${color}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3333/api/view/valor_do_id?color=sua_cor_preferida`</b> </p>

```bash
# Teste cURL:
$ curl -X GET http://localhost:3333/api/view/1234?color=azul
```

#### Recebendo um [body]

<p> Para receber dados da requisição, o <b>method</b> obrigatório é <b>post.js</b>. Por isso criaremos uma rota diferente e um novo arquivo. </p>

- root_projeto
  - app.js
  - package.json
  - README.md
  - src/
    - <b>routes/</b>
        - api/
            - view/
                - <b>...</b>
        - data/
            - dong/
                - <b>post.js</b>


<p> No exemplo acima, o <i><b>endpoint</b></i> ficará: </p>

```bash
# http://localhost:3333/data/dong
```

<p> Para receber o "body", adicione <b>body</b> na chave principal da função: </p>


```bash
# __root/src/routes/data/dong/post.js

export default async function App({ res, body }){
    const { id } = await body;
    return res.end(`Sua chave é ${id}`);
}
```
<p> O endpoint da requisição será <b>`http://localhost:3333/app/dong/`</b> </p>

```bash
# Teste cURL:
$ curl -X POST http://localhost:3333/data/dong -d '{"id":"191919"}'
```

#### Adicionando Resposta ao Header (setHeader)

<p> Você pode adicionar o <b>header</b> em cada <b>endpoint</b> ou padronizar para todos, a partir do arquivo <b>app.js</b>. Veja como: </p>

```bash
# app.js
import Roxter from "roxterjs";
const roxter = await Roxter('./src/routes'); 

# Adicione como parâmetro Start({ params })
roxter.Start({
    setHeaders:[
        { name: "Access-Control-Allow-Origin", value: "*" },
        { name: "Access-Control-Allow-Methods", value: "GET, OPTIONS, POST, PUT" },
        { name: "Access-Control-Allow-Headers", value: "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization" }
    ]
});
```



### 🎲 Github 

```bash
# Clone este repositório
$ git clone https://github.com/packrd/roxterjs.git
```

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [x] [NodeJs](https://nodejs.org/en/)
- [x] [Javascript](https://www.javascript.com/)
- [ ] [TypeScript](https://www.typescriptlang.org/)


### Colaboradores

:1st_place_medal: <b>@rodrigo.buttura</b> 
