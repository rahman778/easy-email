import { Panel } from "./Panel";
import { IBlockData } from "@/typings";
import { BasicType } from "@/constants";
import { createBlock } from "@/utils/createBlock";
import { Wrapper } from "../Wrapper";
import { merge } from "lodash";

export type IPage = IBlockData<
   {
      "background-color"?: string;
      width?: string;
      pageSize: string;
      marginTop: string;
      marginBottom: string;
      marginLeft: string;
      marginRight: string;
   },
   {
      breakpoint?: string;
      headAttributes: string;
      fonts?: { name: string; href: string }[];
      headStyles?: {
         content?: string;
         inline?: "inline";
      }[];
      responsive?: boolean;
      "font-family": string;
      "font-size": string;
      "line-height": string;
      "text-color": string;
      "user-style"?: {
         content?: string;
         inline?: "inline";
      };
      "content-background-color"?: string;
   }
>;

export const Page = createBlock<IPage>({
   name: "Page",
   type: BasicType.PAGE,
   Panel,
   create: (payload) => {
      const defaultData: IPage = {
         type: BasicType.PAGE,
         data: {
            value: {
               //breakpoint: '480px',
               headAttributes: "",
               "font-size": "14px",
               "line-height": "1.7",
               headStyles: [],
               fonts: [],
               //responsive: true,
               "font-family": "lucida Grande,Verdana,Microsoft YaHei",
               "text-color": "#000000",
            },
         },
         attributes: {
            "background-color": "#fff",
            //width: "auto",
            pageSize: "A4",
            marginTop: "20px",
            marginBottom: "20px",
            marginLeft: "20px",
            marginRight: "20px",
         },
         children: [Wrapper.create()],
      };
      return merge(defaultData, payload);
   },
   validParentType: [],
});
