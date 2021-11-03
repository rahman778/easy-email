import { ReactSortableProps } from 'react-sortablejs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import {
  BlockTreeItem,
  DATA_ATTRIBUTE_ID,
  DATA_ATTRIBUTE_INDEX,
  TreeNode,
} from './components/BlockTreeItem';

export interface BlockTreeProps<T extends TreeNode<T>> {
  treeData: T[];
  renderTitle: (data: T) => React.ReactNode;
  defaultExpandAll?: boolean;
  allowDrop: (params: {
    dragNode: T;
    dropNode: T;
    event: DragEvent;
    dragIndex: number;
    dropIndex: number;
    willInsertAfter: boolean;
  }) => boolean;
  onDrop: (params: {
    dragNode: T;
    dropNode: T;
    event: DragEvent;
    dragIndex: number;
    dropIndex: number;
    willInsertAfter: boolean;
  }) => void;
}

const getCurrenTreeNode = (
  ele: HTMLElement,
  rootEle?: HTMLElement
): HTMLElement | null => {
  if (ele.getAttribute(DATA_ATTRIBUTE_ID)) return ele;
  if (ele.parentElement && rootEle && rootEle.contains(ele.parentElement))
    return getCurrenTreeNode(ele.parentElement, rootEle);
  return null;
};

export function BlockTree<T extends TreeNode<T>>(props: BlockTreeProps<T>) {
  const [eleRef, setEleRef] = useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [dropData, setDropData] = useState<null | {
    dragNode: T;
    dropNode: T;
    event: DragEvent;
    dragIndex: number;
    dropIndex: number;
    willInsertAfter: boolean;
  }>(null);

  const { treeData, allowDrop, onDrop } = props;

  const treeDataMap = useMemo(() => {
    const map: { [key: string]: T; } = {};

    const loop = (node: T) => {
      if (map[node.id]) {
        console.warn(`have same id ${node.id}`);
      }

      map[node.id] = node;
      if (node.children) {
        node.children.forEach((item) => {
          loop(item);
        });
      }
    };

    treeData.forEach((item) => {
      loop(item);
    });

    return map;
  }, [treeData]);

  useEffect(() => {
    if (!eleRef) return;

    const onClick = (ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        const treeNode = getCurrenTreeNode(ev.target, eleRef);
        if (treeNode) {
          setSelectedId(treeNode.getAttribute(DATA_ATTRIBUTE_ID)!);
        }
      }
    };

    eleRef.addEventListener('click', onClick);
    return () => {
      eleRef.removeEventListener('click', onClick);
    };
  }, [eleRef]);

  useEffect(() => {
    if (!eleRef) return;
    if (selectedId) {
      const node = eleRef.querySelector('.' + styles.treeNodeSelected);
      if (node) {
        node.classList.remove(styles.treeNodeSelected);
      }
      const selectedNode = eleRef.querySelector(
        `[${DATA_ATTRIBUTE_ID}="${selectedId}"]`
      );
      if (selectedNode) {
        selectedNode.classList.add(styles.treeNodeSelected);
      }
    }
  }, [eleRef, selectedId]);

  const onDragStart: ReactSortableProps<T>['onStart'] = useCallback(
    (evt, sortable, store) => {
      console.log('onDragStart');
    },
    []
  );

  const onDragMove: ReactSortableProps<T>['onMove'] = useCallback(
    (
      evt: {
        dragged: HTMLElement;
        related: HTMLElement;
        willInsertAfter: boolean;
      },
      originalEvent
    ) => {

      const dragEle = getCurrenTreeNode(evt.dragged);
      const dropEle = getCurrenTreeNode(evt.related);

      [...eleRef!.querySelectorAll(`.${styles.treeNodeDrop},.${styles.treeNodeDropEnd}`)].forEach(item => {
        item.classList.remove(styles.treeNodeDrop, styles.treeNodeDropEnd);
      });

      if (dropEle && dragEle) {
        const dragId = dragEle.getAttribute(DATA_ATTRIBUTE_ID)!;
        const dragIndex = dragEle.getAttribute(DATA_ATTRIBUTE_INDEX)!;
        const dropId = dropEle.getAttribute(DATA_ATTRIBUTE_ID)!;
        const dropIndex = dropEle.getAttribute(DATA_ATTRIBUTE_INDEX)!;
        const dropData = {
          dragNode: treeDataMap[dragId],
          dragIndex: Number(dragIndex),
          dropIndex: Number(dropIndex),
          dropNode: treeDataMap[dropId],
          willInsertAfter: evt.willInsertAfter,
          event: originalEvent,
        };
        const isAllowDrop = allowDrop(dropData);

        if (isAllowDrop) {
          dropEle.classList.add(styles.treeNodeDrop);
          setDropData(dropData);
          return true;
        }
      }
      return false;
    },
    [allowDrop, eleRef, treeDataMap]
  );

  const onDragEnd: ReactSortableProps<T>['onEnd'] = useCallback(
    (evt: {
      originalEvent: { dataTransfer: DataTransfer; };
      from: HTMLElement;
      to: HTMLElement;
      newIndex: number;
      oldIndex: number;
    }) => {
      [...eleRef!.querySelectorAll(`.${styles.treeNodeDrop},.${styles.treeNodeDropEnd}`)].forEach(item => {
        item.classList.remove(styles.treeNodeDrop, styles.treeNodeDropEnd);
      });
      if (dropData) {
        onDrop(dropData);
      }
      setDropData(null);
      if (!eleRef) return;
    },
    [dropData, eleRef, onDrop]
  );

  const onSpill = useCallback(
    (evt: { originalEvent: { dataTransfer: DataTransfer; }; }) => {
      setDropData(null);
    },
    []
  );

  return (
    <div ref={setEleRef} className={styles.tree}>
      {props.treeData.map((item) => (
        <ul key={item.id} className={styles.treeNodeList}>
          <BlockTreeItem<T>
            nodeData={item}
            renderTitle={props.renderTitle}
            indent={0}
            index={0}
            defaultExpandAll={Boolean(props.defaultExpandAll)}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onSpill={onSpill}
          />
        </ul>
      ))}
    </div>
  );
}
