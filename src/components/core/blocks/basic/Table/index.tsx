import { Panel } from './Panel';
import { IBlockData } from '@/typings';
import { BasicType } from '@/constants';
import { createBlock } from '@/utils/createBlock';
import { merge } from 'lodash';
import { TableElement } from '../TableElement';
import { TableTitle } from '../TableTitle';
import { TableText } from '../TableText';


// export type ITable = IBlockData<
//   {
//     align?: string;
//     border?:string;
//   },
//   {
//     contents: Array<{



//     }>;
//     headers: Array<{
//       text : string


//     }>;
//   }
// >;


// export const Table = createBlock<ITable>({
//   name: 'Table',
//   type: BasicType.TABLE,
//   Panel,
//   create: (payload) => {
//     const defaultData: ITable = {
//       type: BasicType.TABLE,
//       data: {
//         value: {
//           contents: [
//               ["001", "10/10/2010", "Pending"],
//               ["002",  "10/10/2010", "Pending"],
//             ],
//           headers: [
//             {text : "id"},
//             {text : "date"},
//             {text : "status"}
//           ]
//         },
//       },
//       attributes: {
//         align : 'center',
//         border: '2px solid #ccc'
//       },
//       children: [],
//     };
//     return merge(defaultData, payload);
//   },
//   validParentType: [BasicType.WRAPPER, BasicType.COLUMN],
// });

export type IAccordion = IBlockData<
  {
    'icon-width': string;
    'icon-height': string;
    'container-background-color'?: string;
    border?: string;
    padding: string;
    'inner-padding'?: string;
    'font-family'?: string;
    'icon-align'?: 'middle' | 'top' | 'bottom';
    'icon-position': 'left' | 'right';
    'icon-unwrapped-alt'?: string;
    'icon-unwrapped-url'?: string;
    'icon-wrapped-alt'?: string;
    'icon-wrapped-url'?: string;
  },
  {}
>;

export type ITable = IBlockData<
{
  'icon-width': string;
  'icon-height': string;
  'container-background-color'?: string;
  border?: string;
  padding: string;
  cellpadding:string;
  'inner-padding'?: string;
  'font-family'?: string;
  'icon-align'?: 'middle' | 'top' | 'bottom';
  'icon-position': 'left' | 'right';
  'icon-unwrapped-alt'?: string;
  'icon-unwrapped-url'?: string;
  'icon-wrapped-alt'?: string;
  'icon-wrapped-url'?: string;
},
{}
>;

export const Table = createBlock<ITable>({
  name: 'Table',
  type: BasicType.TABLE,
  Panel,
  validParentType: [BasicType.WRAPPER],
  create: (payload) => {
    const defaultData: ITable = {
      type: BasicType.TABLE,
      data: {
        value: {},
      },
      attributes: {
        'icon-height': '32px',
        'icon-width': '32px',
        'icon-align': 'middle',
        'icon-position': 'right',
        'icon-unwrapped-url': 'https://i.imgur.com/w4uTygT.png',
        'icon-wrapped-url': 'https://i.imgur.com/bIXv1bk.png',
        padding: '10px 25px 10px 25px',
        border: '1px solid #09d9d9',
        cellpadding:'40px'
      },
      children: [
        TableElement.create({
          children: [
            TableTitle.create({
              data: {
                value: {
                  content: 'Description',
                },
              },
            }),
            TableTitle.create({
              data: {
                value: {
                  content: 'Quantity',
                },
              },
            }),
            TableTitle.create({
              data: {
                value: {
                  content: 'Unit Price',
                },
              },
            }),
            TableTitle.create({
              data: {
                value: {
                  content: 'Amount',
                },
              },
            }),

          ],
        }),
        TableElement.create({
          children: [
            TableText.create({
              data: {
                value: {
                  content:
                    '',
                },
              },
            }),
            TableText.create({
              data: {
                value: {
                  content:
                    '1',
                },
              },
            }),
            TableText.create({
              data: {
                value: {
                  content:
                    '$10',
                },
              },
            }),
            TableText.create({
              data: {
                value: {
                  content:
                    '$10',
                },
              },
            }),
          ],
        }),
      ],
    };
    return merge(defaultData, payload);
  },
});
