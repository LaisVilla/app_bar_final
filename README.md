# Bar Mediterrâneo - App 

O **Bar Mediterrâneo - App** tem como objetivo modernizar a experiência de clientes e funcionários do Bar Mediterrâneo por meio de um aplicativo completo e intuitivo. A principal proposta é fornecer uma plataforma digital que facilite as reservas de eventos, visualização do cardápio e gestão de pedidos, tudo em um único lugar.

Este aplicativo visa oferecer aos usuários a possibilidade de realizar reservas de forma prática e eficiente, selecionar produtos do cardápio, e fazer pagamentos diretamente pelo app. Para os funcionários do bar, o sistema otimiza o processo de gerenciamento de pedidos e reservas, além de fornecer uma interface de fácil navegação.

## Tecnologias Utilizadas

- **Google Docs**: Utilizado para documentar o desenvolvimento do projeto e facilitar a colaboração entre a equipe.
- **Google Meet**: Usado para reuniões de alinhamento e definição de requisitos com os donos do produto.
- **Canva**: Utilizado para criação de materiais gráficos como banners e posts para divulgação.
- **Figma**: Ferramenta usada para a prototipagem de interfaces e design do aplicativo.
- **VS Code**: Editor de código utilizado para o desenvolvimento do projeto.
- **JavaScript**: Linguagem de programação utilizada para o desenvolvimento frontend e backend.
- **React Native com Expo (iOS)**: Framework para o desenvolvimento frontend do aplicativo, permitindo a compatibilidade com iOS.
- **MongoDB**: Banco de dados NoSQL utilizado no backend para armazenar informações sobre produtos, reservas e usuários.

## Funcionalidades

- **Cadastro e Login**: Os usuários podem se cadastrar e fazer login para realizar reservas e compras.
- **Cardápio Digital**: Visualização do cardápio com informações detalhadas sobre cada produto (nome, descrição e preço), com a possibilidade de adicionar ao carrinho.
- **Reserva de Eventos**: Permite que os usuários façam reservas para eventos no bar, com controle de disponibilidade de data e limite de pessoas.
- **Carrinho de Compras**: Funcionalidade que permite adicionar produtos ao carrinho, visualizar e finalizar a compra.
- **Pagamento**: Integração com formas de pagamento para a finalização das compras e reservas.

## Estrutura de Pastas

A estrutura de pastas do projeto é organizada para separar claramente as diferentes funcionalidades e componentes do aplicativo:


## Estrutura de Pastas

A estrutura de pastas do projeto é organizada para separar claramente as diferentes funcionalidades e componentes do aplicativo:

APP_BAR/ ├── api/
├── models/
│ ├── Compra.js │ ├── Produto.js │ ├── Reserva.js │ └── User.js ├── assets/
├── context/
│ └── CarrinhoContext.js ├── navigation/
│ └── StackNavigator.js ├── screens/
│ ├── CadastroProdutoScreen.js │ ├── CardapioScreen.js │ ├── CarrinhoScreen.js │ ├── HomeScreen.js │ ├── LoginScreen.js │ ├── PagamentoScreen.js │ ├── RegisterScreen.js │ └── ReservasScreen.js └── App.js

## Como Rodar o Projeto

### Pré-requisitos

1. **Node.js**: Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.
2. **Expo CLI**: Instale o Expo CLI globalmente, se ainda não tiver:

   ```bash
   npm install -g expo-cli


MongoDB: O backend utiliza o MongoDB. Certifique-se de ter um banco de dados MongoDB configurado e rodando. Se estiver utilizando MongoDB Atlas, crie uma conta e configure sua instância de banco de dados.

### Rodando o Frontend

Clone o repositório:

git clone https://github.com/LaisVilla/app_bar_final.git
cd app_bar_final

Instale as dependências:
    
    ```bash
       npm install

Inicie o projeto no Expo:

expo start

Abra o aplicativo no emulador ou no seu dispositivo móvel com o Expo Go.

Rodando o Backend
Para rodar o backend com MongoDB, é necessário configurar um servidor em Node.js para interação com o banco de dados. Você pode utilizar o Express.js para criar rotas de API para gerenciar reservas e produtos.

Acesse a pasta backend

Instale as dependências:

npm install

Inicie o servidor:

yarn start

Contribuindo
Sinta-se à vontade para contribuir com melhorias no projeto! Para isso, basta seguir as etapas:

Faça um fork do repositório.
Crie uma branch para a sua funcionalidade (git checkout -b nova-funcionalidade).
Comite suas alterações (git commit -m 'Adicionando nova funcionalidade').
Envie para a branch principal (git push origin nova-funcionalidade).
Abra um Pull Request.
Licença


