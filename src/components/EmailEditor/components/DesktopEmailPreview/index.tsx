import { IframeComponent } from "@/components/UI/IframeComponent";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useDomScrollHeight } from "@/hooks/useDomScrollHeight";
import { useActiveTab } from "@/hooks/useActiveTab";
import { PreviewEmail } from "../PreviewEmail";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { useEditorContext } from "@/hooks/useEditorContext";
import { usePageFormat } from "@/hooks/usePageFormat";

export function DesktopEmailPreview({ printRef }) {
   const { pageData } = useEditorContext();
   const { scrollHeight } = useDomScrollHeight();
   const { activeTab } = useActiveTab();

   const [isTagIcluded, setIsTagIcluded] = useState(false);

   const { mergeData } = useContext(EditorPropsContext);
   const { pageDimesions: dimension } = usePageFormat();

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
         let words = item.data.value?.content?.split("{{PAGE_");
         let isParamsIncluded = words?.find((a) => a.includes("{{"));
         //let isPageIncluded = item.data.value?.content?.includes("{{PAGE_");

         if (a) return a;
         if (isParamsIncluded) return true;
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
                     mergeData?.map((data, index) => {
                        const obj = Object.assign({}, data);
                        obj["PAGE_NUMBER"] = index + 1;
                        obj["PAGE_COUNT"] = mergeData?.length;
                        return <PreviewEmail scroll index={index} data={obj} />;
                     })
                  ) : (
                     <PreviewEmail scroll index={0} data={mergeData && mergeData[0]} />
                  )}
               </div>
            </div>
         </IframeComponent>
      </div>
   );
}
