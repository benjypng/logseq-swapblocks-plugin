import '@logseq/libs';
import { swapBlocks } from './utils';

const main = () => {
  console.log('Swap plugin loaded.');

  logseq.Editor.registerBlockContextMenuItem(
    'Swap ref/original blocks',
    async (e) => {
      swapBlocks(e);
    }
  );
};

logseq.ready(main).catch(console.error);
