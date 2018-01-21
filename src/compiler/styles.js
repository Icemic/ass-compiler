import { assign } from '../utils.js';

// same as Aegisub
// https://github.com/Aegisub/Aegisub/blob/master/src/ass_style.h
const DEFAULT_STYLE = {
  Name: 'Default',
  Fontname: 'Arial',
  Fontsize: '20',
  PrimaryColour: '&H00FFFFFF&',
  SecondaryColour: '&H000000FF&',
  OutlineColour: '&H00000000&',
  BackColour: '&H00000000&',
  Bold: '0',
  Italic: '0',
  Underline: '0',
  StrikeOut: '0',
  ScaleX: '100',
  ScaleY: '100',
  Spacing: '0',
  Angle: '0',
  BorderStyle: '1',
  Outline: '2',
  Shadow: '2',
  Alignment: '2',
  MarginL: '10',
  MarginR: '10',
  MarginV: '10',
  Encoding: '1',
};

function parseStyleColor(color) {
  const [, a, c] = color.match(/&H(\w\w)?(\w{6})&?/);
  return [a || '00', c];
}

export function compileStyles({ info, style, format, defaultStyle }) {
  const result = {};
  const ds = assign({}, DEFAULT_STYLE, defaultStyle, { Name: 'Default' });
  const styles = [format.map(fmt => ds[fmt])].concat(style);
  for (let i = 0; i < styles.length; i++) {
    const stl = styles[i];
    const s = {};
    for (let j = 0; j < format.length; j++) {
      const fmt = format[j];
      s[fmt] = (fmt === 'Name' || fmt === 'Fontname' || /Colour/.test(fmt)) ? stl[j] : stl[j] * 1;
      // this behavior is same as Aegisub by black-box testing
      if (fmt === 'Name' && /^(\*+)Default$/.test(s[fmt])) {
        s[fmt] = 'Default';
      }
    }
    const [a1, c1] = parseStyleColor(s.PrimaryColour);
    const [a2, c2] = parseStyleColor(s.SecondaryColour);
    const [a3, c3] = parseStyleColor(s.OutlineColour);
    const [a4, c4] = parseStyleColor(s.BackColour);
    const tag = {
      fn: s.Fontname,
      fs: s.Fontsize,
      c1,
      a1,
      c2,
      a2,
      c3,
      a3,
      c4,
      a4,
      b: Math.abs(s.Bold),
      i: Math.abs(s.Italic),
      u: Math.abs(s.Underline),
      s: Math.abs(s.StrikeOut),
      fscx: s.ScaleX,
      fscy: s.ScaleY,
      fsp: s.Spacing,
      frz: s.Angle,
      xbord: s.Outline,
      ybord: s.Outline,
      xshad: s.Shadow,
      yshad: s.Shadow,
      q: /^[0-3]$/.test(info.WrapStyle) ? info.WrapStyle * 1 : 2,
    };
    result[s.Name] = { style: s, tag };
  }
  return result;
}
