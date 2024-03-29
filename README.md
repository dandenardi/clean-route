# Teste para Facilita Jurídico

Olá!

Obrigado por disponibilizar seu tempo para explorar esta aplicação. Ela foi desenvolvida como parte do processo seletivo para uma vaga na Facilita Jurídico. Está composta por integração com banco de dados PostgreSQL, um backend desenvolvido em Node.js e um frontend em React. Cada ponto é descrito em mais detalhes abaixo.


## Como executar o projeto:

O projeto está estruturado de modo a conter uma pasta frontend e uma backend. O backend possui o conjunto necessário para rodar a API, bem como um arquivo com os comandos SQL para gerar as tabelas necessárias. Já o frontend possui a lógica para a interface visual, na qual o usuário pode interagir com a API. Cada um é executado de forma independente. Os passos para executar cada um são descritos a seguir.

O projeto possui como pré-requisitos o Node.js instalado e o banco de dados PostgreSQL.

## Backend

O backend é composto por um banco de dados em PostgreSQL e um backend em Node.js. O backend tem como função a obtenção e registro no banco de dados e processamento mais massivo de informação. O backend foi configurado para ser executado na porta 3000.

### Como executar o backend

- Executar os comandos contidos nos arquivos para o banco de dados (pasta model arquivo cleandb_ddl ou cleandb_ddl.txt);
- Do prompt de comando, acessar a pasta do backend (C:\<pasta do projeto>\backend) e executar o comando "node index.js".
- O console exibirá a mensagem "Servidor em funcionamento na porta 3000"

### Uso

 A API resultante possui as seguintes endpoints:

- /clientes (GET): endpoint que retorna um JSON com todos os usuários cadastrados (obtidos da tabela clientes do banco de dados). As informações retornadas de cada usuário são: nome, e-mail e telefone. Também é incluída (através de um JOIN com a tabela localizacoes) a informação de localização de cada usuário.
Exemplo: http://localhost:3000/clientes

- /clientes (POST): endpoint responsável por inserir um novo cliente. Os parâmetros esperados são nome, e-mail, telefone, coordenada em x e coordenada em y. Os parâmetros nome, e-mail e telefone são usados para inserir um novo registro na tabela clientes do banco de dados. Isto resulta em um novo ID único. Este ID único é também utilizado para inserir as coordenadas do usuário na tabela localizacoes.
Exemplo: http://localhost:3000/clientes, com body contendo um JSON: 
{
	"nome": <Nome do usuário (string)>,
	"email": <E-mail do usuário (string),
	"telefone": <Telefone (string)>,
	"x": <posição em X (string)>,
	"y": <posição em Y (string)>
}


- clientes/filtrar: endpoint que permite filtrar os resultados com base em nome, e-mail e/ou telefone. Aceita estas variáveis como parâmetros.
Exemplo: http://localhost:3000/clientes/filtrar?nome=<Nome de usuário> (resultará em uma lista em JSON com todos os usuários cadastrados com nome <Nome de usuário>)

- /rota-mais-curta (GET): endpoint que, ao ser acessada, retorna uma lista (no formato JSON) com os IDs dos clientes a serem visitados em ordem crescente de visitação, retornando para a empresa (ponto 0,0). O cálculo é realizado de modo a obter a rota mais curta. A lógica aplicada se baseia no Travelling Salesman Problem, algoritmo comumente usado para resolver problemas deste tipo. 

### Fragilidades e melhorias

- É sabido que as endpoints não validam dados. Enviar dados incorretos (por exemplo, x com uma string), não resultará em erros o que afetará os resultados do cálculo de menor rota.


## Frontend

O frontend foi escrito em React, especificamente usando o boilerplate baseado em Next.js. Isto foi feito pois a solução mais comumente utilizada (Create-React-App ou CRA) não é mais mantida. O frontend foi desenvolvido como um SPA (single page application), com as funcionalidades para inclusão de usuários e geração da menor rota acessíveis através de modais. Foi utilizada a biblioteca Next.ui para o design de elementos.

### Como executar o frontend

- Do prompt de comando, acessar a pasta do frontend (C:\<pasta do projeto>\frontend) e executar o comando "npm install". Este comando instalará todas as dependências.
- Executar o comando npm run dev.

### Uso

Ao acessar o endereço padrão (http://localhost:3001), a página será renderizada, já com todos os clientes cadastrados no banco de dados. É possível filtrar os usuários através dos inputs na parte superior da tela. O filtro é executado após ser clicado o botão "Filtrar".

O botão "Gerar rota mais curta" abrirá um modal com os pontos a serem visitas em ordem (do primeiro ao último a ser visitado). O último ponto é sempre a empresa (ponto de partida).

Ao ser clicado o botão "Adicionar Cliente", um novo modal é aberto com campos de input para nome, e-mail, telefone, posição em x e posição em y. É possível fechar o modal sem incluir um novo usuário (botão "fechar") ou confirmar a inclusão através do botão "Incluir cliente".

### Fragilidades e melhorias

- É sabido que os inputs não fazem quaisquer validações de dados. Sendo assim, um usuário com todos os campos em branco pode ser inserido. Um mesmo usuário, com todos os campos iguais, exceto ID (que não é editável) pode ser inserido inúmeras vezes, já que não existe nenhum campo definido como único.

- Dados inválidos no backend podem ser propagados ao frontend (i.e. valores inválidos de posição impactam na funcionalidade de gerar menor rota).

- Não foi realizado nenhum procedimento de limpeza (clean-up) para os dados no modal de inserção de usuários. Isso implica em os dados precisarem ser apagados manualmente a cada nova inserção.


## Conclusão

Aqui estão descritos os passos fundamentais para executar a aplicação. Em caso de problemas ou questionamentos, fico à disposição em meu e-mail: dan.denardi@gmail.com.

Obrigado e forte abraço!