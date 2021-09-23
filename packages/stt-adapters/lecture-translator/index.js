/**
 * Convert autoEdit2 Json to draftJS
 * see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index';

/**
 * groups words list from autoEdit transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words objects from autoEdit transcript
 */

const groupWordsInParagraphs = (lectureTranslatorText) => {
  const results = [];
  let paragraph = { words: [], text: [] };

  const lectureTranslatorLines = lectureTranslatorText.match(/^.*([\n\r]+|$)/gm);
  //need to check if last element is empty before deleting
  lectureTranslatorLines.pop();
  console.log(lectureTranslatorLines);
  lectureTranslatorLines.forEach((lectureTransLine) => {
    const splittedLine = lectureTransLine.split(/\s/);

    const tmpWord = {
      text: splittedLine[2],
      start: parseFloat(splittedLine[0]),
      end: parseFloat(splittedLine[0]) + parseFloat(splittedLine[1]),
    };

    if (/[.?!]/.test(tmpWord.text)) {
      paragraph.words.push(tmpWord);
      paragraph.text.push(tmpWord.text);
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    } else {
      paragraph.words.push(tmpWord);
      paragraph.text.push(tmpWord.text);
    }
  });
  //possible empty paragraph could be added in the end
  if (paragraph.words.length !== 0) {
    results.push(paragraph);
  }

  return results;
  ;
};

const lectureTranslator2ToDraft = (lectureTranslatorText) => {
  const results = [];
  const wordsByParagraphs = groupWordsInParagraphs(lectureTranslatorText.text);

  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: `TBC ${ i }`,
        words: paragraph.words,
        start: paragraph.words[0].start
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'text'),
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });

  // console.log(JSON.stringify(results,null,2))
  return results;
};

export default lectureTranslator2ToDraft;