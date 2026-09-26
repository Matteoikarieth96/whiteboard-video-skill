// Example: "RWA on Ethereum" (real-world asset tokenization), 9 scenes, ~2 minutes.
// Topic-specific helper: the Ethereum logo, drawn as two hand-drawn diamonds.
function eth(cx, cy, s) {
  const P = (x, y) => [cx + x * s, cy + y * s];
  return {
    out: poly([P(0, -1), P(-.62, .05), P(0, .34), P(.62, .05)], true, 1.5) +
         poly([P(-.62, .2), P(0, 1.02), P(.62, .2), P(0, .5)], true, 1.5),
    ridge: poly([P(-.62, .05), P(0, -.24), P(.62, .05)], false, 1) + line(...P(0, -1), ...P(0, .34), 1)
  };
}

window.SCENES = {
  intro(A) {
    const b = T('Real-World Assets', 960, 390, 170, A(0, 0), .8);
    P(wave(b.x + 20, b.x + b.width - 20, 440, 7, 110), A(0, .35), .25, { c: GOLD, w: 9 });
    const e = T('on Ethereum', 900, 600, 124, A(0, .47), .55, { c: BLUE });
    P(eth(e.x + e.width + 95, 555, 78).out, A(0, .72), .35, { c: BLUE, fill: BLUE, fillOp: .22 });
    T('explained', 960, 770, 70, A(0, .88), .28, { c: GRAY, weight: 600 });
  },
  kinds(A) {
    T('3 ways to tokenize', 960, 150, 104, A(0, 0), .75);
    P(line(660, 250, 660, 850, 2) + line(1260, 250, 1260, 850, 2), A(0, .5), .45, { c: '#c9c7bf', w: 4 });
    // 1: the asset itself
    T('the asset itself', 360, 290, 66, A(1, .05), .5);
    const d = eth(320, 490, 95);
    P(d.out, A(1, .2), .45, { c: BLUE, fill: BLUE, fillOp: .2 });
    P(circ(450, 545, 52), A(1, .36), .3, { fill: GOLD, fillOp: .45 });
    T('BUIDL', 450, 557, 34, A(1, .44), .25);
    T('BlackRock BUIDL fund', 360, 690, 50, A(1, .55), .45);
    T('you own: the asset', 360, 810, 50, A(1, .75), .45, { c: GREEN });
    // 2: a claim on it
    T('a claim on it', 960, 290, 66, A(2, .05), .45);
    P(rect(850, 420, 160, 160, 2) + circ(930, 500, 42) + line(930, 500, 952, 478, 1) + line(1010, 460, 1022, 460, 1) + line(1010, 540, 1022, 540, 1),
      A(2, .2), .5);
    T('custodian', 930, 630, 44, A(2, .3), .35, { c: GRAY });
    P(arrow(1030, 500, 1072, 500, 1) + circ(1118, 500, 42), A(2, .45), .4, { fill: GOLD, fillOp: .45 });
    T('Coinbase stocks on Base', 960, 690, 50, A(2, .62), .45);
    T('you own: a claim on it', 960, 810, 50, A(2, .8), .45, { c: GOLD });
    // 3: tracks the price
    T('tracks the price', 1560, 290, 66, A(3, .05), .45);
    P(poly([[1440, 380], [1440, 570], [1700, 570]], false, 1) + poly([[1455, 545], [1515, 485], [1565, 515], [1625, 445], [1660, 465]], false, 2),
      A(3, .35), .5, { c: RED });
    P(circ(1690, 440, 30), A(3, .35) + .5, .2, { fill: GOLD, fillOp: .45 });
    T('Robinhood stock tokens', 1560, 680, 50, A(4, .05), .45);
    T('debt security · backed 1:1', 1560, 735, 42, A(4, .3), .4, { c: GRAY });
    T('you own: a claim on Robinhood', 1560, 810, 48, A(4, .62), .5, { c: RED });
  },
  why(A) {
    T('Why bother?', 960, 200, 126, A(0, 0), .55);
    const y = 470, ly = 690;
    P(circ(330, y, 100) + line(330, y, 330, y - 70, 1) + line(330, y, 388, y + 32, 1), A(1, 0), .45);
    T('seconds, not days', 330, ly, 58, A(1, 0) + .5, .4);
    let rays = '';
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; rays += line(685 + 56 * Math.cos(a), 440 + 56 * Math.sin(a), 685 + 78 * Math.cos(a), 440 + 78 * Math.sin(a), 1); }
    P(circ(685, 440, 40) + rays, A(2, 0), .3, { c: GOLD, fill: GOLD, fillOp: .35 });
    P(arc(845, 510, 58, -120, 150) + arc(822, 493, 48, 150, -120, false), A(2, 0) + .3, .25, { c: BLUE, fill: BLUE, fillOp: .3 });
    T('open 24/7', 760, ly, 58, A(2, 0) + .6, .35);
    P(circ(1170, y, 100) + `M 1170 ${y} L 1170 ${y - 100} ` + arc(1170, y, 100, -90, -52, false) + ` L 1170 ${y}`, A(3, 0), .45, { fill: GOLD, fillOp: .5 });
    T('a slice of a share', 1170, ly, 58, A(3, 0) + .5, .38);
    P(circ(1590, y, 44) + circ(1590, y, 26, 26, -90, 365, .01) + line(1560, y - 34, 1500, y - 92, 1) +
      line(1620, y - 34, 1680, y - 92, 1) + line(1590, y + 44, 1590, y + 92, 1) +
      rect(1452, y - 142, 64, 50, 1) + rect(1664, y - 142, 64, 50, 1) + rect(1558, y + 92, 64, 50, 1), A(4, 0), .6, { fill: GOLD, fillOp: .2 });
    T('any app can plug in', 1590, ly, 58, A(4, .3), .45);
  },
  numbers(A) {
    P(poly([[300, 230], [300, 760], [900, 760]], false, 2), A(0, 0), .5);
    P(rect(640, 320, 170, 440, 2), A(0, .1), .7, { fill: GOLD, fillOp: .55 });
    T('$37B', 725, 290, 96, A(0, .25), .4);
    T('Aug 2026', 725, 825, 54, A(0, .35), .4, { c: GRAY });
    P(rect(400, 617, 170, 143, 2), A(0, .55), .35, { fill: GOLD, fillOp: .55 });
    T('$12B', 485, 595, 64, A(0, .62), .3);
    T('mid 2025', 485, 825, 54, A(0, .68), .4, { c: GRAY });
    P('M 485 545 Q 450 360 612 330 ' + head(480, 380, 612, 330), A(0, .78), .4, { c: RED, w: 6 });
    T('3x', 405, 330, 110, A(0, .88), .3, { c: RED });
    P(circ(1420, 470, 215), A(1, 0) - .05, .45);
    P(`M 1420 470 L 1420 255 ` + arc(1420, 470, 215, -90, -90 + .46 * 360, false) + ' L 1420 470', A(1, .28), .45, { c: BLUE, fill: BLUE, fillOp: .45 });
    T('Ethereum ≈ 46%', 1420, 790, 76, A(1, .55), .4, { c: BLUE });
  },
  forecast(A) {
    T('Where tokenized assets could go', 960, 150, 88, A(0, 0), .6);
    const x0 = 520, k = 1100 / 30, rows = [330, 470, 610, 750];
    T('Today', 490, rows[0] + 18, 58, A(0, .45), .3, { anchor: 'end' });
    P(circ(x0 + 6, rows[0], 8), A(0, .62), .15, { fill: INK, fillOp: 1 });
    T('$0.04T', x0 + 40, rows[0] + 18, 56, A(0, .72), .3, { anchor: 'start', c: GRAY });
    const bars = [['McKinsey · 2030', 4, '$2-4T', 0, BLUE], ['Citi · 2030', 5.5, '$5.5T', .4, BLUE], ['Std Chartered · 2034', 30, '$30T', .62, GOLD]];
    bars.forEach(([lab, v, val, fr, col], i) => {
      const y = rows[i + 1], w = v * k;
      T(lab, 490, y + 18, 58, A(1, fr), .35, { anchor: 'end' });
      P(rect(x0, y - 30, w, 60, 2), A(1, fr) + .38, i === 2 ? .6 : .3, { c: col, fill: col, fillOp: .35 });
      T(val, x0 + w + 30, y + 20, 64, A(1, fr) + (i === 2 ? 1.0 : .7), .3, { anchor: 'start' });
    });
  },
  defi(A) {
    P(circ(960, 500, 85) + circ(960, 500, 62, 62, -90, 365, .01), A(0, 0), .5, { fill: GOLD, fillOp: .4 });
    T('NVDA', 960, 514, 42, A(0, .25), .35);
    T('tokenized stock', 960, 640, 54, A(0, .45), .45, { c: GRAY });
    // borrow
    P(arrow(880, 450, 520, 300) + rect(270, 170, 180, 150, 2) + circ(360, 245, 38) + line(360, 245, 382, 223, 1), A(1, 0), .6);
    T('borrow USDC', 360, 395, 56, A(1, .35), .4);
    T('on Morpho', 360, 445, 46, A(1, .55), .3, { c: GRAY });
    // meme coins
    P(line(1040, 450, 1400, 300) + head(1040, 450, 1400, 300) + head(1400, 300, 1040, 450) +
      circ(1560, 250, 70) + poly([[1508, 212], [1500, 160], [1540, 190]], false, 1) + poly([[1580, 190], [1620, 160], [1612, 212]], false, 1) +
      circ(1535, 240, 7) + circ(1585, 240, 7) + circ(1560, 268, 9) + arc(1560, 275, 22, 20, 160),
      A(2, .05), .7, { c: INK, fill: GOLD, fillOp: .25 });
    T('meme coins vs stock tokens', 1560, 395, 50, A(2, .2), .5);
    T('≈ 80% of DEX volume (Jul)', 1560, 445, 44, A(2, .72), .45, { c: GRAY });
    // basket
    P(arrow(880, 560, 520, 690) + poly([[270, 690], [450, 690], [425, 790], [295, 790]], true, 2) +
      circ(315, 660, 26) + circ(360, 648, 26) + circ(405, 660, 26) + arc(205, 720, 42, -40, 250) + head(185.9, 685.6, 195.6, 680.5, 18),
      A(3, 0), .55, { fill: GOLD, fillOp: .25 });
    T('auto-rebalance', 360, 870, 56, A(3, .14), .4);
    // robot
    P(arrow(1040, 560, 1400, 690) + rect(1500, 620, 120, 88, 2) + circ(1532, 662, 12) + circ(1588, 662, 12) +
      line(1560, 620, 1560, 590, 1) + circ(1560, 582, 8) + rect(1490, 712, 140, 100, 2) +
      poly([[1505, 792], [1540, 762], [1570, 777], [1615, 732]], false, 1), A(3, .5), .6, { c: INK, fill: BLUE, fillOp: .12 });
    T('AI agents', 1560, 870, 56, A(3, .66), .35);
  },
  legal(A) {
    T('The catch: a legal marathon', 960, 150, 96, A(0, 0), .9, { c: RED });
    T('not a coding job', 960, 230, 56, A(0, .5), .5, { c: GRAY });
    const labs = ['legal wrapper', 'prospectus', 'licences', 'custodian', 'KYC, country by country'];
    labs.forEach((l, i) => {
      const y = 760 - 80 * (i + 1);
      P(rect(330, y, 520, 80, 2), A(1, .12 + .17 * i), .3, { fill: GOLD, fillOp: .12 + .06 * i });
      T(l, 590, y + 55, 50, A(1, .12 + .17 * i) + .3, .3);
    });
    P(rect(1180, 380, 340, 300, 2) + line(1180, 450, 1520, 450, 1) + line(1260, 355, 1260, 405, 1) + line(1440, 355, 1440, 405, 1),
      A(2, 0), .6, { fill: RED, fillOp: .06 });
    T('≈ 1 year', 1350, 600, 90, A(2, .3), .45);
    T('Dinari, before selling to US users', 1350, 760, 50, A(2, .55), .5, { c: GRAY });
  },
  sec(A) {
    let cols = '';
    for (const x of [375, 447, 520, 593, 665]) cols += line(x, 345, x, 525, 1);
    P(poly([[330, 330], [520, 240], [710, 330]], true, 1.5) + cols + rect(320, 528, 400, 40, 1.5), A(0, .1), .9);
    T('SEC', 520, 318, 56, A(0, .3), .3);
    T('Innovation Exemption', 520, 660, 70, A(0, .55), .6, { c: BLUE });
    T('17 Sep 2026 · 5 years', 520, 735, 52, A(0, .78), .45, { c: GRAY });
    const tick = (x, y) => circ(x, y, 42) + poly([[x - 20, y + 2], [x - 5, y + 18], [x + 22, y - 16]], false, 1);
    const cross = (x, y) => circ(x, y, 42) + line(x - 16, y - 16, x + 16, y + 16, 1) + line(x + 16, y - 16, x - 16, y + 16, 1);
    P(tick(1110, 290), A(1, .05), .4, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('real shareholder rights only', 1180, 308, 56, A(1, .15), .55, { anchor: 'start' });
    P(rect(1062, 430, 96, 64, 2) + poly([[1080, 494], [1072, 522], [1104, 494]], false, 1), A(1, .62), .35, { c: RED, fill: RED, fillOp: .1 });
    T('no', 1110, 474, 44, A(1, .62) + .35, .15, { c: RED });
    T('companies can veto tokens', 1180, 478, 56, A(1, .72), .45, { anchor: 'start' });
    P(tick(1110, 640), A(2, 0), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('Coinbase-style: win', 1180, 658, 56, A(2, .1), .45, { anchor: 'start', c: GREEN });
    P(cross(1110, 790), A(2, .52), .35, { c: RED, fill: RED, fillOp: .12 });
    T('wrappers like Robinhood’s: out', 1180, 808, 56, A(2, .6), .45, { anchor: 'start', c: RED });
  },
  outro(A) {
    T('Same assets.', 960, 270, 136, A(0, 0), .6);
    T('New rails.', 960, 430, 136, A(0, .55), .5, { c: GOLD });
    let ties = '';
    for (let x = 300; x <= 1620; x += 88) ties += line(x, 545, x + 8, 638, 1);
    P(line(250, 562, 1670, 562, 2) + line(250, 620, 1670, 620, 2) + ties, A(0, .82), .6, { w: 6 });
    P(eth(610, 790, 72).out, A(1, .03), .4, { c: BLUE, fill: BLUE, fillOp: .25 });
    T('RWA on Ethereum', 700, 830, 116, A(1, .25), .75, { c: BLUE, anchor: 'start' });
  }
};
