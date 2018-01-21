import { expect } from 'chai';
import { parseStyle } from '../../src/parser/style.js';
import { compileStyles } from '../../src/compiler/styles.js';

describe('styles compiler', () => {
  const styleString = 'Style:Default,Arial,20,&H00FFFFFF,&H000000FF,&H000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,0';
  const format = ['Name', 'Fontname', 'Fontsize', 'PrimaryColour', 'SecondaryColour', 'OutlineColour', 'BackColour', 'Bold', 'Italic', 'Underline', 'StrikeOut', 'ScaleX', 'ScaleY', 'Spacing', 'Angle', 'BorderStyle', 'Outline', 'Shadow', 'Alignment', 'MarginL', 'MarginR', 'MarginV', 'Encoding'];

  it('should compile styles', () => {
    const result = compileStyles({
      info: { WrapStyle: 0 },
      style: [parseStyle(styleString)],
      format,
    });
    expect(result.Default.style).to.deep.equal({
      Name: 'Default',
      Fontname: 'Arial',
      Fontsize: 20,
      PrimaryColour: '&H00FFFFFF',
      SecondaryColour: '&H000000FF',
      OutlineColour: '&H000000',
      BackColour: '&H00000000',
      Bold: -1,
      Italic: 0,
      Underline: 0,
      StrikeOut: 0,
      ScaleX: 100,
      ScaleY: 100,
      Spacing: 0,
      Angle: 0,
      BorderStyle: 1,
      Outline: 2,
      Shadow: 2,
      Alignment: 2,
      MarginL: 10,
      MarginR: 10,
      MarginV: 10,
      Encoding: 0,
    });
    expect(result.Default.tag).to.deep.equal({
      fn: 'Arial',
      fs: 20,
      c1: 'FFFFFF',
      a1: '00',
      c2: '0000FF',
      a2: '00',
      c3: '000000',
      a3: '00',
      c4: '000000',
      a4: '00',
      b: 1,
      i: 0,
      u: 0,
      s: 0,
      fscx: 100,
      fscy: 100,
      fsp: 0,
      frz: 0,
      xbord: 2,
      ybord: 2,
      xshad: 2,
      yshad: 2,
      q: 0,
    });
  });

  it('should set WrapStyle default to 2', () => {
    const result = compileStyles({
      info: {},
      style: [parseStyle(styleString)],
      format,
    });
    expect(result.Default.tag.q).to.equal(2);
  });

  it('should handle `*Default` as `Default`', () => {
    const result = compileStyles({
      info: { WrapStyle: 0 },
      style: [
        parseStyle('Style:*Default,Arial,21,&H00FFFFFF,&H000000FF,&H000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,0'),
        parseStyle('Style:**Default,Arial,22,&H00FFFFFF,&H000000FF,&H000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,0'),
      ],
      format,
    });
    expect(result['*Default']).to.equal(undefined);
    expect(result['**Default']).to.equal(undefined);
    expect(result.Default.tag.fs).to.equal(22);
  });
});
