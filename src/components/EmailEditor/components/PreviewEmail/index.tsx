import React, { useContext, useEffect, useState } from "react";

import { transformToMjml } from "@/utils/transformToMjml";
import mjml from "mjml-browser";
import { useEditorContext } from "@/hooks/useEditorContext";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { cloneDeep } from "lodash";

export function PreviewEmail(props) {
   const { index, data, scroll } = props;
   const { pageData } = useEditorContext();
   const { onBeforePreview, mergeTags, mergeData } = useContext(EditorPropsContext);
   const [errMsg, setErrMsg] = useState("");
   const [html, setHtml] = useState("");

   // function findNested(arr, id) {
   //    let found = arr.filter((node) => node.type === id);
   //    return found.length > 0 ? found : arr.some((c) => findNested(c.children, id));
   // }

   useEffect(() => {
      let injectData = pageData;

      // console.log(findNested(pageData.children, "table"));

      if (onBeforePreview) {
         try {
            injectData = onBeforePreview(cloneDeep(pageData), data);

            setErrMsg("");
         } catch (error: any) {
            setErrMsg(error?.message || error);
         }
      }
      const parseHtml = mjml(
         transformToMjml({
            data: injectData,
            mode: "production",
            context: injectData,
            preview: true,
            mergeData: mergeData,
         })
      ).html;
      setHtml(parseHtml);
   }, [mergeTags, onBeforePreview, pageData, mergeData]);

   if (errMsg) {
      return <div style={{ textAlign: "center", fontSize: 24, color: "red" }}>{errMsg}</div>;
   }

   return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
