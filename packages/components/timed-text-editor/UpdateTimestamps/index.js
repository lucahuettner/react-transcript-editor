import generateEntitiesRanges from '../../../stt-adapters/generate-entities-ranges';
import { createEntityMap } from '../../../stt-adapters';
import alignWords from './stt-align-node.js';

const convertContentToText = (content) => {
  let text = [];
  for (const blockIndex in content.blocks) {
    const block = content.blocks[blockIndex];
    const blockArray = block.text.match(/\S+/g) || [];
    text = text.concat(blockArray);
  }

  return text;
};

const createEntity = (start, end, confidence, word, wordIndex) => {
  return ({
    start: start,
    end: end,
    confidence: confidence,
    word: word.toLowerCase().replace(/[.?!]/g, ''),
    punct: word,
    index: wordIndex,
  });
};

const createContentFromEntityList = (currentContent, newEntities) => {
  // Update entites to block structure.
  const updatedBlockArray = [];
  let totalWords = 0;

  for (const blockIndex in currentContent.blocks) {
    const block = currentContent.blocks[blockIndex];
    // if copy and pasting large chunk of text
    // currentContentBlock, would not have speaker and start/end time info
    // so for updatedBlock, getting start time from first word in blockEntities
    //const wordsInBlock = (block.text.match(/\S+/g) || []).length;
    const wordsInBlock = block.text.split(' ').length;
    const blockEntites = newEntities.slice(totalWords, totalWords + wordsInBlock);
    let speaker = block.data.speaker;

    if (!speaker) {
      console.log('speaker', speaker, block);
      speaker = 'U_UKN';
    }
    const updatedBlock = {
      text: blockEntites.map((entry) => entry.punct).join(' '),
      type: 'paragraph',
      data: {
        speaker: speaker,
        words: blockEntites,
        start: blockEntites[0].start
      },
      entityRanges: generateEntitiesRanges(blockEntites, 'punct'),
    };

    updatedBlockArray.push(updatedBlock);
    totalWords += wordsInBlock;
  }

  return { blocks: updatedBlockArray, entityMap: createEntityMap(updatedBlockArray) };
};

const alignParagraph = (currentContent, originalContent) => {
  console.log('in alignParagraphs');
  console.log(currentContent);
  console.log(originalContent);

  const result = [];
  // iteriere parallel über blocks
  //let currWordIndex = 0;
  //const numOfBlocks = originalContent.blocks.length;
  for (let i = 0; i < currentContent.blocks.length; i++) {
    //const bOriginal = originalContent.blocks[i];
    const bCurr = currentContent.blocks[i];
    //console.log(bOriginal);
    console.log(bCurr);
    // if (bOriginal.text === bCurr.text) {
    //   const startEntityIndex = currWordIndex;
    //   currWordIndex += bOriginal.entityRanges.length;
    //   for (let j = startEntityIndex; j < currWordIndex; j++) {
    //     const word = originalContent.entityMap[j];
    //     console.log(word);
    //     result.push({ start: word.data.start, end: word.data.end, word: word.data.text });
    //   }
    //   continue;
    // }
    // INFO: texts don't match
    // find timestamps start and end
    let start = bCurr.data.start;
    console.log("defined start");
    let end = currentContent.entityMap[Object.keys(currentContent.entityMap).length - 1].data.end;
    console.log("defined start and end for the first time");
    if (i != currentContent.blocks.length - 1) {
      end = currentContent.blocks[i + 1].data.start;
    }
    console.log("defined start and end");
    const duration = end - start;
    const newText = bCurr.text;
    const newWords = newText.split(' ');
    const numOfChars = newText.length - (newWords.length - 1);
    for (const word of newWords) {
      const wordStart = start;
      const wordEnd = wordStart + (duration * (word.length / numOfChars));
      result.push({ start: wordStart, end: wordEnd, word: word });
      start += (wordEnd - wordStart);
    }
    //currWordIndex += bOriginal.entityRanges.length;
  }

  // keep track of # words

  // compare paragraphs

  // paragraphen neu interpolieren
  return result;
};

// Update timestamps usign stt-align (bbc).
const updateTimestamps = (currentContent, originalContent) => {
  console.log(originalContent);
  console.log(currentContent);

  const result = alignParagraph(currentContent, originalContent);

  // const currentText = convertContentToText(currentContent);

  // const entityMap = originalContent.entityMap;

  // const entities = [];

  // for (const entityIdx in entityMap) {
  //   entities.push({
  //     start: parseFloat(entityMap[entityIdx].data.start),
  //     end: parseFloat(entityMap[entityIdx].data.end),
  //     word: entityMap[entityIdx].data.text,
  //   });
  // }

  // const result = alignWords(entities, currentText);
  console.log(result);

  const newEntities = result.map((entry, index) => {
    return createEntity(entry.start, entry.end, 0.0, entry.word, index);
  });
  const updatedContent = createContentFromEntityList(currentContent, newEntities);
  console.log(updatedContent);

  return updatedContent;
};

export default updateTimestamps;
