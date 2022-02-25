import { DesktopOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Layout, Tabs } from "antd";
import React, { useMemo, useContext, useEffect } from "react";
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
import { EditEmailPreview } from "./components/EditEmailPreview";
import { BlockLayerManager } from "./components/ConfigurationPanel/components/BlockLayerManager";
import jsPDF from "jspdf";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { EditorPropsContext } from "../Provider/PropsProvider";
import { usePageFormat } from "@/hooks/usePageFormat";
export interface EmailEditorProps {
   height: string | number;
   parameters?: any;
   editable?: boolean;
}

//
(window as any).global = window;

const TabPane = Tabs.TabPane;

export const EmailEditor = (props: EmailEditorProps) => {
   const { height: containerHeight, parameters, editable } = props;
   const { activeTab, setActiveTab } = useActiveTab();
   const { pageData } = useEditorContext();
   const { pageDimesions: dimension } = usePageFormat();

   const printRef = React.createRef();

   const backgroundColor = pageData.attributes["background-color"];

   const fixedContainer = useMemo(() => {
      return createPortal(<div id={FIXED_CONTAINER_ID} />, document.body);
   }, []);

   useEffect(() => {
      if (editable) {
         setActiveTab(ActiveTabKeys.EDIT);
      } else {
         setActiveTab(ActiveTabKeys.PC);
      }
   }, [editable]);

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
                  width: editable ? "100vw" : "calc(100vw - 650px)",
                  overflow: "hidden",
                  margin: "auto",
               }}
            >
               {editable && (
                  <Layout.Sider style={{ height: containerHeight, borderLeft: "none" }} theme="light" width={300}>
                     <Tabs
                        tabBarStyle={{
                           paddingLeft: 20,
                           marginBottom: 0,
                           backgroundColor: "#fff",
                        }}
                        className={styles.customScrollBar}
                        style={{ height: "100%", overflow: "auto", borderLeft: "none" }}
                        defaultActiveKey={"Blocks"}
                     >
                        <TabPane key="Blocks" tab="Blocks" style={{ borderLeft: "none" }}>
                           <ComponentsPanel />
                        </TabPane>
                        <TabPane key="Layout" tab="Layout">
                           <BlockLayerManager />
                        </TabPane>
                        <TabPane key="Inputs" tab="Inputs">
                           {parameters}
                        </TabPane>
                     </Tabs>
                  </Layout.Sider>
               )}

               <Layout style={{ height: containerHeight, maxWidth: "calc(100vw - 650px)" }}>
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
                              disabled={!editable}
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

               {editable && (
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
               )}
            </div>

            {fixedContainer}
         </Layout>
      ),
      [activeTab, backgroundColor, containerHeight, fixedContainer, setActiveTab]
   );
};
