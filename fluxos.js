/* fluxos.js — templates de fluxo e helpers compartilhados do Power-Up CPO */
var CPO = (function () {
  var CHAVES = {
    triagem: 'cpoTriagem',
    etapas: 'cpoEtapas',
    financas: 'cpoFinancas',
    log: 'cpoLog',
    config: 'cpoConfig',
    cenario: 'cpoCenario_'
  };

  /* Fluxos reais do quadro CPO (capturados dos cards-modelo em 26/10/2026) */
  var FLUXOS = {
    'Projeto': [
      'Levantamento de necessidades',
      'Levantamento topográfico/geodésico',
      'Levantamento cadastral (prédio existente)',
      'Reunião de alinhamento',
      'Anteprojeto de arquitetura',
      'Projeto executivo de arquitetura',
      'Projeto executivo de estrutura',
      'Projeto de elétrica',
      'Projeto de lógica (redes/dados)',
      'Projeto de HVAC (ar-condicionado/ventilação)',
      'Projeto de gases especiais',
      'Projeto de combate a incêndio e pânico',
      'Demais disciplinas (hidráulica, acessibilidade, drenagem etc.)',
      'Projeto de paisagismo',
      'Laudo/relatório de segurança do trabalho (NR-18)',
      'Compatibilização entre disciplinas',
      'ART/RRT e registro profissional',
      'Projeto pronto para orçamento/licitação'
    ],
    'Obra': [
      'Medição e serviços preliminares',
      'Serviços preliminares (canteiro, tapume, demolições)',
      'Fundação',
      'Estrutura',
      'Vedação e alvenaria',
      'Cobertura',
      'Instalações (elétrica, lógica, hidráulica, HVAC, gases especiais)',
      'Combate a incêndio (execução)',
      'Acabamentos',
      'Vistoria e correções',
      'Entrega e as-built'
    ],
    'Serviço': [
      'Abrir/verificar processo SEI (se aplicável)',
      'Orçamento e aprovação do solicitante',
      'Execução do serviço',
      'Verificação com o solicitante',
      'Conclusão e registro (fotos, termo, SEI)'
    ],
    'Demanda interna': [
      'Definir escopo e resultado esperado',
      'Executar',
      'Entregar/revisar'
    ]
  };

  var STATUS = { t: 'A fazer', a: 'Em andamento', c: 'Concluída' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function dataBR(iso) {
    if (!iso) return '';
    var p = String(iso).split('-');
    if (p.length < 3) return String(iso);
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function diasAte(iso) {
    if (!iso) return null;
    var hoje = new Date(hojeISO() + 'T00:00:00');
    var alvo = new Date(String(iso).slice(0, 10) + 'T00:00:00');
    return Math.round((alvo - hoje) / 86400000);
  }

  /* Cores de badge aceitas pelo Trello: blue green orange red yellow purple pink sky lime light-gray */
  function corTipo(tipo) {
    if (tipo === 'Obra') return 'orange';
    if (tipo === 'Serviço') return 'purple';
    if (tipo === 'Demanda interna') return 'sky';
    return 'blue';
  }

  function corPrioridade(p) {
    if (p === 'Alta') return 'red';
    if (p === 'Baixa') return 'light-gray';
    return 'yellow';
  }

  function fmtR$(v) {
    var n = Number(v) || 0;
    return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function logEvent(t, acao, extra) {
    return t.get('card', 'shared', CHAVES.log).then(function (log) {
      log = log || { eventos: [] };
      log.eventos = log.eventos || [];
      log.eventos.unshift({ d: new Date().toISOString(), a: acao, x: extra || '' });
      if (log.eventos.length > 20) log.eventos = log.eventos.slice(0, 20);
      return t.set('card', 'shared', CHAVES.log, log);
    }).catch(function () { /* log nunca bloqueia a operação principal */ });
  }

  function autoSave(fn, ms) {
    var timer = null;
    return function () {
      var args = arguments, self = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(self, args); }, ms || 600);
    };
  }

  return {
    CHAVES: CHAVES, FLUXOS: FLUXOS, STATUS: STATUS,
    esc: esc, dataBR: dataBR, hojeISO: hojeISO, diasAte: diasAte,
    corTipo: corTipo, corPrioridade: corPrioridade, fmtR$: fmtR$,
    logEvent: logEvent, autoSave: autoSave
  };
})();