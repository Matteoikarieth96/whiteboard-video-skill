// SEC Innovation Exemption explainer: features, chains, DeFi (Uniswap v4, Aave v4).
function eth(cx, cy, s) {
  const Q = (x, y) => [cx + x * s, cy + y * s];
  return poly([Q(0, -1), Q(-.62, .05), Q(0, .34), Q(.62, .05)], true, 1.5) +
         poly([Q(-.62, .2), Q(0, 1.02), Q(.62, .2), Q(0, .5)], true, 1.5);
}
function sol(cx, cy) {
  let d = '';
  for (const dy of [-65, 0, 65]) d += poly([[cx - 70, cy + dy - 18], [cx + 90, cy + dy - 18], [cx + 70, cy + dy + 18], [cx - 90, cy + dy + 18]], true, 1);
  return d;
}
const pool = (cx, cy, r) => arc(cx, cy - 80, r, 15, 165) + wave(cx - r * .9, cx + r * .9, cy - 70, 6, 70) +
  circ(cx - 55, cy + 20, 30) + circ(cx + 50, cy + 30, 30);
const wallet = (x, y) => rect(x, y, 150, 90, 2) + rect(x + 105, y + 30, 45, 30, 1);

window.SCENES = {
  intro(A) {
    P(icon.building(360, 560, 320), A(0, .05), .9);
    T('SEC', 360, 405, 50, A(0, .26), .3);
    const b = T('Innovation Exemption', 600, 470, 120, A(0, .35), .9, { anchor: 'start' });
    P(wave(b.x + 10, b.x + b.width - 10, 505, 7, 110), A(0, .58), .3, { c: GOLD, w: 9 });
    T('17 Sep 2026 · tokenized US stocks', 600, 600, 60, A(0, .7), .5, { anchor: 'start', c: GRAY });
    T('what it allows · who wins', 600, 740, 70, A(1, 0), .7, { anchor: 'start', c: GOLD });
  },
  what(A) {
    P(icon.coin(300, 430, 70), A(0, .3), .4, { fill: GOLD, fillOp: .45 });
    T('AAPL', 300, 444, 38, A(0, .3) + .4, .2);
    T('tokenized stock', 300, 580, 52, A(0, .38), .4);
    P(arrow(400, 430, 560, 430), A(0, .5), .3);
    P(pool(760, 500, 170), A(0, .58), .7, { c: BLUE, fill: BLUE, fillOp: .15 });
    T('AMM pool', 760, 665, 60, A(0, .78), .4, { c: BLUE });
    P(icon.building(1350, 480, 300), A(1, 0), .6);
    P(line(1180, 270, 1520, 600, 2) + line(1520, 270, 1180, 600, 2), A(1, .55), .35, { c: RED, w: 11 });
    T('no exchange registration', 1350, 660, 54, A(1, .75), .4, { c: RED });
    T('5 years · until 2031', 960, 830, 90, A(2, .05), .8, { c: GOLD });
  },
  rules(A) {
    T('The rules', 960, 160, 110, A(0, 0), .6);
    const x = 470, tx = 540;
    P(icon.tick(x, 300, 38), A(1, 0), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('same rights as the real share: dividends, votes', tx, 318, 58, A(1, .08), .8, { anchor: 'start' });
    P(icon.cross(x, 425, 38), A(1, .72), .35, { c: RED, fill: RED, fillOp: .12 });
    T('no synthetic tokens', tx, 443, 58, A(1, .8), .5, { anchor: 'start', c: RED });
    P(icon.bubble(x, 540, 100, 64), A(2, 0), .35, { c: RED, fill: RED, fillOp: .1 });
    T('no', x, 552, 40, A(2, 0) + .35, .15, { c: RED });
    T('companies can block third-party tokens', tx, 568, 58, A(2, .25), .7, { anchor: 'start' });
    P(icon.clock(470, 675, 36), A(3, 0), .45, { fill: GOLD, fillOp: .25 });
    T('capped volume · halts · no margin', tx, 693, 58, A(3, .12), .9, { anchor: 'start' });
    P(icon.person(470, 805, .55), A(4, 0), .5, { c: BLUE });
    T('US retail can join, with verified wallets', tx, 818, 58, A(4, .15), .8, { anchor: 'start', c: BLUE });
  },
  chains(A) {
    T('Which blockchains?', 960, 150, 110, A(0, 0), .7);
    P(rect(400, 225, 1120, 120, 2), A(1, .05), .6, { fill: GOLD, fillOp: .2 });
    T('anyone can read & write, no permission', 960, 305, 56, A(1, .2), .9);
    T('public, auditable code', 960, 410, 50, A(1, .6), .6, { c: GRAY });
    P(eth(560, 600, 95), A(2, 0), .45, { c: BLUE, fill: BLUE, fillOp: .2 });
    T('Ethereum', 560, 780, 60, A(2, 0) + .45, .25);
    P(sol(960, 600), A(2, .38), .45, { c: INK, fill: GREEN, fillOp: .25 });
    T('Solana', 960, 780, 60, A(2, .38) + .45, .25);
    P(icon.tick(680, 500, 32) + icon.tick(1090, 500, 32), A(2, .75), .3, { c: GREEN, fill: GREEN, fillOp: .15 });
    P(rect(1290, 520, 160, 50, 1.5) + rect(1290, 580, 160, 50, 1.5) + rect(1290, 640, 160, 50, 1.5), A(3, 0), .5);
    T('Layer 2s', 1370, 780, 60, A(3, .15), .35);
    T('?', 1520, 600, 130, A(3, .3), .3, { c: GOLD });
    T('not named: each venue argues its case', 1370, 850, 44, A(3, .5), .6, { c: GRAY });
  },
  permissioned(A) {
    T('Permissioned chains: the grey zone', 960, 150, 96, A(0, 0), .9);
    P(line(960, 260, 960, 860, 2), A(0, .5), .4, { c: '#c9c7bf', w: 4 });
    T('Tempo', 560, 300, 80, A(1, 0), .4);
    let ring = '', nodes = [];
    for (let i = 0; i < 5; i++) { const a = (-90 + i * 72) * Math.PI / 180; nodes.push([560 + 130 * Math.cos(a), 510 + 130 * Math.sin(a)]); }
    nodes.forEach(([x, y]) => ring += circ(x, y, 28));
    ring += poly(nodes, true, 2);
    P(ring, A(1, .12), .8, { fill: GOLD, fillOp: .3 });
    T('anyone can deploy', 560, 720, 54, A(1, .28), .45, { c: GREEN });
    T('hand-picked validators', 560, 790, 54, A(1, .48), .5);
    T('?', 800, 420, 140, A(1, .68), .3, { c: GOLD });
    P(rect(1230, 400, 260, 240, 2) + circ(1360, 520, 60) + line(1360, 520, 1392, 488, 1), A(2, 0), .5);
    T('private bank ledgers', 1360, 720, 54, A(2, .2), .45);
    P(line(1200, 380, 1520, 660, 2) + line(1520, 380, 1200, 660, 2), A(2, .45), .3, { c: RED, w: 11 });
    T('out', 1360, 800, 70, A(2, .62), .25, { c: RED });
  },
  uniswap(A) {
    T('DeFi winner: the AMM', 960, 150, 104, A(0, 0), .8);
    P(pool(960, 500, 220), A(0, .35), .7, { c: BLUE, fill: BLUE, fillOp: .15 });
    T('Uniswap v4', 960, 700, 64, A(0, .65), .4, { c: BLUE });
    P(rect(300, 340, 200, 260, 2) + rect(360, 318, 80, 40, 1) +
      poly([[330, 410], [345, 425], [370, 395]], false, 1) + line(385, 410, 470, 410, 1) +
      poly([[330, 470], [345, 485], [370, 455]], false, 1) + line(385, 470, 470, 470, 1) +
      poly([[330, 530], [345, 545], [370, 515]], false, 1) + line(385, 530, 470, 530, 1), A(1, 0), .6);
    T('allowlist', 400, 660, 58, A(1, .12), .4);
    P(arrow(510, 470, 720, 470), A(1, .3), .3);
    P(wallet(1430, 370) + arrow(1420, 415, 1200, 455) + icon.tick(1610, 360, 26), A(1, .5), .5, { c: GREEN, fill: GREEN, fillOp: .12 });
    T('approved', 1505, 500, 46, A(1, .6), .3, { c: GREEN });
    P(wallet(1430, 560) + line(1420, 600, 1260, 565, 3) + icon.cross(1610, 550, 26), A(1, .72), .5, { c: RED, fill: RED, fillOp: .1 });
    T('blocked', 1505, 690, 46, A(1, .82), .3, { c: RED });
    T('UNI ≈ +30%', 560, 840, 76, A(2, 0), .6, { c: GREEN });
    T('needs a regulated US operator', 1330, 840, 56, A(2, .45), .7);
  },
  aave(A) {
    T('Lending: a different story', 960, 150, 100, A(0, 0), .8);
    P(icon.coin(330, 480, 60), A(1, 0), .4, { fill: GOLD, fillOp: .45 });
    P(arrow(410, 480, 560, 480) + circ(640, 480, 60), A(1, .12), .5, { fill: GREEN, fillOp: .15 });
    T('$', 640, 502, 64, A(1, .12) + .5, .2, { c: GREEN });
    P(line(240, 360, 740, 610, 2) + line(740, 360, 240, 610, 2), A(1, .3), .35, { c: RED, w: 11 });
    T('exemption: no lending, no credit', 480, 700, 52, A(1, .4), .8, { c: RED });
    T('Aave not covered', 480, 780, 52, A(1, .78), .5);
    P(line(960, 260, 960, 860, 2), A(2, 0), .3, { c: '#c9c7bf', w: 4 });
    T('Aave v4 · Equities Hub · Base', 1440, 290, 58, A(2, .08), .7);
    P(circ(1440, 520, 70) + line(1375, 490, 1290, 445, 1) + line(1375, 550, 1290, 595, 1) + line(1505, 490, 1590, 445, 1) +
      arrow(1505, 550, 1585, 595) + circ(1250, 430, 40) + circ(1250, 610, 40) + circ(1630, 430, 40), A(2, .35), .7, { fill: GOLD, fillOp: .3 });
    T('Hub', 1440, 538, 48, A(2, .35) + .7, .2);
    T('tokenized stocks → USDC loans', 1440, 760, 52, A(2, .6), .6);
    T('non-US users only', 1440, 840, 52, A(2, .82), .45, { c: RED });
  },
  outro(A) {
    [['open chains', 400, 0], ['real shareholder rights', 960, .3], ['permissioned access', 1520, .68]].forEach(([lab, x, fr]) => {
      P(icon.tick(x, 400, 55), A(0, fr), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
      T(lab, x, 560, 64, A(0, fr) + .35, .45);
    });
    T('SEC Innovation Exemption · until 2031', 960, 760, 72, A(1, .1), .9, { c: BLUE });
  }
};
