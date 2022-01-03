import { DesktopOutlined, TabletOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Layout, Tabs, Popover } from "antd";
import React, { useMemo, useContext } from "react";
import { ConfigurationPanel } from "./components/ConfigurationPanel";
import { Stack } from "../UI/Stack";
import { TextStyle } from "../UI/TextStyle";
import { ToolsPanel } from "./components/ToolsPanel";
import "./index.scss";
import styles from "./index.module.scss";
import { useEditorContext } from "@/hooks/useEditorContext";
import { createPortal } from "react-dom";
import { FIXED_CONTAINER_ID } from "@/constants";
import { useActiveTab } from "@/hooks/useActiveTab";
import { ActiveTabKeys } from "../Provider/BlocksProvider";
import { DesktopEmailPreview } from "./components/DesktopEmailPreview";
import { MobileEmailPreview } from "./components/MobileEmailPreview";
import { EditEmailPreview } from "./components/EditEmailPreview";
import { BlockLayerManager } from "./components/ConfigurationPanel/components/BlockLayerManager";
import jsPDF from "jspdf";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { EditorPropsContext } from "../Provider/PropsProvider";
export interface EmailEditorProps {
   height: string | number;
}

//
(window as any).global = window;

const TabPane = Tabs.TabPane;

export const EmailEditor = (props: EmailEditorProps) => {
   const { height: containerHeight } = props;
   const { activeTab, setActiveTab } = useActiveTab();
   const { pageData } = useEditorContext();
   const { selectedFormat: dimension, parameters } = useContext(EditorPropsContext);

   console.log(`parameters`, parameters);

   const printRef = React.createRef();

   const backgroundColor = pageData.attributes["background-color"];

   const fixedContainer = useMemo(() => {
      return createPortal(<div id={FIXED_CONTAINER_ID} />, document.body);
   }, []);

   const onPrint = () => {
      const string = printRef.current as any;

      let pdf = new jsPDF({
         orientation: "p",
         unit: "pt",
         format: [dimension.width, dimension.height],
         putOnlyUsedFonts: true,
         precision: 1,
      });

      pdf.html(string, {
         autoPaging: true,
         callback: function (pdf) {
            //pdf.save("pdf");
            window.open(pdf.output("bloburl"));
         },
      });
   };

   return useMemo(
      () => (
         <Layout>
            <div
               style={{
                  display: "flex",
                  width: "100vw",
                  overflow: "hidden",
               }}
            >
               {/* <Layout.Sider
            theme='light'
            width={60}
            style={{ border: '1px solid #f0f0f0' }}
          >
            <Stack vertical alignment='center' distribution='center'>
              <Stack.Item />
              <BlocksPanel>
                <IconFont
                  onClick={onTogglePanel}
                  iconName='icon-add'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    boxShadow:
                      '0 0 12px -3px rgb(0 0 0 / 20%), 0 2px 7px -1px rgb(0 0 0 / 14%), 0 2px 4px -1px rgb(0 0 0 / 20%)',
                    fontSize: 20,
                  }}
                />
              </BlocksPanel>
            </Stack>
          </Layout.Sider> */}
               <Layout.Sider style={{ height: containerHeight, borderLeft: "none" }} theme="light" width={300}>
                  <Tabs
                     tabBarStyle={{
                        paddingLeft: 20,
                        marginBottom: 0,
                        backgroundColor: "#fff",
                     }}
                     className={styles.customScrollBar}
                     style={{ height: "100%", overflow: "auto", borderLeft: "none" }}
                     defaultActiveKey="Blocks"
                  >
                     <TabPane key="Blocks" tab="Blocks" style={{ borderLeft: "none" }}>
                        <ComponentsPanel />
                     </TabPane>
                     <TabPane key="Layout" tab="Layout">
                        <BlockLayerManager />
                     </TabPane>
                     <TabPane key="Parameters" tab="Parameters">
                        {parameters}
                     </TabPane>
                  </Tabs>
               </Layout.Sider>

               <Layout style={{ height: containerHeight }}>
                  <Card
                     bodyStyle={{
                        backgroundColor: backgroundColor,

                        padding: 0,
                     }}
                  >
                     <div
                        id="centerEditor"
                        style={{
                           backgroundColor: backgroundColor,
                           height: containerHeight,
                        }}
                     >
                        <Tabs
                           activeKey={activeTab}
                           tabBarStyle={{
                              paddingLeft: 20,
                              marginBottom: 0,
                              backgroundColor: "#fff",
                           }}
                           onChange={setActiveTab as any}
                           tabBarExtraContent={<ToolsPanel onPrint={onPrint} activeTab={activeTab} />}
                           centered
                        >
                           <TabPane
                              tab={
                                 <Stack spacing="none">
                                    <EditOutlined />
                                    <TextStyle>Edit</TextStyle>
                                 </Stack>
                              }
                              key={ActiveTabKeys.EDIT}
                           >
                              <div
                                 style={{
                                    backgroundColor: "#E4E7EA",
                                    height: "100%",
                                    position: "relative",
                                 }}
                              >
                                 <EditEmailPreview />
                              </div>
                           </TabPane>
                           <TabPane
                              tab={
                                 <Stack spacing="none">
                                    <DesktopOutlined />
                                    <TextStyle>Preview</TextStyle>
                                 </Stack>
                              }
                              key={ActiveTabKeys.PC}
                              style={{ backgroundColor: "#E4E7EA" }}
                           >
                              {/* <EditEmailPreview/> */}
                              <DesktopEmailPreview printRef={printRef} />
                           </TabPane>
                        </Tabs>
                     </div>
                  </Card>
               </Layout>

               <Layout.Sider style={{ height: containerHeight }} theme="light" width={350}>
                  <Card
                     size="small"
                     id="rightSide"
                     style={{
                        maxHeight: "100%",
                        height: "100%",
                     }}
                     bodyStyle={{ padding: 0 }}
                     className={styles.customScrollBar}
                  >
                     <ConfigurationPanel />
                  </Card>
               </Layout.Sider>
            </div>

            {fixedContainer}
         </Layout>
      ),
      [activeTab, backgroundColor, containerHeight, fixedContainer, setActiveTab]
   );
};
