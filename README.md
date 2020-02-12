## Sobre

Ubireudo é um projeto que visa automatizar o sistema de participação de alunos em instituições de ensino. Atualmente está em fase de desenvolvimento com testes locais, porém futuramente estará disponível para o público em geral.

## Ambiente de desenvolvimento

### Como testar localmente?

Para hospedar o site em um servidor local, use "yarn start" ou "npm start". Acesse o servidor local pelo link "localhost:3000". Caso tenha alguma problema, cheque se a porta 3000 está sendo usada por outra aplicação.

OBS: Não precisa recarregar a página para ver as mudanças quando está desenvolvendo. Só salvar o arquivo.

### Como colocar as alterações no ar?

Use "yarn build" ou "npm run build" para compilar o projeto em React.

Após isso, utilize "firebase deploy" para mandar as alterações para ubireudo.web.app. Teste no servidor local antes de mandar para o site principal.

## Créditos

Esse projeto utiliza [Create React App](https://github.com/facebook/create-react-app).