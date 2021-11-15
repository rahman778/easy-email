import { Panel } from './Panel';
import { IBlockData } from '@/typings';
import { BasicType } from '@/constants';
import { createBlock } from '@/utils/createBlock';
import { merge } from 'lodash';

export type ITable = IBlockData<
  {
    align?: string;
    border?:string;
  },
  {
    contents: Array<{



    }>;
    headers: Array<{
      text : string


    }>;
  }
>;


export const Table = createBlock<ITable>({
  name: 'Table',
  type: BasicType.TABLE,
  Panel,
  create: (payload) => {
    const defaultData: ITable = {
      type: BasicType.TABLE,
      data: {
        value: {
          contents: [
              ["001", "10/10/2010", "Pending"],
              ["002",  "10/10/2010", "Pending"],
            ],
          headers: [
            {text : "id"},
            {text : "date"},
            {text : "status"}
          ]
        },
      },
      attributes: {
        align : 'center',
        border: '2px solid #ccc'
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN],
});
