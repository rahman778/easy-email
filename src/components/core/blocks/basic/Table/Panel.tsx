import React, { useContext, useCallback } from "react";
import { Padding } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Padding";
import { Stack } from "@/components/UI/Stack";
import { TextAlign } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/TextAlign";
import { Border } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Border";
import { Color } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Color";
import { Width } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Width";
import { ContainerBackgroundColor } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/ContainerBackgroundColor";
import { FontSize } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontSize";
import { FontStyle } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontStyle";
import { FontFamily } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/FontFamliy";
import { AttributesPanel } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/AttributesPanel";
import { getIndexByIdx, getParentIdx, getValueByIdx } from "@/utils/block";

import { useFocusIdx } from "@/hooks/useFocusIdx";
import { useBlock } from "@/hooks/useBlock";
import { BasicType, BlockType, FIXED_CONTAINER_ID } from "@/constants";
import { IBlockData, IEmailTemplate } from "@/typings";
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
   const { focusIdx, setFocusIdx } = useFocusIdx();

   const addRow = () => {
      const parent = get(values, focusIdx || "") as IBlockData | null;

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
         parentIdx: focusIdx,
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

         parent.children.splice(parent.children.length, 0, child);
         change(parentIdx, { ...parent }); // listeners not notified
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   const addColumn = () => {
      const parentIdx = getParentIdx(focusIdx)!;

      addColumnBlock({
         type: BasicType.TABLE_TEXT,
         parentIdx: focusIdx,
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
      },
      [change, focusIdx, getState, setFocusIdx]
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

         const parent = get(values, focusIdx || "") as IBlockData | null;

         const blockIndex = getIndexByIdx(idx);
         if (!focusIdx || !parent) {
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
            nextFocusIdx = focusIdx;
         }

         if (parent && parent.children.length > 1) {
            parent?.children.splice(parent?.children.length - 1, 1);
            change(focusIdx, { ...parent });
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
         //  const parentIdx = getParentIdx(idx)!;

         const parent = get(values, focusIdx || "") as IBlockData | null;

         const blockIndex = getIndexByIdx(idx);
         if (!focusIdx || !parent) {
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
            nextFocusIdx = focusIdx;
         }

         parent?.children.forEach((item, idx) => {
            if (item.children.length > 1) {
               item.children.splice(item.children.length - 1, 1);
            }
         });

         change(focusIdx, { ...parent });
      },
      [change, focusIdx, getState, setFocusIdx]
   );

   return (
      <AttributesPanel>
         <Stack vertical>
            <Row>
               <Col span={8}>
                  <h6>Column</h6>
               </Col>
               <Col span={4}>
                  <h6 onClick={() => removeColumn(focusIdx)}>
                     <MinusCircleOutlined />
                  </h6>
               </Col>
               <Col span={4}>
                  <h6 onClick={() => addColumn()}>
                     <PlusCircleOutlined />
                  </h6>
               </Col>
            </Row>
            <Row>
               <Col span={8}>
                  <h6>Row</h6>
               </Col>
               <Col span={4}>
                  <h6 onClick={() => removeRow(focusIdx)}>
                     <MinusCircleOutlined />
                  </h6>
               </Col>
               <Col span={4}>
                  <h6 onClick={() => addRow()}>
                     <PlusCircleOutlined />
                  </h6>
               </Col>
            </Row>
            <Color />
            <ContainerBackgroundColor />
            <Padding />
            <Width />
            <FontFamily />
            <FontSize />
            <FontStyle />
            <TextAlign />
            <Border />
         </Stack>
      </AttributesPanel>
   );
}
