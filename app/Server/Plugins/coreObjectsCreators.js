const sha224 = require('js-sha256').sha224;
const p = require('path');

/**
 * Normalizes entry title as possible
 *
 * @param {string} title
 * @returns {string}
 */
function basename2title(title) {
  let name = title;

  // Get rid of [720p] and similar shit
  name = name.replace(/(\[.*?])/g, '');
  // Get rid of (720p) and similar shit
  name = name.replace(/(\(.*?\))/g, '');
  // Replace _. with space
  name = name.replace(/[_\.]/g, ' ');

  return name.trim();
}

/**
 * Returns normalized extension name
 *
 * @param {string} path
 * @returns {string}
 */
function extname(path) {
  return p.extname(path).slice(1).toLowerCase();
}

/**
 * Converts items to map of itemId=>itemPath
 *
 * @param {string[]} items
 * @return {Map<string, string>}
 */
function items2map(items) {
  const map = new Map();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemBasename = p.basename(item, p.extname(item));

    map.set(sha224(itemBasename), item);
  }

  return map;
}

/**
 * Makes new entry object
 *
 * @param {string} path
 * @return {Entry}
 */
function entry(path) {
  const basename = p.basename(path);

  return {
    id: sha224(path),
    path,
    title: basename2title(basename),
    width: 0,
    height: 0,
    bitDepth: 8,
    episodes: new Map(),
    subtitles: new Map(),
    voiceOvers: new Map(),
    defaultSubtitles: '',
    defaultVoiceOver: ''
  };
}

/**
 * Makes new episode object
 *
 * @param {string} path
 * @return {Episode}
 */
function episode(path) {
  const extension = p.extname(path);
  const format = extension.slice(1).toLowerCase();
  const basename = p.basename(path, extension);

  return {
    id: sha224(basename),
    path,
    title: basename2title(basename),
    format,
    codec: 'x264',
    watched: false,
    chapters: [],
    duration: 0,
    stoppedAt: 0
  };
}

/**
 * Makes new chapter object
 *
 * @param {string} title
 * @param {number} time
 * @return {Chapter}
 */
function chapter(title, time) {
  return {
    time,
    title
  }
}

/**
 * Makes new subtitles object
 *
 * @param {string} path
 * @param {string[]} items
 * @param {boolean} embedded
 * @return {Subtitles}
 */
function subtitles(path, items, embedded = false) {
  const basename = p.basename(path);

  return {
    id: sha224(basename),
    path,
    items: items2map(items),
    title: basename2title(basename),
    format: extname(items[0]),
    embedded
  };
}

/**
 * Makes new voiceOver object
 *
 * @param {string} path
 * @param {string[]} items
 * @param {boolean} embedded
 * @return {VoiceOver}
 */
function voiceOver(path, items, embedded = false) {
  const basename = p.basename(path);

  return {
    id: sha224(basename),
    path,
    items: items2map(items),
    title: basename2title(basename),
    format: extname(items[0]),
    embedded
  };
}

module.exports = {
  entry,
  episode,
  chapter,
  voiceOver,
  subtitles
};
