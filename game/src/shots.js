// Screenshot previews follow the starter contract (?shot=NAME). They advance
// the actual game rules with reproducible attempts, then hold the resulting
// frame. The ordinary game has no autopilot and no frozen clock.
export function stageShot(name, state) {
  state.sound.enabled = false;
  state.reset();
  const advance = seconds => {
    const start = state.lastTick;
    for (let i = 1; i <= seconds * 30; i++) state.tick(start + i * 1000 / 30);
  };
  const find = index => {
    const d = state.chapter.differences[index]; state.inspect(d.x, d.y, 1); advance(4);
  };
  const complete = () => {
    state.chapter.differences.forEach((_, i) => find(i)); state.next();
  };
  if (name === 'market' || name === 'garden' || name === 'end') complete();
  if (name === 'garden' || name === 'end') complete();
  if (name === 'end') state.chapter.differences.forEach((_, i) => find(i));
  else if (name === 'garden') [0, 3, 6].forEach(find);
  else if (name === 'market') [0, 1, 5].forEach(find);
  else [0, 1, 3].forEach(find);
  advance(2);
  state.sound.enabled = true;
}
