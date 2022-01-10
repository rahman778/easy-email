import { IframeComponent } from "@/components/UI/IframeComponent";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useDomScrollHeight } from "@/hooks/useDomScrollHeight";
import { useActiveTab } from "@/hooks/useActiveTab";
import { PreviewEmail } from "../PreviewEmail";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { useEditorContext } from "@/hooks/useEditorContext";

export function DesktopEmailPreview({ printRef }) {
   const { pageData } = useEditorContext();
   const { scrollHeight } = useDomScrollHeight();
   const { activeTab } = useActiveTab();

   const [isTagIcluded, setIsTagIcluded] = useState(false);

   const { mergeData, selectedFormat: dimension } = useContext(EditorPropsContext);

   const [ref, setRef] = useState<HTMLDivElement | null>(null);

   useEffect(() => {
      const container = ref;
      if (container) {
         container.scrollTo(0, scrollHeight.current);
      }
   }, [activeTab, ref, scrollHeight]);

   useEffect(() => {
      const res = findItemNested(pageData.children, "{{", "children");

      setIsTagIcluded(res);
   }, [pageData]);

   const findItemNested = (arr, itemId, nestingKey) =>
      arr.reduce((a, item) => {
         if (a) return a;
         if (item.data.value?.content?.includes("{{")) return true;
         if (item["children"]) return findItemNested(item["children"], itemId, nestingKey);
      }, false);

   const onScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
         const target = event.target as HTMLDivElement;
         scrollHeight.current = target.scrollTop;
      },
      [scrollHeight]
   );

   return (
      <div
         style={{
            height: "100%",
         }}
      >
         <IframeComponent height="100%" width="100%" style={{ border: "none", overflow: "hidden" }}>
            <div
               onScroll={onScroll}
               ref={setRef}
               style={{
                  height: "100%",
                  overflow: "auto",
                  padding: "20px 0px",
                  margin: "auto",
                  boxSizing: "border-box",
               }}
            >
               <div ref={printRef} style={{ width: dimension.width }}>
                  {isTagIcluded ? (
                     mergeData?.map((data, index) => <PreviewEmail scroll index={index} data={data} />)
                  ) : (
                     <PreviewEmail scroll index={0} data={[]} />
                  )}
               </div>
            </div>
         </IframeComponent>
      </div>
   );
}
