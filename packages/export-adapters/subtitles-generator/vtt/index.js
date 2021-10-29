import formatSeconds from '../compose-subtitles/util/format-seconds.js';

const generateVttString = ({ words, paragraphs }) => {
  let result = 'WEBVTT\n\n';
  const numOfWords = words.length;
  let ciWord = 0;
  let ciParagraph = 0;
  let startParagraph = true;

  let start = paragraphs[ciParagraph].start;
  let end = paragraphs[ciParagraph].end;
  //let speaker = paragraphs[ciParagraph].speaker;
  //result += `${ formatSeconds(parseFloat(start)) } --> ${ formatSeconds(parseFloat(end)) }\n<${ speaker }>`;
  result += `${ formatSeconds(parseFloat(start)) } --> ${ formatSeconds(parseFloat(end)) }\n`;

  while (ciWord < numOfWords) {
    if (words[ciWord].end <= paragraphs[ciParagraph].end) { // if we're still in the same paragraph
      if (!startParagraph) { // if this word is not the first word of a paragraph
        result += ' ';
      } else { // if it is the first word of a paragraph, the following words won't be
        startParagraph = false;
      }
      result += words[ciWord].text;
      ciWord += 1;
    } else { // next paragraph
      ciParagraph += 1;
      start = paragraphs[ciParagraph].start;
      end = paragraphs[ciParagraph].end;
      //speaker = paragraphs[ciParagraph].speaker;
      //result += `\n\n${ formatSeconds(parseFloat(start)) } --> ${ formatSeconds(parseFloat(end)) }\n<${ speaker }>`;
      result += `\n\n${ formatSeconds(parseFloat(start)) } --> ${ formatSeconds(parseFloat(end)) }\n`;
      startParagraph = true;
    }
  }
  result += '\n'; // this won't be necessary once the vtt import adapter can handle files without
  // an empty line at the end.

  return result;
};

export default generateVttString;