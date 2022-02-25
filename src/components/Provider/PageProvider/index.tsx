import React, { useState, useMemo } from "react";

export const PageContext = React.createContext<{
   pageFormat: string;
   setPageFormat: React.Dispatch<React.SetStateAction<string>>;
   orientation: string;
   setOrientation: React.Dispatch<React.SetStateAction<string>>;
   pageDimesions: any;
   ownDimension: any;
   setOwnDimension: React.Dispatch<React.SetStateAction<any>>;
}>({
   pageFormat: "A4",
   setPageFormat: () => {},
   orientation: "portrait",
   setOrientation: () => {},
   pageDimesions: {},
   ownDimension: {},
   setOwnDimension: () => {},
});

export const PageProvider: React.FC<{}> = (props) => {
   const [pageFormat, setPageFormat] = useState("A4");
   const [orientation, setOrientation] = useState("portrait");
   const [ownDimension, setOwnDimension] = useState({ width: 0, height: 0, unit: "mm" });

   const pageValues = useMemo(() => {
      switch (pageFormat) {
         case "A4":
            return { width: 595, height: 842 };
         case "Letter":
            return { width: 612, height: 792 };
         case "own_dimension":
            if (ownDimension.unit === "mm") {
               return { width: ownDimension.width * 2.8, height: ownDimension.height * 2.8 };
            }
            if (ownDimension.unit === "inch") {
               return { width: ownDimension.width * 72, height: ownDimension.height * 72 };
            }

         default:
            return { width: 595, height: 842 };
      }
   }, [pageFormat, ownDimension]);

   let pageDimesions =
      orientation === "portrait" ? { width: pageValues.width, height: pageValues.height } : { width: pageValues.height, height: pageValues.width };

   return (
      <PageContext.Provider
         value={{
            pageFormat,
            setPageFormat,
            orientation,
            setOrientation,
            pageDimesions,
            ownDimension,
            setOwnDimension,
         }}
      >
         {props.children}
      </PageContext.Provider>
   );
};
