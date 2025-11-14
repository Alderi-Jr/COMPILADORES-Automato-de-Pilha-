# 📘 Analisador Sintático 

![Status](https://img.shields.io/badge/status-completo-brightgreen.svg)
![Type](https://img.shields.io/badge/type-acadêmico-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)

## 🎯 Descrição do Projeto

Este projeto implementa um **Analisador Sintático ** completo, seguindo as especificações do TDE de Compiladores.  
Ele apresenta:

- Tabela de parsing  
- FIRST e FOLLOW exibidos diretamente na interface  
- Simulação completa do analisador por pilha  
- Modo analisar tudo  
- Modo passo a passo  
- Geração interativa de sentenças clicando na tabela  
- Detecção visual de erros  
- Layout minimalista dividido em dois painéis  
- Totalmente implementado com HTML + CSS + JavaScript puro  

## 📚 Gramática Utilizada

```
S ::= a A
A ::= b B d | c C | d D
B ::= a C | b B
C ::= c S | ε
D ::= a b
```

## 🔎 Conjuntos FIRST

```
FIRST(S) = { a }
FIRST(A) = { b, c, d }
FIRST(B) = { a, b }
FIRST(C) = { c, ε }
FIRST(D) = { a }
```

## 🔍 Conjuntos FOLLOW

```
FOLLOW(S) = { $, d }
FOLLOW(A) = { $, d }
FOLLOW(B) = { d }
FOLLOW(C) = { $, d }
FOLLOW(D) = { $, d }
```

## 📊 Tabela de Parsing 

| NT  | a       | b        | c        | d       | $     |
|-----|---------|----------|----------|---------|-------|
| S   | S→aA     | -        | -        | -       | -     |
| A   | -       | A→bBd    | A→cC     | A→dD    | -     |
| B   | B→aC     | B→bB     | -        | -       | -     |
| C   | -       | -        | C→cS     | C→ε     | C→ε   |
| D   | D→ab     | -        | -        | -       | -     |

## 🧠 Funcionamento do Analisador 

O analisador segue a tabela preditiva.  

1. A pilha inicia como: `S $`  
2. A entrada recebe um `$` ao final  
3. O analisador lê símbolo por símbolo  
4. Para cada não-terminal no topo da pilha, consulta a tabela  
5. A sentença é aceita somente quando pilha = `$` e entrada = `$`

Durante a execução, o sistema exibe:

- Conteúdo da pilha  
- Entrada  
- Ação executada  
- Número de passos  
- Resultado (aceita / rejeita)

## 🧩 Geração Interativa

Permite montar sentenças clicando diretamente na tabela.  
- Expande sempre o primeiro não-terminal  
- Impede derivações inválidas  
- Sentença final pode ser enviada para análise  

## 🖥️ Tecnologias Utilizadas

- HTML5  
- CSS3  
- JavaScript puro  

## 📁 Estrutura do Projeto

```
index.html
style.css
script.js
README.md
```

## 🚀 Como Executar

Basta abrir:

```
index.html
```

no navegador.

