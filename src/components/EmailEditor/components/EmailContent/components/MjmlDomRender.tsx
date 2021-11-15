import React, { useContext, useEffect, useMemo, useState } from 'react';
import { transformToMjml } from '@/utils/transformToMjml';
import mjml from 'mjml-browser';
import {
  getPageIdx,
} from '@/utils/block';
import { cloneDeep, isEqual } from 'lodash';
import { IPage } from '@/components/core/blocks/basic/Page';
import { useEditorContext } from '@/hooks/useEditorContext';
import { HtmlStringToReactNodes } from '@/utils/HtmlStringToReactNodes';
import { createPortal } from 'react-dom';
import { EditorPropsContext } from '@/components/Provider/PropsProvider';

export function MjmlDomRender() {
  const { pageData: content } = useEditorContext();
  const [pageData, setPageData] = useState<IPage | null>(null);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { dashed } = useContext(EditorPropsContext);
  const pageMaxWidth = content.attributes.width || '600px';

  let dimension = { width: "200px", height: "200px" };
   if (content.attributes.pageSize === "A4") {
      dimension = { width: "500px", height: "600px" };
   } else if (content.attributes.pageSize === "letter") {
      dimension = { width: "600px", height: "800px" };
   }

  useEffect(() => {
    if (!isEqual(content, pageData)) {
      setPageData(cloneDeep(content));
    }
  }, [content, pageData]);

  const html = useMemo(() => {
    if (!pageData) return '';

    const renderHtml = mjml(
      transformToMjml({
        data: pageData,
        idx: getPageIdx(),
        context: pageData,
        mode: 'testing',
        preview:false
      })
    ).html;
    return renderHtml;
  }, [pageData]);;

  return useMemo(() => {
    return (
      <div
        data-dashed={dashed}
        ref={setRef}
        style={{
          width: dimension.width,
          padding: '40px 0px',
          margin: 'auto',
          outline: 'none',
          position: 'relative'
        }}
        role='tabpanel'
        tabIndex={0}
      >
        {ref && createPortal(HtmlStringToReactNodes(html), ref)}
      </div>
    );
  }, [dashed, dimension, ref, html]);
}
