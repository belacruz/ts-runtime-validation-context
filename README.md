# User Management & Runtime Validation System

Este projeto é uma aplicação **React + TypeScript** desenvolvida para demonstrar padrões avançados de **gerenciamento de estado global**, **consumo de APIs assíncronas** e, principalmente, a implementação de um **motor de validação de schemas em tempo de execução** utilizando TypeScript em modo estrito.

O objetivo principal é elevar um desafio comum de consumo de dados a um nível de **resiliência de produção**, garantindo que a interface **nunca trabalhe com dados malformados** provenientes de fontes externas.

---

## Diferenciais Técnicos

### 1. Validação de Schema em Tempo de Execução

Diferente da abordagem convencional que confia apenas na tipagem estática, este projeto implementa um **motor de validação customizado**. Ele intercepta a resposta da API e valida a estrutura dos dados **antes** que eles cheguem ao estado da aplicação.

* **Inferência de Tipos:** Utilização de `Generics` e do operador `infer` para extrair tipos estáticos diretamente das definições de schema.
* **Recursividade:** Suporte a objetos aninhados através de mapeamento recursivo de tipos.
* **Segurança:** Garante que o contrato entre Frontend e API seja respeitado, lançando erros claros sempre que a estrutura dos dados diverge do esperado.

---

### 2. Política Zero `any`

Seguindo as melhores práticas modernas de TypeScript, o projeto foi escrito com **`strict mode` ativado** e **sem utilização do tipo `any`**.

* Toda entrada de dados externa é tratada inicialmente como `unknown`.
* O refinamento ocorre exclusivamente por meio de **Type Guards** e validações explícitas.
* Essa abordagem garante segurança real tanto em **tempo de compilação** quanto em **tempo de execução**.

---

### 3. Gerenciamento de Estado e Fluxo de Dados

A aplicação utiliza a **Context API** para centralizar o estado do usuário e coordenar múltiplas requisições de forma previsível e segura.

* **Fetch em Cascata:** Uma requisição inicial popula a listagem de usuários, enquanto requisições subsequentes buscam dados detalhados com base em identificadores dinâmicos.
* **Memoização:** Uso estratégico de `useMemo` e `useCallback` para evitar re-renderizações desnecessárias e reduzir o custo computacional do motor de validação.

---

### 4. Resiliência de Rede

O hook customizado `useFetch` gerencia todo o ciclo de vida das requisições utilizando **`AbortController`**, prevenindo problemas comuns em aplicações assíncronas.

* **Memory Leaks:** Requisições são automaticamente canceladas quando componentes são desmontados.
* **Race Conditions:** Apenas a requisição mais recente pode atualizar o estado da aplicação, mesmo em cenários de alta latência.

---


## Tecnologias Utilizadas

* **React 18**
* **TypeScript (Strict Mode)**
* **CSS Moderno** (Variables & Grid Layout)
* **Fetch API**

---

## Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/belacruz/ts-runtime-validation-context.git
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
``` 
