/** regex for escape control characters  */
export const escapeControlCharacterRegex = /[\0\b\f\n\r\t\v]/g

/**
 * escape control characters for String.replace
 *
 * @param match - match text
 * @returns replaced text
 */
export function escapeControlCharacter(match: string): string {
  switch (match) {
    case '\0': return '\\0';
    case '\b': return '\\b';
    case '\f': return '\\f';
    case '\n': return '\\n';
    case '\r': return '\\r';
    case '\t': return '\\t';
    case '\v': return '\\v';
    default: return match;
  }
}
