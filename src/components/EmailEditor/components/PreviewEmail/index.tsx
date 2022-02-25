import React, { useContext, useEffect, useState } from "react";

import { transformToMjml } from "@/utils/transformToMjml";
import mjml from "mjml-browser";
import { useEditorContext } from "@/hooks/useEditorContext";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { cloneDeep } from "lodash";
import { usePageFormat } from "@/hooks/usePageFormat";

export function PreviewEmail(props) {
   const { index, data, scroll } = props;
   const { pageData } = useEditorContext();
   const { onBeforePreview, mergeTags, mergeData } = useContext(EditorPropsContext);
   const { pageDimesions: dimension } = usePageFormat();
   const [errMsg, setErrMsg] = useState("");
   const [html, setHtml] = useState("");

   useEffect(() => {
      let injectData = pageData;

      if (onBeforePreview) {
         try {
            injectData = onBeforePreview(cloneDeep(pageData), data);

            setErrMsg("");
         } catch (error: any) {
            setErrMsg(error?.message || error);
         }
      }

      console.log("injectDataP", injectData);

      const parseHtml = mjml(
         transformToMjml({
            data: injectData,
            mode: "production",
            context: injectData,
            preview: true,
            mergeData: mergeData,
            dimension: dimension,
         })
      ).html;
      setHtml(parseHtml);
   }, [mergeTags, onBeforePreview, pageData, mergeData, dimension]);

   console.log("mergeDataP", mergeData);

   if (errMsg) {
      return <div style={{ textAlign: "center", fontSize: 24, color: "red" }}>{errMsg}</div>;
   }

   return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
