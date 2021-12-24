import createSliceState from "./common/createSliceState";
export default createSliceState({
   name: "pageData",
   initialState: { width: 595, height: 842 },
   reducers: {
      add: (state, action) => {
         switch (action.payload) {
            case "A4":
               return (state = { width: 595, height: 842 });
            case "Letter":
               return (state = { width: 612, height: 792 });
            default:
               return (state = { width: 595, height: 842 });
         }
      },
   },
   effects: {},
});
