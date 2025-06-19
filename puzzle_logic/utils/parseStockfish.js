export function parseStockfishLines(lines) {
  const parsed = lines.map((line) => {
    const match = line.match(/score (cp|mate) (-?\d+)/);
    const move = line.match(/ pv (\S+)/)?.[1];
    return {
      eval: match[1] === "cp" ? parseInt(match[2]) : 10000,
      move,
    };
  });
  return parsed.sort((a, b) => b.eval - a.eval); // best first
}