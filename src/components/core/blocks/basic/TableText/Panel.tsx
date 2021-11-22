import React, { useCallback, useContext } from 'react';
import { Padding } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Padding';
import { Stack } from '@/components/UI/Stack';
import { BackgroundColor } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/BackgroundColor';
import { Color } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Color';
import { TextAreaField } from '@/components/core/Form';
import { FontSize } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontSize';
import { FontWeight } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontWeight';
import { FontFamily } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontFamliy';
import { LineHeight } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/LineHeight';

import { useFocusIdx } from '@/hooks/useFocusIdx';
import { AttributesPanel } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/AttributesPanel';
import { useBlock } from '@/hooks/useBlock';
import { BasicType,  FIXED_CONTAINER_ID } from '@/constants';
import { IBlockData, IEmailTemplate } from '@/typings';
import { TableElement } from '../TableElement';
import { TableTitle } from '../TableTitle';
import { TableText } from '.';
import { getIndexByIdx, getParentIdx} from '@/utils/block';


import { cloneDeep, debounce, get } from "lodash";
import { message } from "antd";
import { useEditorContext } from "@/hooks/useEditorContext";
import { BlocksMap } from '@/components/core/blocks';
import { createBlockItem } from "@/utils/createBlockItem";
import { EditorPropsContext } from '@/components/Provider/PropsProvider';
import { Button, Tooltip } from 'antd';
import { IconFont } from '@/components/IconFont';
import { MergeTags } from '@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/MergeTags';

const getPopoverMountNode = () =>
    document.getElementById(FIXED_CONTAINER_ID)!;

export function Panel() {
  const { addBlock, moveBlock } = useBlock();

  const addColumn = () => {

    //const parentIdx = getParentIdx(focusIdx)!;
    const parentIdx = getParentIdx(focusIdx)!;

  addBlock({
    type: BasicType.TABLE_ELEMENT,
    parentIdx: parentIdx,
    positionIndex: getIndexByIdx(focusIdx) + 1,
    payload: {
      // @ts-ignore
          children: [
            TableText.create({
              data: {
                value: {
                  content:
                    'Content is stacked into tabs and users can expand them at will. If responsive styles are not supported (mostly on desktop clients), tabs are then expanded and your content is readable at once.',
                },
              },
            }),
          ],
    },
  });

  }

  // const onAddBlock = () => {
  //   copyBlock(focusIdx);
  // }

  const { values, getState, change, batch,  } = useEditorContext();
  const { mergeTags } = useContext(EditorPropsContext);
  const { focusIdx, setFocusIdx } = useFocusIdx();

  const copyBlock = useCallback(
    (idx: string) => {
       let nextFocusIdx = focusIdx;
       const values = cloneDeep(getState().values) as IEmailTemplate;

       const parentIdx = getParentIdx(idx);
       if (!parentIdx) return;
       const parent = get(values, getParentIdx(idx) || "") as IBlockData | null;
       if (!parent) {
          message.warning("Invalid block");
          return;
       }
       const copyBlock = cloneDeep(get(values, idx));
       const index = getIndexByIdx(idx) + 1;

       console.log(`values`, values);
       console.log(`parentIdx`, parentIdx);
       console.log(`parent`, parent);
       console.log(`copyBlock`, copyBlock);
       console.log(`index`, getIndexByIdx(idx))
       console.log(`idx`,idx);


       parent.children.splice(index, 0, copyBlock);
       change(parentIdx, { ...parent });
       nextFocusIdx = `${parentIdx}.children.[${index}]`;

       setFocusIdx(nextFocusIdx);
    },
    [change, focusIdx, getState, setFocusIdx]
 );

 const onMerge = useCallback(
  (e: any) => {
    const newVal = e
    change(`${focusIdx}.data.value.content`, newVal);
  },
  [change,focusIdx]
);


  return (
    <AttributesPanel>
      <Stack vertical>
      {/* <h1 onClick={() => addColumn()}>sdsdsds</h1> */}
      {mergeTags && (
            <Tooltip
              color='#fff'
              placement="bottom"
              title={
                <MergeTags value="" onChange={(val) => onMerge(val)} />
              }
              getPopupContainer={getPopoverMountNode}
            >
              <Button size='small' title='Merge tag' icon={<IconFont iconName="icon-merge-tags" />} />
            </Tooltip>
          )}
        <TextAreaField
          label='Content'
          name={`${focusIdx}.data.value.content`}
          inline
        />
        <Color />
        <FontSize />
        <LineHeight />
        <FontWeight />
        <FontFamily />
        <BackgroundColor />
        <Padding title='Padding' attributeName='padding' />
      </Stack>
    </AttributesPanel>
  );
}
