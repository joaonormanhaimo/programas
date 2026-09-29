/* ==========================================================================
   IMO · Programas de Acompanhamento — lógica da página
   Tudo é gerado a partir de assets/js/config.js. Não é preciso editar aqui
   para mudar preços ou textos dos programas.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.IMO_CONFIG;
  if (!C) return;

  /* ---------- utilitários ---------- */
  var fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function brl(n) {
    var s = fmt.format(n);
    return Number.isInteger(n) ? s.replace(/,00$/, "") : s;
  }
  function pct(n) { return Math.round(n * 100) + "%"; }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function wa(msg) {
    return "https://wa.me/" + C.clinica.whatsapp + "?text=" + encodeURIComponent(msg);
  }
  function msgPrograma(p) {
    return C.mensagens.programa.replace("{PROGRAMA}", p.nome).replace("{MESES}", p.meses);
  }

  var AV = C.consultaAvulsa.valor;

  /* ---------- cálculos por programa ---------- */
  var P = C.programas.map(function (p) {
    var avulsoEq = p.consultas * AV;
    var economia = avulsoEq - p.valor;
    var renov = p.descontoRenovacao ? p.valor * (1 - p.descontoRenovacao / 100) : null;
    return Object.assign({}, p, {
      porConsulta: p.valor / p.consultas,
      porConsultaExibido: p.valorConsultaExibido || p.valor / p.consultas,
      avulsoEq: avulsoEq,
      economia: economia,
      economiaPct: economia / avulsoEq,
      economiaPorConsulta: AV - p.valor / p.consultas,
      renovacao: renov,
      renovPorConsulta: renov ? renov / p.consultas : null,
      cartaoParcela: p.valor / C.pagamento.cartao.parcelas,
      boletoParcela: p.valor / C.pagamento.boleto.parcelas
    });
  });
  var maxPct = Math.max.apply(null, P.map(function (p) { return p.economiaPct; }));

  /* ---------- links de WhatsApp estáticos ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var key = a.getAttribute("data-wa");
    if (C.mensagens[key]) a.href = wa(C.mensagens[key]);
  });

  /* ---------- HERO ---------- */
  $("heroFacts").innerHTML =
    "<li><strong>" + P.length + "</strong><span>programas</span></li>" +
    "<li><strong>" + esc(C.destaqueEconomia || ("até " + pct(maxPct))) + "</strong><span>de economia por consulta</span></li>";

  /* ---------- JORNADA ---------- */
  var pc = C.primeiraConsulta;
  $("journey").innerHTML = [
    ["Plano de tratamento", "Você define o programa que melhor atende a sua necessidade.", "Definido no retorno"],
    ["Adesão", "Você confirma o programa pelo WhatsApp e escolhe a forma de pagamento.", "Pix, boleto ou cartão"],
    ["Acompanhamento", "Consultas online periódicas e telemonitoramento com a equipe entre elas.", "Durante todo o programa"]
  ].map(function (s) {
    return "<li class='reveal'><h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p><span class='tag'>" + esc(s[2]) + "</span></li>";
  }).join("");

  /* ---------- CARDS ---------- */
  $("plans").innerHTML = P.map(function (p) {
    var kpis =
      "<div class='kpi kpi--gold'><small>Por consulta</small><b>" + brl(p.porConsultaExibido) + "</b></div>" +
      "<div class='kpi kpi--green'><small>Economia</small><b>" + brl(p.economia) + "</b></div>" +
      "<div class='kpi'><small>Consultas</small><b>" + p.consultas + "</b></div>" +
      "<div class='kpi'><small>Telemonit.</small><b>" + p.telemonitoramentoMeses + " meses</b></div>";
    return (
      "<article class='plan reveal" + (p.destaque ? " plan--featured" : "") + "' id='plano-" + p.id + "'>" +
        (p.selo ? "<span class='plan__badge'>" + esc(p.selo) + "</span>" : "") +
        "<h3 class='plan__name'>" + esc(p.nome) + "</h3>" +
        "<p class='plan__sum'>" + esc(p.resumo) + "</p>" +
        "<div class='plan__price'><span class='cur'>R$</span><span class='val'>" +
          brl(p.valor).replace(/^R\$\s?/, "") + "</span><span class='per'>/ " + p.meses + " meses</span></div>" +
        "<p class='plan__inst'>ou até " + C.pagamento.cartao.parcelas + "x de " + brl(p.cartaoParcela) +
          " no cartão (+ taxas) · " + C.pagamento.boleto.parcelas + "x de " + brl(p.boletoParcela) + " no boleto</p>" +
        "<div class='plan__kpis'>" + kpis + "</div>" +
        "<ul class='plan__list'>" + p.beneficios.map(function (b, k) { return "<li>" + esc(b) + (k === 0 ? "*" : "") + "</li>"; }).join("") + "</ul>" +
        "<a class='btn " + (p.destaque ? "btn--gold" : "btn--green") + " btn--block' target='_blank' rel='noopener' href='" +
          wa(msgPrograma(p)) + "'><span class='i-wa' aria-hidden='true'></span>Aderir ao " + esc(p.nome) + "</a>" +
        "<p class='plan__foot'>* As " + p.consultas + " consultas devem ser realizadas dentro dos " + p.meses + " meses do programa.</p>" +
      "</article>"
    );
  }).join("");

  $("single").innerHTML =
    "<div class='single__item reveal'><div><h3>Consulta avulsa</h3><p>" + C.consultaAvulsa.modalidade +
      " · sem telemonitoramento</p></div>" +
      "<div style='display:flex;align-items:center;gap:14px;flex-wrap:wrap'><span class='single__price'>" + brl(AV) +
      "</span><a class='btn btn--ghost btn--sm' target='_blank' rel='noopener' href='" + wa(C.mensagens.avulsa) +
      "'>Agendar</a></div></div>";

  /* ---------- COMPARADOR ---------- */
  var tabs = $("calcTabs"), body = $("calcBody");
  tabs.innerHTML = P.map(function (p, i) {
    return "<button class='calc__tab' role='tab' id='tab-" + p.id + "' aria-controls='calcBody' aria-selected='" +
      (i === 0 ? "true" : "false") + "' tabindex='" + (i === 0 ? "0" : "-1") + "' data-i='" + i + "'>" + esc(p.nome) + "</button>";
  }).join("");
  body.setAttribute("role", "tabpanel");

  function bar(label, value, max, cls) {
    return "<div class='bar'><div class='bar__label'><span>" + label + "</span><b>" + brl(value) + "</b></div>" +
      "<div class='bar__track'><div class='bar__fill " + cls + "' data-w='" + (value / max * 100).toFixed(2) + "'></div></div></div>";
  }

  function renderCalc(i) {
    var p = P[i];
    var max = p.avulsoEq;
    var bars =
      bar(p.consultas + " consultas avulsas (" + brl(AV) + " cada)", p.avulsoEq, max, "bar__fill--avulso") +
      bar("Programa " + p.nome + " (" + brl(p.porConsultaExibido) + " por consulta)", p.valor, max, "bar__fill--prog") +
      (p.renovacao ? bar("Renovação do " + p.nome + " no 2º ano, com " + p.descontoRenovacao + "% de desconto", p.renovacao, max, "bar__fill--renov") : "");

    var rows =
      "<li><span>Valor por consulta</span><b>" + brl(p.porConsultaExibido) + " <small class='muted'>vs " + brl(AV) + "</small></b></li>" +
      "<li><span>Economia por consulta</span><b>" + brl(p.economiaPorConsulta) + " (" + pct(p.economiaPct) + ")</b></li>" +
      "<li><span>Telemonitoramento</span><b>" + p.telemonitoramentoMeses + " meses incluso</b></li>" +
      (p.prioridade ? "<li><span>Agenda</span><b>Prioridade · até 2 dias úteis</b></li>" : "") +
      (p.renovacao ? "<li><span>Renovação (2º ano)</span><b>" + brl(p.renovacao) + " · " + brl(p.renovPorConsulta) + "/consulta</b></li>" : "");

    body.innerHTML =
      "<div class='bars'>" + bars +
        "<p class='saving__plus'>+ " + p.telemonitoramentoMeses + " meses de telemonitoramento com a equipe, " +
        "um benefício que a consulta avulsa não oferece.</p></div>" +
      "<div class='saving'><div><p class='eyebrow' style='margin-bottom:8px'>Economia no programa</p>" +
        "<div class='saving__big'>" + brl(p.economia) + "<small>em " + p.meses + " meses</small></div></div>" +
        "<ul>" + rows + "</ul>" +
        "<a class='btn " + (p.destaque ? "btn--gold" : "btn--green") + " btn--block' target='_blank' rel='noopener' href='" +
          wa(msgPrograma(p)) + "'><span class='i-wa' aria-hidden='true'></span>Aderir ao " + esc(p.nome) + "</a>" +
      "</div>";
    body.setAttribute("aria-labelledby", "tab-" + p.id);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.querySelectorAll(".bar__fill").forEach(function (f) { f.style.width = f.getAttribute("data-w") + "%"; });
      });
    });
  }

  function selectTab(i, focus) {
    tabs.querySelectorAll(".calc__tab").forEach(function (t, j) {
      t.setAttribute("aria-selected", j === i ? "true" : "false");
      t.setAttribute("tabindex", j === i ? "0" : "-1");
      if (j === i && focus) t.focus();
    });
    renderCalc(i);
  }
  tabs.addEventListener("click", function (e) {
    var t = e.target.closest(".calc__tab");
    if (t) selectTab(+t.getAttribute("data-i"));
  });
  tabs.addEventListener("keydown", function (e) {
    var cur = +document.activeElement.getAttribute("data-i");
    if (isNaN(cur)) return;
    if (e.key === "ArrowRight") { selectTab((cur + 1) % P.length, true); e.preventDefault(); }
    if (e.key === "ArrowLeft")  { selectTab((cur - 1 + P.length) % P.length, true); e.preventDefault(); }
  });
  selectTab(0);

  /* ---------- TELEMONITORAMENTO ---------- */
  var T = C.telemonitoramento;
  $("teleCanal").textContent = T.canal;
  $("teleHorario").textContent = T.dias.join(" · ") + " · " + T.horario;
  $("teleObs").textContent = T.observacao;
  $("weekGrid").innerHTML = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(function (d) {
    var on = T.dias.indexOf(d) > -1;
    return "<div class='day" + (on ? " day--on" : "") + "'" + (on ? " title='" + esc(T.horario) + "'" : "") +
      "><b>" + d + "</b><i></i></div>";
  }).join("");

  /* ---------- TABELA ---------- */
  var cols = P.concat([{ id: "avulsa", nome: "Consulta avulsa", avulsa: true }]);
  function cell(p, v, cls) {
    return "<td class='" + (p.destaque ? "col-feat " : "") + (cls || "") + "'>" + v + "</td>";
  }
  function row(label, fn) {
    return "<tr><th scope='row'>" + label + "</th>" + cols.map(function (p) {
      var r = fn(p); return cell(p, r[0], r[1]);
    }).join("") + "</tr>";
  }
  var YES = ["✓", "yes"], NO = ["Não", "no"];
  $("cmpTable").innerHTML =
    "<thead><tr><td></td>" + cols.map(function (p) {
      return "<th scope='col' class='" + (p.destaque ? "col-feat" : "") + "'>" + esc(p.nome) + "</th>";
    }).join("") + "</tr></thead><tbody>" +
    row("Investimento", function (p) { return [p.avulsa ? brl(AV) + " / consulta" : brl(p.valor)]; }) +
    row("Duração", function (p) { return [p.avulsa ? "Consulta única" : p.meses + " meses"]; }) +
    row("Consultas online", function (p) { return [p.avulsa ? "1" : String(p.consultas)]; }) +
    row("Valor por consulta", function (p) { return [brl(p.avulsa ? AV : p.porConsultaExibido), "hl"]; }) +
    row("Economia vs. avulsa", function (p) { return p.avulsa ? ["Sem desconto", "no"] : [brl(p.economia) + " (" + pct(p.economiaPct) + ")"]; }) +
    row("Telemonitoramento", function (p) { return p.avulsa ? ["Não incluso", "no"] : [p.telemonitoramentoMeses + " meses", "yes"]; }) +
    row("Prioridade na agenda (até 2 dias úteis)", function (p) { return p.prioridade ? YES : NO; }) +
    row("Desconto na renovação", function (p) { return p.descontoRenovacao ? [p.descontoRenovacao + "%", "yes"] : NO; }) +
    "</tbody>";

  /* ---------- PAGAMENTO / CANCELAMENTO ---------- */
  var pg = C.pagamento;
  $("payList").innerHTML =
    "<li><span class='pay__ic'>PIX</span><div><b>" + esc(pg.pix) + "</b><span>Pagamento imediato, sem acréscimo.</span></div></li>" +
    "<li><span class='pay__ic'>BOL</span><div><b>" + esc(pg.boleto.texto) + "</b><span>Parcelas iguais, sem juros.</span></div></li>" +
    "<li><span class='pay__ic'>CC</span><div><b>Cartão de crédito</b><span>" + esc(pg.cartao.texto.replace(/^Cartão de crédito\s*/i, "")) + ".</span></div></li>";
  $("sealDias").textContent = C.cancelamento.dias;
  $("cancelDias").textContent = C.cancelamento.dias;
  $("cancelTexto").textContent = C.cancelamento.texto;

  /* ---------- FAQ ---------- */
  var NOMES = { Seg: "segundas", Ter: "terças", Qua: "quartas", Qui: "quintas", Sex: "sextas", "Sáb": "sábados", Dom: "domingos" };
  var diasExtenso = "às " + T.dias.map(function (d) { return NOMES[d] || d; }).join(", ").replace(/, ([^,]*)$/, " e $1");
  var intensivo = P.find(function (p) { return p.descontoRenovacao; });
  var faq = [
    ["Preciso fazer a primeira consulta antes de aderir a um programa?",
      "Sim. A primeira consulta (" + pc.modalidade.toLowerCase() + ", " + pc.duracao + ", " + brl(pc.valor) +
      ") não faz parte dos programas. É nela que o médico avalia o seu caso e define o tratamento. A escolha do programa acontece no retorno."],
    ["As consultas são presenciais ou online?",
      "Todas as consultas dos programas são online. Você é atendido de onde estiver."],
    ["Como funciona o telemonitoramento?",
      "É um canal de " + T.canal + ", disponível " + diasExtenso + ", das " + T.horario +
      ". A farmacêutica acompanha sua evolução, orienta ajustes e mantém o médico informado. " + T.observacao],
    ["Meus familiares ou cuidadores podem participar?",
      "Sim. O telemonitoramento foi pensado para manter a comunicação entre o médico, o paciente e seus cuidadores, facilitando o ajuste e a adaptação das doses."],
    (function () {
      var co = P.find(function (p) { return p.id === "completo"; });
      var ba = P.find(function (p) { return p.id === "basico"; });
      if (!co || !ba) return null;
      return ["Qual a diferença entre o Completo e o Básico?",
        "O Completo tem " + co.consultas + " consultas e " + co.telemonitoramentoMeses + " meses de telemonitoramento, contra " +
        ba.consultas + " consultas e " + ba.telemonitoramentoMeses + " meses no Básico. Além disso, o valor por consulta é menor: " +
        brl(co.porConsultaExibido) + " no Completo e " + brl(ba.porConsultaExibido) + " no Básico."];
    })(),
    ["Até quando posso usar as consultas do programa?",
      "Todas as consultas precisam acontecer dentro do período do programa: 12 meses no Intensivo e no Completo, 6 meses no Básico."],
    ["O que é a prioridade na agenda do Intensivo?",
      "Pacientes do Intensivo são atendidos em até 2 dias úteis quando precisam de uma consulta."],
    ["Existe desconto na renovação?",
      intensivo ? "No Intensivo, sim: " + intensivo.descontoRenovacao + "% de desconto no ano seguinte (" + brl(intensivo.renovacao) +
        ", ou " + brl(intensivo.renovPorConsulta) + " por consulta). Os programas Completo e Básico são renovados pelo valor vigente." :
        "Os programas são renovados pelo valor vigente."],
    ["Posso cancelar?",
      "Sim. " + C.cancelamento.texto],
    ["Quais as formas de pagamento?",
      pg.pix + "; " + pg.boleto.texto.toLowerCase() + "; " + pg.cartao.texto.toLowerCase() + "."]
  ];
  $("faq").innerHTML = faq.filter(Boolean).map(function (f) {
    return "<details class='reveal'><summary>" + esc(f[0]) + "</summary><div class='ans'>" + esc(f[1]) + "</div></details>";
  }).join("");

  /* ---------- RODAPÉ ---------- */
  $("fNome").textContent = C.clinica.nome;
  $("fLinha").innerHTML = esc(C.clinica.cidade) + " · Responsável técnico: " + esc(C.clinica.medico) + ", " + esc(C.clinica.crm) +
    "<br>CNPJ " + esc(C.clinica.cnpj) + " · WhatsApp " + esc(C.clinica.whatsappExibicao);

  /* ---------- animação de entrada ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }
})();
