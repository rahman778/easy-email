import React, { useCallback, useContext } from "react";
import { Padding } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Padding";
import { Stack } from "@/components/UI/Stack";
import { BackgroundColor } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/BackgroundColor";
import { Color } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Color";
import { TextAreaField } from "@/components/core/Form";
import { FontSize } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontSize";
import { FontWeight } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontWeight";
import { FontFamily } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontFamliy";
import { LineHeight } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/LineHeight";

import { useFocusIdx } from "@/hooks/useFocusIdx";
import { AttributesPanel } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/AttributesPanel";
import { useBlock } from "@/hooks/useBlock";
import { BasicType, BlockType, FIXED_CONTAINER_ID } from "@/constants";
import { IBlockData, IEmailTemplate } from "@/typings";
import { getIndexByIdx, getParentIdx, getValueByIdx } from "@/utils/block";
import { cloneDeep, debounce, get } from "lodash";
import { message, Row, Col } from "antd";
import { useEditorContext } from "@/hooks/useEditorContext";
import { BlocksMap } from "@/components/core/blocks";
import { createBlockItem } from "@/utils/createBlockItem";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { Button, Tooltip } from "antd";
import { IconFont } from "@/components/IconFont";
import { MergeTags } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/MergeTags";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const getPopoverMountNode = () => document.getElementById(FIXED_CONTAINER_ID)!;

export function Panel() {
   const { values, getState, change, batch } = useEditorContext();
   const { mergeTags } = useContext(EditorPropsContext);
   const { focusIdx, setFocusIdx } = useFocusIdx();

   const addRow = () => {
      const parentIdx = getParentIdx(focusIdx)!;

      let tableIdx = getParentIdx(parentIdx)!;

      const parent = get(values, tableIdx || "") as IBlockData | null;

      let load = {
         type: BasicType.TABLE_TEXT,
         data: {
            value: {
               content: "Text",
            },
         },
         attributes: {
            "font-size": "13px",
            padding: "16px 16px 16px 16px",
            "line-height": "1",
            border: "1px solid #d9d9d9",
         },
         children: [],
      };

      let array = parent?.children[0].children || [];

      let child = array.map((item) => load);

      addBlock({
         type: BasicType.TABLE_ELEMENT,
         parentIdx: tableIdx,
         positionIndex: getIndexByIdx(focusIdx) + 1,
         payload: {
            // @ts-ignore
            children: child,
         },
      });
   };

   const addBlock = useCallback(
      (params: { type: BlockType; parentIdx: string; positionIndex?: number; payload?: any; canReplace?: boolean }) => {
         let { type, parentIdx, positionIndex, payload } = params;
         let nextFocusIdx = focusIdx;
         const values = cloneDeep(getState().values) as IEmailTemplate;
         const parent = get(values, parentIdx) as IBlockData | null;
         if (!parent) {
            message.warning("Invalid block");
            return;
         }

         let child = createBlockItem(type, payload);

         if (typeof positionIndex === "undefined") {
            positionIndex = parent.children.length;
         }
         nextFocusIdx = `${parentIdx}.children.[${positionIndex}]`;

         parent.children.splice(positionIndex, 0, child);
         change(parentIdx, { ...parent }); // listeners not notified
         setFocusIdx(nextFocusIdx);
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   const addColumn = () => {
      const parentIdx = getParentIdx(focusIdx)!;

      let tableIdx = getParentIdx(parentIdx)!;

      addColumnBlock({
         type: BasicType.TABLE_TEXT,
         parentIdx: tableIdx,
         positionIndex: getIndexByIdx(focusIdx) + 1,
         payload: {
            // @ts-ignore
            data: {
               value: {
                  content: "Text",
               },
            },
            attributes: {
               "font-size": "13px",
               padding: "16px 16px 16px 16px",
               border: "1px solid #d9d9d9",
            },
            children: [],
         },
      });
   };

   const addColumnBlock = useCallback(
      (params: { type: BlockType; parentIdx: string; positionIndex?: number; payload?: any; canReplace?: boolean }) => {
         let { type, parentIdx, positionIndex, payload } = params;
         let nextFocusIdx = focusIdx;
         const values = cloneDeep(getState().values) as IEmailTemplate;
         const parent = get(values, parentIdx) as IBlockData | null;

         if (!parent) {
            message.warning("Invalid block");
            return;
         }

         let child = createBlockItem(type, payload);

         if (typeof positionIndex === "undefined") {
            positionIndex = parent.children.length;
         }
         nextFocusIdx = `${parentIdx}.children.[${positionIndex}]`;

         parent.children.forEach((item, idx) => {
            item.children.splice(item.children.length, 0, child);
         });

         change(parentIdx, { ...parent }); // listeners not notified
         setFocusIdx(nextFocusIdx);
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   const onMerge = useCallback(
      (e: any) => {
         const newVal = e;
         change(`${focusIdx}.data.value.content`, newVal);
      },
      [change, focusIdx]
   );

   const removeRow = useCallback(
      (idx: string) => {
         let nextFocusIdx = focusIdx;
         const values = cloneDeep(getState().values) as IEmailTemplate;

         const block = getValueByIdx(values, idx);
         if (!block) {
            message.warning("Invalid block");
            return;
         }
         const parentIdx = getParentIdx(idx)!;
         const tableIdx = getParentIdx(parentIdx)!;
         const parent = get(values, getParentIdx(idx) || "") as IBlockData | null;
         const table = get(values, tableIdx || "") as IBlockData | null;

         const blockIndex = getIndexByIdx(idx);
         const parentbockIdex = getIndexByIdx(parentIdx);
         if (!parentIdx || !parent) {
            if (block.type === BasicType.PAGE) {
               message.warning("Page node can not remove");
               return;
            }
            message.warning("Invalid block");
            return;
         }
         if (blockIndex !== parent.children.length - 1) {
            nextFocusIdx = idx;
         } else {
            nextFocusIdx = parentIdx;
         }

         if (table && table.children.length > 1) {
            table?.children.splice(table?.children.length - 1, 1);
            change(tableIdx, { ...table });
            setFocusIdx(nextFocusIdx);
         }
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   const removeColumn = useCallback(
      (idx: string) => {
         let nextFocusIdx = focusIdx;
         const values = cloneDeep(getState().values) as IEmailTemplate;

         const block = getValueByIdx(values, idx);
         if (!block) {
            message.warning("Invalid block");
            return;
         }
         const parentIdx = getParentIdx(idx)!;
         const tableIdx = getParentIdx(parentIdx)!;
         const parent = get(values, getParentIdx(idx) || "") as IBlockData | null;
         const table = get(values, tableIdx || "") as IBlockData | null;

         const blockIndex = getIndexByIdx(idx);
         if (!parentIdx || !parent) {
            if (block.type === BasicType.PAGE) {
               message.warning("Page node can not remove");
               return;
            }
            message.warning("Invalid block");
            return;
         }
         if (blockIndex !== parent.children.length - 1) {
            nextFocusIdx = idx;
         } else {
            nextFocusIdx = parentIdx;
         }

         table?.children.forEach((item, idx) => {
            if (item.children.length > 1) {
               item.children.splice(item.children.length - 1, 1);
            }
         });

         change(tableIdx, { ...table });
         setFocusIdx(nextFocusIdx);
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   return (
      <AttributesPanel>
         <Stack vertical>
            {/* <Row>
               <Col span={8}>
                  <h3>Column</h3>
               </Col>
               <Col span={4}>
                  <h3 onClick={() => removeColumn(focusIdx)}>
                     <MinusCircleOutlined />
                  </h3>
               </Col>
               <Col span={4}>
                  <h3 onClick={() => addColumn()}>
                     <PlusCircleOutlined />
                  </h3>
               </Col>
            </Row>
            <Row>
               <Col span={8}>
                  <h3>Row</h3>
               </Col>
               <Col span={4}>
                  <h3 onClick={() => removeRow(focusIdx)}>
                     <MinusCircleOutlined />
                  </h3>
               </Col>
               <Col span={4}>
                  <h3 onClick={() => addRow()}>
                     <PlusCircleOutlined />
                  </h3>
               </Col>
            </Row> */}

            {mergeTags && (
               <Tooltip
                  color="#fff"
                  placement="bottom"
                  title={<MergeTags value="" type="table" onChange={(val) => onMerge(val)} table={true} />}
                  getPopupContainer={getPopoverMountNode}
               >
                  <Button size="small" title="Merge tag" icon={<IconFont iconName="icon-merge-tags" />} />
               </Tooltip>
            )}
            <TextAreaField label="Content" name={`${focusIdx}.data.value.content`} inline />
            <Color />
            <FontSize />
            <LineHeight />
            <FontWeight />
            <FontFamily />
            <BackgroundColor />
            <Padding title="Padding" attributeName="padding" />
         </Stack>
      </AttributesPanel>
   );
}
