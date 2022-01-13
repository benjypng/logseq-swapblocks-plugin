import '@logseq/libs';

const main = () => {
  console.log('Swap plugin loaded.');

  logseq.Editor.registerBlockContextMenuItem(
    'Swap ref/original blocks',
    async (e) => {
      // Get reference block
      const refBlock = await logseq.Editor.getBlock(e.uuid);

      // Check if parent is the page
      let refLeftBlock;
      if (refBlock.left.id === refBlock.page.id) {
        // refLeftBlock = await logseq.Editor.getPage(refBlock.left.id);
        logseq.App.showMsg(
          'Unfortunately, this alpha version can only work if the block is not the first block on the page.'
        );
        return;
      } else {
        refLeftBlock = await logseq.Editor.getBlock(refBlock.left.id);
      }

      // Check if trying to do a swap on an original block
      if (
        !refBlock.content.startsWith('((') &&
        !refBlock.content.endsWith('))')
      ) {
        logseq.App.showMsg('Please do a swap only for reference blocks.');
        return;
      }

      // // Get original block UUID
      const regExp = /\(\(([^)]+)\)\)/;
      const matched = regExp.exec(refBlock.content);
      const origBlockUUID = matched[1];

      const origBlock = await logseq.Editor.getBlock(origBlockUUID, {
        includeChildren: true,
      });

      // Check if parent is the page
      let origLeftBlock;
      if (origBlock.left.id === origBlock.page.id) {
        // origLeftBlock = await logseq.Editor.getPage(origBlock.left.id);
        logseq.App.showMsg(
          'Unfortunately, this alpha version can only work if the block is not the first block on the page.'
        );
        return;
      } else {
        origLeftBlock = await logseq.Editor.getBlock(origBlock.left.id);
      }

      // MOVE BLOCKS WILL FAIL IF THE LEFT BLOCK IS A PAGE
      await logseq.Editor.moveBlock(refBlock.uuid, origLeftBlock.uuid, {
        before: false,
        includeChildren: true,
      });

      await logseq.Editor.moveBlock(origBlock.uuid, refLeftBlock.uuid, {
        before: false,
        includeChildren: true,
      });
    }
  );
};

logseq.ready(main).catch(console.error);
