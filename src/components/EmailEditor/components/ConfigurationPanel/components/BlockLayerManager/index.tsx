import React, { useCallback, useMemo, useRef } from 'react';
import { useEditorContext } from '@/hooks/useEditorContext';
import { IBlockData } from '@/typings';
import { getChildIdx, getIndexByIdx, getPageIdx, getParentIdx, getSiblingIdx } from '@/utils/block';

import { BlockInteractiveStyle } from '../../../BlockInteractiveStyle';
import { useFocusIdx } from '@/hooks/useFocusIdx';
import { Tree } from 'antd';
import { IconFont } from '@/components/IconFont';
import { getIconNameByBlockType } from '@/utils/getIconNameByBlockType';
import { cloneDeep } from 'lodash';
import './index.scss';
import { AllowDrop } from 'rc-tree/lib/Tree';
import { BlocksMap } from '@/components/core/blocks';
import { BlockType } from '@/constants';
import { useBlock } from '@/hooks/useBlock';

interface IBlockDataWithId extends IBlockData {
  key: string;
  parentType?: BlockType | null;
  children: IBlockDataWithId[];
}

export function BlockLayerManager() {
  const { pageData } = useEditorContext();
  const { focusIdx, setFocusIdx } = useFocusIdx();
  const hoverRef = useRef<{ dragNode: IBlockDataWithId, dropNode: IBlockDataWithId; allowDrop: boolean; } | null>(null);
  const { moveBlock } = useBlock();

  const list = useMemo(() => {
    const loop = (data: IBlockDataWithId, idx: string, parentType: BlockType | null) => {
      data.key = idx;
      data.parentType = parentType;
      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          loop(data.children[i], getChildIdx(idx, i), data.type);
        }
      }
    };
    const cloneData = cloneDeep(pageData);
    loop(cloneData as any, getPageIdx(), null) as any as IBlockDataWithId[];
    return [cloneData];
  }, [pageData]);

  const hasFocus = Boolean(focusIdx);

  const onDrop = useCallback((info: {
    node: IBlockDataWithId;
  } & {
    dragNode: IBlockDataWithId;
    dragNodesKeys: string[];
    dropPosition: number;
    dropToGap: boolean;
  }) => {
    const dragBlockData = info.dragNode;
    const dropBlockData = info.node;
    const dragBlock = BlocksMap.findBlockByType(dragBlockData.type);

    if (dragBlock?.validParentType.includes(dropBlockData.type)) {
      moveBlock(dragBlockData.key, getChildIdx(dropBlockData.key, 0));

    } else {
      moveBlock(dragBlockData.key, getSiblingIdx(dropBlockData.key, 1));

    }

  }, [moveBlock]);

  const allowDrop: AllowDrop = useCallback((options) => {

    const dropBlockData = options.dropNode as IBlockDataWithId;
    const dragBlockData = options.dragNode as IBlockDataWithId;
    if (hoverRef.current && hoverRef.current.dragNode === dragBlockData && hoverRef.current.dropNode === dropBlockData) {
      return hoverRef.current.allowDrop;
    } else {
      hoverRef.current = {
        dropNode: dropBlockData,
        dragNode: dragBlockData,
        allowDrop: false
      };
    }
    console.log('-allowDrop---------');
    const isSameParent = getParentIdx(dropBlockData.key) === getParentIdx(dragBlockData.key);
    if (isSameParent) {
      const sourceIndex = getIndexByIdx(dragBlockData.key);
      const destinationIndex = getIndexByIdx(dropBlockData.key);
      if (sourceIndex - destinationIndex === 1) return false;
      return true;
    }

    const dragBlock = BlocksMap.findBlockByType(dragBlockData.type);
    if (dragBlock?.validParentType.includes(dropBlockData.type)) {
      hoverRef.current.allowDrop = true;
      return true;
    }
    if (dragBlock?.validParentType.includes(dropBlockData.parentType!)) {
      hoverRef.current.allowDrop = true;
      return true;
    }
    return false;
  }, []);

  const titleRender = useCallback((blockData: IBlockData) => {
    return blockData.type;
  }, []);

  const iconRender = useCallback((blockData: IBlockData) => {
    return (
      <IconFont
        iconName={getIconNameByBlockType(blockData.type)}
        style={{ fontSize: 12 }}
      />
    );
  }, []);

  const onSelect = useCallback(([idx]: any[]) => {
    setFocusIdx(idx);
  }, [setFocusIdx]);

  return useMemo(() => {
    if (!hasFocus) return null;
    return (
      <div id='BlockLayerManager'>
        <BlockInteractiveStyle isShadowDom={false} />
        <Tree
          selectedKeys={[focusIdx]}
          onSelect={onSelect}
          defaultExpandAll
          className='draggable-tree'
          draggable
          blockNode
          showLine={{ showLeafIcon: false }}
          showIcon
          icon={iconRender}
          onDrop={onDrop as any}
          allowDrop={allowDrop}
          titleRender={titleRender as any}
          treeData={list as any}
        />
      </div>
    );
  }, [allowDrop, focusIdx, hasFocus, iconRender, list, onDrop, onSelect, titleRender]);
}
