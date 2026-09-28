// One builder per scene id in script.json. Each builder gets A and the board size { W, H }.
// A(line, fraction) = the moment `fraction` of the way through spoken line `line` of this scene.
// P(pathString, at, duration, {c, w, fill, fillOp}) draws a path. T(text, x, y, size, at, duration, {c, anchor}) writes text.
// Helpers: line, poly, rect, circ, arc, arrow, head, wave, icon.tick/cross/coin/clock/bubble/person/building/bars.
// Colors: INK, BLUE, GOLD, RED, GREEN, GRAY. Position things as fractions of W and H so the same scene
// works in 16:9 (1920x1080) and 9:16 (1080x1920). Keep content above H - 150: that strip is for captions.
window.SCENES = {
  intro(A, { W, H }) {
    const b = T('Your title here', W / 2, H * .4, Math.min(W, H) * .13, A(0, 0), 1.0);
    P(wave(b.x + 20, b.x + b.width - 20, b.y + b.height + 10, 7, 110), A(0, .45), .35, { c: GOLD, w: 9 });
  },
  point(A, { W, H }) {
    T('Every board has a title', W / 2, H * .14, Math.min(W, H) * .09, A(0, 0), .6); // keeps muted viewers oriented
    const v = H > W; // vertical layout stacks the two ideas instead of placing them side by side
    const [px, py] = v ? [W * .3, H * .3] : [W * .22, H * .5];
    P(icon.person(px, py), A(0, .15), .8);
    P(icon.bubble(px + 280, py - 190, 300, 120), A(0, .35), .5, { fill: BLUE, fillOp: .12 });
    T('hello!', px + 280, py - 172, 64, A(0, .6), .4, { c: BLUE });
    const [tx, ty] = v ? [W / 2, H * .58] : [W * .68, H * .42];
    P(icon.tick(tx, ty, 60), A(1, 0), .5, { c: GREEN, fill: GREEN, fillOp: .15 });
    T('one line, one caption', tx, ty + 150, 60, A(1, .3), .6);
  }
};
