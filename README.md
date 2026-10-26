# Power-Up CPO — Gestão de Demandas (Trello)

Power-Up do Trello para o quadro da Coordenadoria de Projetos e Obras
(CPO/UNIFAL-MG). Tudo estático — basta subir no GitHub Pages.

Cobre o ciclo completo de padronização de processos:

| # | Ponto | Onde está no Power-Up |
|---|---|---|
| 1 | **Mapear o cenário atual** | Menu do quadro → **Cenário atual** (por tipo: como é feito, quem participa, ferramentas, onde a informação circula) |
| 2 | **Gargalos e problemas** | **Painel do fluxo** (sinais de atraso, cards parados, sobrecarga por responsável) + campo "gargalos" no Cenário atual |
| 3 | **Desenhar o novo fluxo** | Fluxos padrão por tipo (18/11/5/3 etapas) + **Etapas e fluxo** (responsável, prazo, critério de avanço por etapa) + **Configurar fluxo** (equipe e prazos padrão) |
| 4 | **Ferramentas centralizadas** | Tudo dentro do Trello: triagem, etapas, custos, painel — sem ilha de informação |
| 5 | **Monitorar e ajustar** | **Painel do fluxo**: KPIs, distribuição por tipo, execução %, orçamento total |
| 6 | **Prazo por etapa** | Em **Etapas e fluxo** (prazo individual) + prazos padrão por tipo em **Configurar fluxo** |
| 7 | **Orçamento estimado** | **Orçamento e custos**: valor orçado, fonte do recurso, itens de custo, saldo e % de execução |

## Estrutura

```
powerup-cpo/
├── index.html      ← connector (capabilities: card-buttons, card-badges,
│                      card-detail-badges, card-back-section, board-buttons)
├── fluxos.js       ← templates dos 4 fluxos + helpers compartilhados
├── triagem.html    ← classificação (tipo, prioridade, prazo, SEI, responsável)
├── etapas.html     ← fluxo padronizado com status/responsável/prazo/critério
├── financas.html   ← orçamento estimado, fonte, itens de custo
├── secao.html      ← seção no verso do card (resumo + progresso)
├── painel.html     ← painel do quadro: KPIs, gargalos, acompanhamento
├── relatorio.html  ← lista de cards classificados por prioridade
├── cenario.html    ← mapeamento do cenário atual por tipo
├── config.html     ← padrões do quadro (equipe, prazos por tipo/etapa)
├── icon.png        ← ícone 128×128
└── README.md
```

## Dados (armazenamento do Trello — limite 4096 caracteres por chave)

| Chave | Escopo | Conteúdo |
|---|---|---|
| `cpoTriagem` | card/shared | tipo, prioridade, prazo, SEI, responsável, obs |
| `cpoEtapas` | card/shared | tipo + lista de etapas (status, resp, prazo, critério) |
| `cpoFinancas` | card/shared | orçado, fonte, itens de custo |
| `cpoLog` | card/shared | últimos 20 eventos do card |
| `cpoConfig` | board/shared | equipe, prazos por tipo, prazos por etapa |
| `cpoCenario_<Tipo>` | board/shared | mapeamento do cenário por tipo (uma chave por tipo) |

## Passo 1 — Publicar no GitHub Pages

1. Crie um repositório público, ex.: `powerup-cpo`.
2. Suba **todos os arquivos** na raiz do repositório (inclusive `fluxos.js`).
3. **Settings → Pages → Deploy from a branch → main / (root) → Save**.
4. URL final: `https://SEU-USUARIO.github.io/powerup-cpo/`
5. Teste abrindo `.../powerup-cpo/triagem.html` no navegador.

## Passo 2 — Registrar no Trello

1. **https://trello.com/power-ups/admin** → Create a new Power-Up:
   - **Name**: `CPO — Gestão de Demandas`
   - **Iframe Connector URL**: `https://SEU-USUARIO.github.io/powerup-cpo/index.html`
2. Aba **Capabilities**, ative: `card-buttons`, `card-badges`,
   `card-detail-badges`, `card-back-section`, `board-buttons`.
3. (Opcional) API key só é necessária para REST API — este Power-Up não usa.

## Passo 3 — Ativar no quadro e usar

1. Quadro CPO → Menu (…) → Power-Ups → aba **Custom** → adicione.
2. **Fluxo de uso recomendado:**
   - Preencha **Cenário atual** (uma vez, por tipo) → mapeia ponto 1 e 2
   - Em **Configurar fluxo**: equipe + prazos padrão → ponto 3
   - Nos cards: **Classificar demanda** → **Etapas e fluxo** (aplicar fluxo →
     preencher resp/prazo/critério) → **Orçamento e custos** → pontos 3, 6, 7
   - Acompanhe pelo **Painel do fluxo** → ponto 5

## Personalizar

- **Fluxos padrão**: edite `CPO.FLUXOS` em `fluxos.js` (mesmos nomes das
  checklists dos cards-modelo do quadro).
- **Chaves de storage**: constantes em `CPO.CHAVES` (fluxos.js).
- **Cores**: badges do Trello em `corTipo`/`corPrioridade`; CSS nos HTMLs.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Botão/badge não aparece | Capability não ativada no Admin Portal **ou** não declarada no `index.html` |
| Botão aparece vazio e some | Erro no connector — console (F12) no iframe |
| Popup em branco | URL errada no `t.popup` (confira o caminho real no GitHub Pages) |
| Dados não salvam | Power-Up precisa estar **ativo no quadro** para usar storage compartilhado |
| "Storage limit exceeded" | Chave passou de 4096 caracteres — reduza o conteúdo (cenário usa uma chave por tipo justamente por isso) |
| Alterações não refletem | Cache do GitHub Pages — Ctrl+Shift+R ou aguarde ~1 min |