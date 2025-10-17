const COLORS = { white: 37, red: 31, green: 32, yellow: 33, blue: 34 };

function colorize(text = "", colorCode = "") {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

function bold(text = "") {
  return `\x1b[1m${text}\x1b[22m`;
}

export default function Log(text = false) {
  if (!text) return;
  text = text?.replace(/\[error\]/g, "⚠️ ").replace(/\[ok\]/g, "✅ ");
  text = text?.replace(
    /\[(white|red|green|yellow|blue)\](.*?)(?=\[|$)/g,
    (match, color, content) => {
      content = content?.replace(/\*(.*?)\*/g, (_, boldMatch) =>
        bold(boldMatch)
      );
      return colorize(content, COLORS[color]);
    }
  );
  text = text?.replace(/\*(.*?)\*/g, (_, match) => bold(match));
  console.log(text);
}
