const CONTACT = { principal: ['946 512 369', '921 840 779'], site: ['930 267 761'] };
const digits = n => '244' + n.replace(/\s/g, '');
const wantsSite = list => list.length > 0 && list.every(i => i.k === 'site');
const waNum = list => (wantsSite(list) ? CONTACT.site[0] : CONTACT.principal[0]);
const numsFor = k => (k === 'site' ? CONTACT.site : CONTACT.principal);
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const kz = n => fmt(n) + ' Kz';

const SERV = {
  perfil: { tab: 'Estruturação de Perfil', sub: 'WhatsApp e Instagram que vendem', plans: [
    { id: 'start', n: 'START', price: 45000, tag: 'Para começar', items: [
      'Análise do perfil atual', 'Nova Bio que vende', 'Nova foto de perfil',
      '3 destaques organizados (Sobre, Serviços, Depoimentos)', '6 posts de posicionamento (design + legenda)',
      'Link do WhatsApp otimizado', '1 revisão'] },
    { id: 'pro', n: 'PRO', price: 75000, tag: 'Mais completo', badge: 'Destaque', items: [
      ['Tudo do START +'], '9 posts de posicionamento (em vez de 6)',
      '5 destaques completos (Sobre, Serviços, Depoimentos, Preços, Como Comprar)',
      'Catálogo / Portfólio organizado no WhatsApp e Instagram',
      'Roteiro de atendimento no WhatsApp (o que responder quando o cliente chega)',
      '1 vídeo curto de apresentação (roteiro + edição simples)', '2 revisões'] },
    { id: 'premium', n: 'PREMIUM', price: 120000, tag: 'Solução total', items: [
      ['Tudo do PRO +'], '12 posts de posicionamento', 'Identidade visual mini (cores, fontes, modelo de post)',
      'Página de vendas simples / LinkTree profissional', '3 vídeos de venda (roteiro + edição)',
      'Estratégia de conteúdo de 30 dias (o que postar para vender)', 'Acompanhamento de 14 dias depois da entrega', '3 revisões'] }
  ]},
  site: { tab: 'Site e Segurança', sub: 'Site, automação e sistemas', plans: [
    { id: 'start', n: 'START', price: 35000, tag: 'Para começar', items: [
      'Menu digital', 'Site simples', 'Automação', 'Análise do perfil atual', 'Nova bio que vende', 'Link do WhatsApp otimizado'] },
    { id: 'pro', n: 'PRO', price: 75000, tag: 'Mais funcionalidades', badge: 'Destaque', items: [
      'Site profissional', 'Menu digital com automação de vendas', 'Automação com IA', 'Identidade visual mini (cores, fontes, modelo de post)', 'Página de vendas simples / LinkTree profissional', 'Acompanhamento de 14 dias depois da entrega'] },
    { id: 'premium', n: 'PREMIUM', price: 120000, tag: 'Solução completa', items: [
      'Análise de dados', 'Instalação de software de segurança', 'Criação de sites e ferramentas', 'Manutenção de sistemas e hardware'] }
  ]},
  links: { tab: 'Links Patrocinados', sub: 'Alcance rápido, por dias' }
};
// dias, alcance mín., alcance máx., preço
const LINKS = [
  [1, 2400, 5000, 1500], [2, 5700, 13000, 2400], [3, 6300, 17300, 4300], [4, 7000, 21300, 5800],
  [5, 8000, 25000, 8000], [6, 11000, 29000, 10000], [7, 13400, 37000, 11900], [8, 17000, 65000, 13700],
  [15, 89100, 137000, 24000], [30, 136200, 184000, 51900]
];
const MAXREACH = 184000;
const mil = n => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' mil' : String(n));

const sel = { perfil: null, site: null, links: null };
let tab = 'perfil', open = false, dayIdx = 6, A = { goal: null, level: null };
const $ = id => document.getElementById(id);

function renderTabs() {
  $('tabs').innerHTML = Object.entries(SERV).map(([k, s]) =>
    `<button class="tab" role="tab" aria-selected="${k === tab}" data-act="tab" data-k="${k}"><b>${s.tab}</b><span>${s.sub}</span></button>`).join('');
}
function planHTML(k, p) {
  const li = p.items.map(i => Array.isArray(i) ? `<li class="inc">${i[0]}</li>` : `<li>${i}</li>`).join('');
  const on = sel[k] === p.id;
  return `<article class="plan ${p.id === 'pro' ? 'pro' : ''} ${on ? 'on' : ''}">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
    <span class="tagline">${p.tag}</span><h3>${p.n}</h3>
    <div class="price">${fmt(p.price)}<small>Kz</small></div>
    <ul>${li}</ul>
    <button class="pick" data-act="pick" data-k="${k}" data-id="${p.id}">${on ? 'No orçamento ✓' : 'Adicionar ao orçamento'}</button>
  </article>`;
}
function linksHTML() {
  const i = dayIdx, [d, lo, hi, pr] = LINKS[i];
  const left = (lo / MAXREACH * 100).toFixed(1), w = ((hi - lo) / MAXREACH * 100).toFixed(1);
  const on = sel.links !== null;
  return `<div class="links">
    <div class="panel"><h3>Quantos dias quer divulgar?</h3>
      <div class="days">${LINKS.map((l, j) => `<button class="day" aria-pressed="${j === i}" data-act="day" data-i="${j}"><b>${l[0]}</b><span>${l[0] === 1 ? 'dia' : 'dias'}</span></button>`).join('')}</div>
      <div class="reach"><div class="lab"><span>Alcance estimado</span><span>até ${mil(MAXREACH)} em 30 dias</span></div>
        <div class="track"><div class="fill" style="left:${left}%;width:${w}%"></div></div></div>
      <p class="note">O alcance é uma estimativa e varia conforme o público e o anúncio.</p></div>
    <div class="panel"><span class="tagline" style="font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:700">Pacote de ${d} ${d === 1 ? 'dia' : 'dias'}</span>
      <div class="big">${mil(lo)} a ${mil(hi)}</div><p class="note" style="margin-top:2px">pessoas alcançadas</p>
      <div class="price" style="margin-top:18px">${fmt(pr)}<small>Kz</small></div>
      <button class="pick" style="margin-top:16px;${on ? 'background:var(--yellow);color:var(--ink)' : ''}" data-act="pickLinks">${on ? 'No orçamento ✓ (toque para tirar)' : 'Adicionar ao orçamento'}</button></div>
  </div>`;
}
function renderPanel() {
  $('panel').innerHTML = tab === 'links' ? linksHTML() :
    `<div class="plans">${SERV[tab].plans.map(p => planHTML(tab, p)).join('')}</div>`;
}
function items() {
  const out = [];
  for (const k of ['perfil', 'site']) if (sel[k]) {
    const p = SERV[k].plans.find(x => x.id === sel[k]); out.push({ k, t: `${SERV[k].tab}: ${p.n}`, s: '', price: p.price });
  }
  if (sel.links !== null) { const [d, , , pr] = LINKS[sel.links]; out.push({ k: 'links', t: `Links Patrocinados: ${d} ${d === 1 ? 'dia' : 'dias'}`, s: '', price: pr }); }
  return out;
}
function message(list, total) {
  return 'Olá NetGrow Business! Gostaria de pedir um orçamento:\n' + list.map(i => `- ${i.t} (${kz(i.price)})`).join('\n') + `\nTotal: ${kz(total)}`;
}
function renderQuote() {
  const list = items(), total = list.reduce((a, b) => a + b.price, 0);
  const msg = message(list, total);
  const panel = open ? `<div class="qpanel"><h3>O seu orçamento</h3>
    ${list.length ? list.map(i => `<div class="line"><div>${i.t}</div><b>${kz(i.price)}</b><button class="rm" aria-label="Remover ${i.t}" data-act="rm" data-k="${i.k}">✕</button></div>`).join('') +
      `<div class="line"><div><b>Total</b></div><b>${kz(total)}</b></div>
       <div class="qactions"><a class="btn btn-y" target="_blank" rel="noopener" href="https://wa.me/${digits(waNum(list))}?text=${encodeURIComponent(msg)}">Enviar pelo WhatsApp</a>
       <button class="btn btn-o" data-act="copy">Copiar mensagem</button></div>
       <p class="note">Se o WhatsApp não abrir, copie a mensagem e envie para +244 ${waNum(list)}.</p>`
      : '<p class="empty">Ainda não escolheu nada. Abra um serviço acima e toque em "Adicionar ao orçamento".</p>'}
    </div>` : '';
  $('quote').innerHTML = panel + `<div class="qbar"><button class="sum" data-act="toggle" aria-expanded="${open}"><span>${list.length ? list.length + (list.length === 1 ? ' serviço no orçamento' : ' serviços no orçamento') : 'O seu orçamento'}</span><b>${list.length ? kz(total) : '0 Kz'}</b></button>
    <button class="btn" data-act="toggle">${open ? 'Fechar' : 'Ver orçamento'}</button></div>`;
  $('quote')._msg = msg;
}

const ASK = {
  perfil: { sub: 'Para o seu perfil de WhatsApp e Instagram',
    q1: ['Como está o seu perfil hoje?', [['novo', 'Ainda não tenho perfil de negócio'], ['fraco', 'Tenho, mas não vende'], ['forte', 'Vende, quero crescer mais']]],
    q2: ['Quanto conteúdo precisa?', [['start', 'Começar com o essencial'], ['pro', 'Posts, destaques e catálogo completos'], ['premium', 'Tudo, com vídeos e estratégia de 30 dias']]] },
  site: { sub: 'Para quem quer site, menu digital ou segurança',
    q1: ['O que quer resolver?', [['site', 'Ter um site ou menu digital'], ['auto', 'Automatizar vendas e atendimento, inclusive com IA'], ['dados', 'Analisar dados e proteger os meus sistemas']]],
    q2: ['Qual o tamanho do negócio?', [['start', 'Pequeno, a começar'], ['pro', 'Médio, com mais clientes e pedidos'], ['premium', 'Empresa completa, com sistemas e equipamentos']]] },
  links: { sub: 'Para divulgar com links patrocinados',
    q1: ['O que vai divulgar?', [['promo', 'Uma promoção ou evento'], ['prod', 'Um produto ou serviço novo'], ['marca', 'A minha marca durante o mês']]],
    q2: ['Durante quanto tempo?', [['3', 'Até 3 dias'], ['7', 'Cerca de uma semana'], ['30', 'O mês todo']]] }
};
const WHY = {
  perfil: { start: 'Bio, foto, destaques e 6 posts para arrumar o perfil.', pro: 'Mais posts, catálogo organizado e roteiro de atendimento no WhatsApp.', premium: 'Identidade visual, vídeos de venda e 30 dias de estratégia de conteúdo.' },
  site: { start: 'Menu digital, site simples e automação para começar.', pro: 'Site profissional, menu digital com automação de vendas e automação com IA.', premium: 'Análise de dados, software de segurança, criação de ferramentas e manutenção de sistemas e hardware.' }
};
function renderAssist() {
  const el = $('assist'), c = ASK[tab], step = !A.goal ? 1 : !A.level ? 2 : 3;
  $('asub').textContent = c.sub + '. Duas perguntas e o assistente indica o pacote.';
  const dots = `<div class="steps"><i class="on"></i><i class="${step > 1 ? 'on' : ''}"></i><i class="${step > 2 ? 'on' : ''}"></i></div>`;
  const opts = (act, arr) => arr.map(([v, t]) => `<button class="opt" data-act="${act}" data-v="${v}">${t}</button>`).join('');
  if (step === 1) el.innerHTML = dots + `<div class="q">${c.q1[0]}</div><div class="opts">${opts('goal', c.q1[1])}</div>`;
  else if (step === 2) el.innerHTML = dots + `<div class="q">${c.q2[0]}</div><div class="opts">${opts('level', c.q2[1])}</div>`;
  else {
    let title, price, act, why;
    if (tab === 'links') {
      const idx = { '3': 2, '7': 6, '30': 9 }[A.level], [d, lo, hi, pr] = LINKS[idx];
      title = `Links Patrocinados: ${d} dias`; price = pr; act = `data-act="recLinks" data-i="${idx}"`;
      why = `Alcance estimado de ${mil(lo)} a ${mil(hi)} pessoas.`;
    } else {
      let l = A.level; why = WHY[tab][l];
      if (tab === 'site' && A.goal === 'dados' && l !== 'premium') { l = 'premium'; why = 'Análise de dados e instalação de software de segurança estão no pacote Premium.'; }
      else if (tab === 'site' && A.goal === 'auto' && l === 'start') { l = 'pro'; why = 'A automação com IA e a automação de vendas começam no pacote Pro.'; }
      const p = SERV[tab].plans.find(x => x.id === l);
      title = `${SERV[tab].tab}: ${p.n}`; price = p.price; act = `data-act="pick" data-k="${tab}" data-id="${l}"`;
    }
    el.innerHTML = dots + `<div class="result"><span class="eyebrow">Recomendado</span><h3 style="margin-top:6px">${title}</h3>
      <p>${why}</p>
      <div class="price" style="margin-bottom:14px">${fmt(price)}<small>Kz</small></div>
      <button class="btn btn-y" ${act}>Adicionar ao orçamento</button><button class="linkbtn" data-act="reset">Refazer</button></div>`;
  }
}
const INTEREST = { perfil: 'Estruturação de Perfil', links: 'Links Patrocinados', site: 'Site e Segurança' };
function renderContact() {
  const msg = `Olá NetGrow Business! Tenho interesse nos vossos serviços de ${INTEREST[tab]}. Podem dar-me mais informações?`;
  $('nums').innerHTML = numsFor(tab).map(n => `<a target="_blank" rel="noopener" href="https://wa.me/${digits(n)}?text=${encodeURIComponent(msg)}">+244 ${n} <span aria-hidden="true">↗</span></a>`).join('');
}
function toast(t) { const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => e.hidden = true, 1800); }

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'tab') { tab = b.dataset.k; A = { goal: null, level: null }; renderTabs(); renderPanel(); renderAssist(); renderContact(); }
  else if (a === 'pick') {
    const k = b.dataset.k, id = b.dataset.id; sel[k] = sel[k] === id ? null : id;
    if (b.closest('#assist')) { tab = k; renderTabs(); }
    renderPanel(); renderQuote(); toast(sel[k] ? 'Adicionado ao orçamento' : 'Removido do orçamento');
  }
  else if (a === 'day') { dayIdx = +b.dataset.i; if (sel.links !== null) sel.links = dayIdx; renderPanel(); renderQuote(); }
  else if (a === 'pickLinks') { sel.links = sel.links === null ? dayIdx : null; renderPanel(); renderQuote(); }
  else if (a === 'recLinks') { dayIdx = sel.links = +b.dataset.i; tab = 'links'; renderTabs(); renderPanel(); renderQuote(); toast('Adicionado ao orçamento'); }
  else if (a === 'rm') { sel[b.dataset.k] = null; renderPanel(); renderQuote(); }
  else if (a === 'toggle') { open = !open; renderQuote(); }
  else if (a === 'copy') {
    const m = $('quote')._msg;
    (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(() => toast('Mensagem copiada'), () => toast('Selecione e copie o texto manualmente'));
  }
  else if (a === 'goal') { A.goal = b.dataset.v; renderAssist(); }
  else if (a === 'level') { A.level = b.dataset.v; renderAssist(); }
  else if (a === 'reset') { A = { goal: null, level: null }; renderAssist(); }
});
renderTabs(); renderPanel(); renderQuote(); renderAssist(); renderContact();
