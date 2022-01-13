import { BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user';

export const swapBlocks = async (e: any) => {
  // Get reference block
  const refBlock = await logseq.Editor.getBlock(e.uuid);

  // Check if parent is the page
  let refLeftBlock: PageEntity | BlockEntity;
  if (refBlock.left.id === refBlock.page.id) {
    refLeftBlock = await logseq.Editor.getPage(refBlock.left.id);
  } else {
    refLeftBlock = await logseq.Editor.getBlock(refBlock.left.id);
  }

  // Check if trying to do a swap on an original block
  if (!refBlock.content.startsWith('((') && !refBlock.content.endsWith('))')) {
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
  let origLeftBlock: PageEntity | BlockEntity;
  if (origBlock.left.id === origBlock.page.id) {
    origLeftBlock = await logseq.Editor.getPage(origBlock.left.id);
  } else {
    origLeftBlock = await logseq.Editor.getBlock(origBlock.left.id);
  }

  if (origLeftBlock.name) {
    const pbt = await logseq.Editor.getPageBlocksTree(origLeftBlock.name);

    if (pbt.length === 0) {
      const blockToDelete = await logseq.Editor.insertBlock(
        origLeftBlock.name,
        '',
        { isPageBlock: true }
      );
      await logseq.Editor.moveBlock(refBlock.uuid, blockToDelete.uuid, {
        before: false,
      });
      await logseq.Editor.removeBlock(blockToDelete.uuid);
    } else {
      await logseq.Editor.moveBlock(refBlock.uuid, pbt[0].uuid, {
        before: true,
      });
    }
  } else {
    await logseq.Editor.moveBlock(refBlock.uuid, origLeftBlock.uuid, {
      before: false,
    });
  }

  if (refLeftBlock.name) {
    const pbt = await logseq.Editor.getPageBlocksTree(refLeftBlock.name);

    if (pbt.length === 0) {
      const blockToDelete = await logseq.Editor.insertBlock(
        refLeftBlock.name,
        '',
        { isPageBlock: true }
      );
      await logseq.Editor.moveBlock(origBlock.uuid, blockToDelete.uuid, {
        before: false,
      });
      await logseq.Editor.removeBlock(blockToDelete.uuid);
    } else {
      await logseq.Editor.moveBlock(origBlock.uuid, pbt[0].uuid, {
        before: true,
      });
    }
  } else {
    await logseq.Editor.moveBlock(origBlock.uuid, refLeftBlock.uuid, {
      before: false,
    });
  }
};
