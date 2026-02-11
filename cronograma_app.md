# App de Cronograma — Especificação (MVP)

Este documento descreve como construir um website que:
1) permite **upload** de um arquivo `cronograma.json`,
2) **lê e interpreta** o conteúdo,
3) exibe a **Fase atual**, um **combo de dias**, e
4) ao selecionar o dia, mostra o **cronograma** (agenda do dia).

---

## 1. Requisitos (resumo)

- Usuário acessa o site.
- Usuário vê um botão para fazer **upload** do arquivo.
- Sistema carrega o arquivo `cronograma.json`.
- Sistema mostra:
  - **Fase**
  - **combo/select** para selecionar o **dia**
- Ao selecionar o dia, é mostrado o **cronograma** do dia.

---

## 2. Como inserir as informações no `cronograma.json`

Você vai inserir as fases, dias e treinos **em um formato padronizado** dentro do arquivo JSON.

> Abaixo estão as regras para o parser (leitor do arquivo).

---

## 3. Regras do formato (o “contrato” do arquivo)

### 3.1 Propriedades de alto nível (obrigatório)

No topo do JSON, inclua:

- `faseAtual`: string (ex: `"Fase 1 — Reconstrução Total"`) **(obrigatório)**
- `inicio`: string (data ISO `YYYY-MM-DD`) **(opcional)**
- `duracaoSemanas`: number **(opcional)**
- `objetivo`: string **(opcional)**
- `regras`: array de strings **(opcional)**
- `fases`: array de fases **(obrigatório)**

Exemplo (alto nível):

```json
{
  "faseAtual": "Fase 1 — Reconstrução Total",
  "inicio": "2026-02-16",
  "duracaoSemanas": 8,
  "objetivo": "Reconstruir base física...",
  "regras": ["..."],
  "fases": []
}
```

### 3.2 Estrutura de `fases`

Cada fase deve ter:

- `titulo`: string (ex: `"Fase 1 — Reconstrução Total"`) **(obrigatório)**
- `dias`: array de dias **(obrigatório)**

Exemplo:

```json
{
  "titulo": "Fase 1 — Reconstrução Total",
  "dias": []
}
```

### 3.3 Estrutura de `dias`

Cada dia dentro da fase deve ter:

- `nome`: string (ex: `"Segunda"`, `"Terça"`, etc.) **(obrigatório)**
- `itens`: array de itens do cronograma **(obrigatório)**

> O sistema vai montar o combo de dias a partir de `dias[].nome` **da fase atual**.

Exemplo:

```json
{
  "nome": "Segunda",
  "itens": []
}
```

### 3.4 Itens do cronograma

Cada item deve ter:

- `hora`: string no formato `HH:MM` **(opcional)**
- `descricao`: string **(obrigatório)**

> Se `hora` não existir, o app deve exibir como **“Sem horário”**.

Exemplo:

```json
{ "hora": "07:00", "descricao": "Acordar + água" }
```

---

## 4. Exemplo completo de `cronograma.json`

O exemplo completo está no arquivo anexado `cronograma.json` (use como base e vá editando).

---

## 5. Comportamento do App (fluxo de tela)

### 5.1 Tela inicial
- Título do app (ex: “Cronograma Real Madrid 2026”)
- Botão: **Upload do arquivo `cronograma.json`**
- Texto de ajuda: “Envie seu cronograma em formato JSON para carregar as fases e dias.”

### 5.2 Após upload (conteúdo carregado)
Exibir:
- **Fase atual:** vindo de `faseAtual`
- **Select (combo) de dias:** listando `dias[].nome` encontrados dentro da fase atual
- Área “Cronograma do dia”: lista os `itens` do dia selecionado

### 5.3 Regras de seleção
- Ao abrir a página após upload:
  - selecionar automaticamente o **primeiro dia** disponível, ou
  - selecionar o **dia atual** (opcional, se quiser melhorar depois)

---

## 6. Regras de parsing (como o sistema “lê” o arquivo)

### 6.1 Passo a passo do parser
1) Ler o arquivo como texto.
2) Fazer `JSON.parse`.
3) Pegar `faseAtual`.
4) Encontrar a fase correspondente em `fases`:
   - `fases.find(f => f.titulo === faseAtual)`
5) Dentro dessa fase, montar:
   - o combo de dias a partir de `fase.dias[].nome`
6) Ao selecionar um dia:
   - encontrar o dia em `fase.dias` e renderizar `itens`

### 6.2 Estrutura de dados sugerida (após parsing)
```ts
type Cronograma = {
  faseAtual: string;
  inicio?: string;
  duracaoSemanas?: number;
  objetivo?: string;
  regras?: string[];
  fases: Array<{
    titulo: string;
    dias: Array<{
      nome: string;
      itens: Array<{ hora?: string; descricao: string }>;
    }>;
  }>;
};
```

---

## 7. Validações (para evitar erro do usuário)

- Se não existir `faseAtual`:
  - mostrar erro: “Arquivo inválido: faseAtual não encontrado.”
- Se a fase atual não existir em `fases[].titulo`:
  - mostrar erro: “Fase atual não encontrada na lista de fases do arquivo.”
- Se não existir nenhum dia em `fase.dias`:
  - mostrar erro: “Nenhum dia encontrado para esta fase.”
- Se um item não tiver `hora`, exibir como “Sem horário”.

---

## 8. Sugestões de melhoria (opcional, depois do MVP)

- Botão “Trocar fase” (selecionar Fase 1/2/3/4)
- Detecção automática do dia da semana
- Marcação de itens concluídos (checklist localStorage)
- Exportar progresso
- Suporte a múltiplos cronogramas (upload e histórico)

---

## 9. Checklist do MVP

- [ ] Tela com botão de upload
- [ ] Leitura do arquivo como texto (FileReader)
- [ ] `JSON.parse` + validações do schema
- [ ] Parser/seleção de fase, dias e itens
- [ ] UI com Fase atual, Select de dias, lista do cronograma
- [ ] Tratamento de erro/arquivo inválido

---

# Stacks para serem usadas
- Frontend: Next.js
- Backend: Next.js API Routes
- CSS: Tailwind CSS
- Banco de dados: SQLite (para armazenar o arquivo `cronograma.json`)
- Deploy: Vercel

# Rotas a serem criadas
- `/` (página principal com o cronograma)
- `/upload` (página para fazer o upload do arquivo)
