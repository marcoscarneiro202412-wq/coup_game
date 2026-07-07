# Coup Game

Aplicação web em React para jogar uma experiência local inspirada em Coup, com cadastro de jogadores, turnos, ações, persistência de estado e fluxo de autenticação.

## Visão geral

Este projeto foi criado para oferecer uma versão simples e interativa do jogo, permitindo que um grupo de jogadores participe de uma partida local diretamente no navegador. A lógica do jogo, o estado global e a navegação foram organizados com React, Redux Toolkit e React Router.

## Principais funcionalidades

- Cadastro de jogadores com nome e avatar opcional
- Início de partida com distribuição inicial de personagens
- Turnos e rodada do jogo
- Ações de jogo, como declarar personagem, confrontar, atacar e realizar ações especiais
- Controle de vida, dinheiro e status dos jogadores
- Tela de vencedor ao final da partida
- Autenticação básica de usuário
- Histórico de partidas salvo por meio de uma API externa
- Persistência local do estado para melhorar a experiência

## Tecnologias utilizadas

- React 18
- Vite
- Redux Toolkit
- React Redux
- React Router
- CSS Modules
- Material UI para alguns controles de interface

## Estrutura do projeto

A organização do projeto segue a separação entre páginas, componentes, estado global, regras de domínio e middleware:

- src/pages: telas principais da aplicação
- src/components: elementos visuais e blocos reutilizáveis
- src/features: slices do Redux para autenticação, jogadores, jogo e turnos
- src/domain: regras e lógica relacionada ao funcionamento do jogo
- src/middleware: efeitos colaterais e integração com persistência/fluxo de partida
- src/services: integração com armazenamento local e APIs externas

## Fluxo da aplicação

```text
Home
  -> Login ou cadastro
  -> Registro de jogadores
  -> Início da partida
  -> Tela principal do jogo
  -> Tela de vencedor
```

Rotas principais:

```text
/                Página inicial
/login           Tela de login
/signup          Tela de cadastro
/history         Histórico do usuário
/game/register  Cadastro de jogadores para a partida
/game/play      Tela principal do jogo
/game/winner    Tela de vencedor
```

## Como executar localmente

### Requisitos

- Node.js 18+
- npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run start
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview da build

```bash
npm run preview
```

## Como usar o jogo

1. Acesse a aplicação no navegador.
2. Faça login ou crie uma conta.
3. Cadastre pelo menos 3 jogadores.
4. Inicie a partida.
5. Cada jogador deve declarar um personagem e executar as ações disponíveis durante o turno.
6. O jogo segue até restar apenas um jogador vivo, quando a tela de vencedor é exibida.

## Observações importantes

- O projeto ainda depende de uma API externa para autenticação e histórico.
- Algumas interações do jogo ainda usam prompts e alerts no navegador.
- A lógica de regras está distribuída entre reducers, helpers e middlewares.
- O projeto é mais voltado para demonstração e estudo de arquitetura React/Redux do que para um produto totalmente robusto.

## Próximos passos possíveis

- Melhorar a organização das regras do jogo
- Adicionar testes automatizados
- Substituir interações com prompt por uma interface mais fluida
- Expandir a experiência de histórico e persistência

## Licença

Este projeto é de uso pessoal e acadêmico, e pode ser adaptado conforme necessário.
