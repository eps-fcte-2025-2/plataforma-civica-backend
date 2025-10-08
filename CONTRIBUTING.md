# Guia de Contribuição

Para mantermos um fluxo de trabalho organizado e consistente, por favor, siga as diretrizes abaixo ao criar issues, commits, pull requests, branches e comentários no código.

## Sumário

- [Issues](#issues)
- [Commits](#commits)
- [Pull requests](#pull-requests)
- [Estrutura de branches](#estrutura-de-branches)
- [Comentários no código](#comentários-no-código)

## Issues

### Criação de issues

- **Título**: Deve ser claro e conciso, resumindo o problema ou a sugestão.
- **Descrição**: Forneça detalhes completos, incluindo passos para reproduzir (se aplicável), contexto e qualquer informação relevante.

### Uso de templates

Utilize os templates específicos para cada tipo de issue:

- **Bug report**: Para reportar erros ou falhas.
- **Feature request**: Para sugerir novas funcionalidades.
- **Task**: Para tarefas gerais que não se enquadram nos demais tipos.

## Commits

### Formato dos commits

Siga o padrão:

```
<tipo>(#<numero da issue>): <descrição breve>
```

### Tipos de commits

- **feat**: Adição de uma nova funcionalidade.
- **fix**: Correção de um bug.
- **docs**: Alterações na documentação.
- **style**: Alterações de formatação ou estilo que não afetam a lógica do código.
- **refactor**: Alterações que melhoram o código sem adicionar funcionalidades ou corrigir bugs.
- **test**: Adição ou correção de testes.
- **chore**: Atualizações de tarefas de build ou ferramentas auxiliares.
- **perf**: Usado para mudanças que melhoram o desempenho.
- **ci**: Usado para alterações na configuração de integração contínua (Continuous Integration).
- **build**: Usado para mudanças que afetam o processo de build ou dependências.
- **revert**: Usado para reverter um commit anterior.

### Exemplos

- `feat(#42): adiciona validação de email no formulário de cadastro`
- `fix(#144): corrigi erro de null pointer no módulo de autenticação`

## Pull requests

### Abrir pull requests

Não se deve fazer commit direto na main. Para isso, abra um PR (pull request):

- Abrir PR sempre para a branch principal de desenvolvimento.
- Exigir pelo menos 1 revisor para aprovação.
- O revisor deve baixar a branch e testar a funcionalidade localmente.
- Ao aceitar um pull request, atualizar o status da issue no projeto para Done.

### Estrutura de pull requests para código

- **Título**: Use o mesmo padrão dos commits.
- **Descrição**:
  - **O que foi feito**: Descreva as mudanças realizadas.
  - **Por que foi feito**: Explique a motivação por trás das mudanças.
  - **Como testar**: Instruções para testar as alterações.

Exemplo:

- `feat(#42): adiciona validação de email no formulário de cadastro`

## Estrutura de branches

Use o seguinte padrão para nomear branches:

```
<tipo>/<numero_da_issue>-<descricao-kebab-case>
```

### Exemplo

- Para a issue **#3 Cria documento de BPMN**:

```
docs/3-cria-documento-de-bpmn
```

## Comentários no código

### Boas práticas

- **Clareza**: Os comentários devem esclarecer partes do código que não são imediatamente óbvias.
- **Relevância**: Evite comentários óbvios ou redundantes.
- **Atualização**: Mantenha os comentários atualizados com as mudanças no código.

### Padronização

- **Funções e classes**: Utilize docstrings ou comentários estruturados para documentar a finalidade, parâmetros e retorno.
- **TODOs**: Marque com `// TODO:` seguido da tarefa a ser realizada.

### Exemplo

```javascript
/**
 * Calcula a soma de dois números.
 *
 * @param {number} a - O primeiro número.
 * @param {number} b - O segundo número.
 * @returns {number} A soma de `a` e `b`.
 */
function soma(a, b) {
  return a + b;
}
```
