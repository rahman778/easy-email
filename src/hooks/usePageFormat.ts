import { PageContext } from "@/components/Provider/PageProvider";
import { useContext } from "react";

export function usePageFormat() {
   const { pageFormat, setPageFormat, pageDimesions, ownDimension, setOwnDimension, orientation, setOrientation } = useContext(PageContext);
   return {
      pageFormat,
      setPageFormat,
      pageDimesions,
      ownDimension,
      setOwnDimension,
      orientation,
      setOrientation,
   };
}
