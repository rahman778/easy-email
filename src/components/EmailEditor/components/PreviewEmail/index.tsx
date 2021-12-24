import React, { useContext, useEffect, useState } from "react";

import { transformToMjml } from "@/utils/transformToMjml";
import mjml from "mjml-browser";
import { useEditorContext } from "@/hooks/useEditorContext";
import { EditorPropsContext } from "@/components/Provider/PropsProvider";
import { cloneDeep } from "lodash";
import { useAppSelector } from "@example/hooks/useAppSelector";

export function PreviewEmail(props) {
   const { index, data, scroll } = props;
   const { pageData } = useEditorContext();
   const { onBeforePreview, mergeTags, mergeData } = useContext(EditorPropsContext);
   const [errMsg, setErrMsg] = useState("");
   const [html, setHtml] = useState("");
   const dimension = useAppSelector("pageDimension");

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
   }, [mergeTags, onBeforePreview, pageData, mergeData]);

   if (errMsg) {
      return <div style={{ textAlign: "center", fontSize: 24, color: "red" }}>{errMsg}</div>;
   }

   return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
