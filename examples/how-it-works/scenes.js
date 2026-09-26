// Example: a 40-second video that explains the skill itself.
window.SCENES = {
  intro(A, { W }) {
    const b = T('Whiteboard videos', W / 2, 400, 160, A(0, 0), .9);
    P(wave(b.x + 20, b.x + b.width - 20, 450, 7, 110), A(0, .3), .3, { c: GOLD, w: 9 });
    T('written, voiced & drawn by Claude', W / 2, 590, 84, A(0, .42), .8, { c: BLUE });
  },
  ask(A) {
    P(icon.person(360, 560, 1.3), A(0, 0), .7);
    P(icon.bubble(650, 330, 340, 110), A(0, .12), .4, { fill: BLUE, fillOp: .1 });
    T('here is my idea', 650, 346, 54, A(0, .2), .4, { c: BLUE });
    [['topic', 1000, .32], ['audience', 1330, .52], ['length', 1660, .74]].forEach(([lab, x, fr]) => {
      P(rect(x - 130, 460, 260, 170, 2), A(0, fr), .35, { fill: GOLD, fillOp: .3 });
      T(lab, x, 562, 66, A(0, fr) + .35, .3);
    });
  },
  script(A) {
    let lines = '';
    for (let i = 0; i < 6; i++) lines += line(340, 330 + i * 70, 340 + (i % 3 === 2 ? 220 : 300), 330 + i * 70, 2);
    P(rect(290, 220, 400, 560, 2) + lines, A(0, 0), .9);
    T('scene 1 · scene 2 · scene 3', 1240, 360, 64, A(0, .45), .7);
    P(icon.tick(930, 560, 46), A(1, 0), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('facts checked twice', 1010, 580, 64, A(1, .12), .5, { anchor: 'start' });
    P(icon.tick(930, 700, 46), A(1, .6), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('you approve', 1010, 720, 64, A(1, .7), .4, { anchor: 'start', c: GREEN });
  },
  voice(A) {
    T('pick a voice', 960, 200, 110, A(0, 0), .6);
    const opts = [['macOS voices', 300, .0], ['ElevenLabs', 740, .28], ['OpenAI', 1180, .5], ['your own voice', 1620, .7]];
    opts.forEach(([lab, x, fr], i) => {
      const col = [GRAY, INK, BLUE, RED][i];
      P(rect(x - 150, 380, 300, 200, 2) + wave(x - 110, x + 110, 480, 30 - i * 4, 55 + i * 10), A(1, fr), .45, { c: col, fill: col, fillOp: .08 });
      T(lab, x, 660, 58, A(1, fr) + .45, .35);
    });
  },
  draw(A) {
    P(wave(260, 1000, 250, 26, 70), A(0, 0), .6, { c: BLUE, w: 6 });
    T('voice', 630, 180, 56, A(0, .1), .35, { c: BLUE });
    let holes = '';
    for (let x = 290; x < 980; x += 70) holes += rect(x, 380, 34, 24, 1) + rect(x, 596, 34, 24, 1);
    P(rect(260, 360, 740, 280, 2) + holes, A(0, .35), .8);
    T('scene · scene · scene', 630, 520, 60, A(0, .62), .5);
    P(arrow(1060, 500, 1300, 500), A(1, 0), .35);
    P(rect(1340, 390, 330, 220, 2), A(1, .25), .35, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('MP4', 1505, 530, 110, A(1, .45), .35, { c: GREEN });
  },
  outro(A, { W }) {
    T('Open source.', W / 2, 360, 150, A(0, 0), .7);
    T('Grab it and make your own.', W / 2, 520, 88, A(0, .4), .7, { c: GOLD });
    T('github.com/Matteoikarieth96/whiteboard-video-skill', W / 2, 720, 56, A(0, .72), .7, { c: BLUE });
  }
};
