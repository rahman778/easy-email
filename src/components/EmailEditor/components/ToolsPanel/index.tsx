import { Stack } from "@/components/UI/Stack";
import React from "react";
import { RedoOutlined, UndoOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useBlock } from "@/hooks/useBlock";

export function ToolsPanel({ onPrint, activeTab }) {
   const { redo, undo, redoable, undoable } = useBlock();

   return (
      <Stack>
         <Tooltip title="undo">
            <Button icon={<PrinterOutlined />} disabled={activeTab !== "PC"} onClick={onPrint}>
               Print
            </Button>
         </Tooltip>
         <Tooltip title="undo">
            <Button disabled={!undoable} icon={<UndoOutlined onClick={undo} />} />
         </Tooltip>
         <Tooltip title="Redo">
            <Button disabled={!redoable} icon={<RedoOutlined />} onClick={redo} />
         </Tooltip>
         <Stack.Item />
      </Stack>
   );
}
