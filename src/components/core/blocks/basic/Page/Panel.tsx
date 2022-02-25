import React, { useContext, useState } from "react";
import { Stack } from "@/components/UI/Stack";
import { ColorPickerField, TextAreaField, TextField, SelectField } from "@/components/core/Form";
import { Checkbox } from "antd";
import { Input, Select, Row, Col } from "antd";
import { Help } from "@/components/UI/Help";
import { TextStyle } from "@/components/UI/TextStyle";
import { AddFont } from "@/components/core/Form/AddFont";
import { useFocusIdx } from "@/hooks/useFocusIdx";
import { AttributesPanelWrapper } from "@/components/core/wrapper/AttributesPanelWrapper";
import { Collapse } from "antd";
import { Margin } from "@/components/EmailEditor/components/ConfigurationPanel/components/AttributesManager/components/Margin";
import { usePageFormat } from "@/hooks/usePageFormat";

const pageOptions = [
   {
      value: "A4",
      label: "A4",
   },
   {
      value: "Letter",
      label: "Letter",
   },
   {
      value: "own_dimension",
      label: "Own dimensions",
   },
];

const { Option } = Select;

export function Panel() {
   const { focusIdx } = useFocusIdx();
   const { pageFormat, ownDimension, setOwnDimension, orientation, setOrientation } = usePageFormat();

   const [ownVal, setOwnVal] = useState(false);

   if (!focusIdx) return null;

   const onDimensionChange = (e) => {
      setOwnDimension({ ...ownDimension, [e.target.name]: e.target.value });
   };

   return (
      <AttributesPanelWrapper style={{ padding: 0 }}>
         <Stack.Item fill>
            <Collapse defaultActiveKey={["0", "1"]}>
               <Collapse.Panel key="0" header="Layout Setting">
                  <Stack vertical spacing="tight">
                     {/* <TextField label="Width" name={`${focusIdx}.attributes.width`} inline /> */}
                     <SelectField
                        //style={{ width: 120 }}
                        label="Page size"
                        name={`${focusIdx}.attributes.pageSize`}
                        options={pageOptions}
                        inline
                        pageSelect={true}
                        disabled={ownVal}
                     />

                     <Row>
                        <Col span={6}>
                           <label>Orientation</label>
                        </Col>
                        <Col span={13} offset={1}>
                           <Select value={orientation} onChange={(val) => setOrientation(val)}>
                              <Option value="portrait">Portrait</Option>
                              <Option value="landscape">Landscape</Option>
                           </Select>
                        </Col>
                     </Row>

                     {pageFormat === "own_dimension" && (
                        <Row>
                           <Col span={7}>
                              <Input onChange={onDimensionChange} value={ownDimension.width} name="width" />
                           </Col>
                           <Col span={7} offset={1}>
                              <Input onChange={onDimensionChange} value={ownDimension.height} name="height" />
                           </Col>
                           <Col span={7} offset={1}>
                              <Select value={ownDimension.unit} onChange={(val) => setOwnDimension({ ...ownDimension, unit: val })}>
                                 <Option value="mm">mm</Option>
                                 <Option value="inch">inch</Option>
                              </Select>
                           </Col>
                        </Row>
                     )}

                     <Stack vertical spacing="tight">
                        <Margin />
                     </Stack>
                  </Stack>
               </Collapse.Panel>
               <Collapse.Panel key="1" header="Theme Setting">
                  <Stack vertical spacing="tight">
                     <Stack wrap={false}>
                        <Stack.Item fill>
                           <TextField label="Font family" quickchange name={`${focusIdx}.data.value.font-family`} />
                        </Stack.Item>
                        <Stack.Item fill>
                           <TextField label="Font size" quickchange name={`${focusIdx}.data.value.font-size`} />
                        </Stack.Item>
                     </Stack>
                     <Stack wrap={false}>
                        <Stack.Item fill>
                           <ColorPickerField label="Text color" name={`${focusIdx}.data.value.text-color`} />
                        </Stack.Item>
                        <Stack.Item fill>
                           <TextField label="Line height" quickchange name={`${focusIdx}.data.value.line-height`} />
                        </Stack.Item>
                     </Stack>

                     <Stack wrap={false}>
                        <ColorPickerField label="Background color" name={`${focusIdx}.attributes.background-color`} />
                        <ColorPickerField label="Content background color" name={`${focusIdx}.data.value.content-background-color`} />
                     </Stack>
                     <TextAreaField label="User style" name={`${focusIdx}.data.value.user-style.content`} />
                     <AddFont />
                  </Stack>
               </Collapse.Panel>
            </Collapse>
         </Stack.Item>
      </AttributesPanelWrapper>
   );
}
