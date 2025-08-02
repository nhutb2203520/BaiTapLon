export function capitalizeWords(str = '') {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function capitalizeFirst(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str = '') {
  const articles = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by',
    'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'with'
  ]);

  return str
    .toLowerCase()
    .split(' ')
    .map((word, i) => (i === 0 || !articles.has(word)) 
      ? word.charAt(0).toUpperCase() + word.slice(1) 
      : word)
    .join(' ');
}

export function truncate(str = '', length = 50) {
  return str.length <= length ? str : str.slice(0, length) + '...';
}

export function cleanString(str = '') {
  return str.replace(/\s+/g, ' ').trim();
}
