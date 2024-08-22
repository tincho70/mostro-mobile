/**
 * Truncates a given text to a specified maximum length adding [...] in the middle.
 *
 * @param {string} text - The text to be truncated.
 * @param {number} maxLength - The maximum length of the text.
 * @return {string} The truncated text.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  const mid = Math.floor(maxLength / 2);
  const start = text.substring(0, mid);
  const end = text.substring(text.length - mid);
  return `${start}...${end}`;
};

export type ConfigProps = {
  mostroPubKey: string;
  relaysList: string[];
};

export const baseConfig: ConfigProps = {
  relaysList: ["wss://relay.mostro.network"],
  mostroPubKey: "",
};
