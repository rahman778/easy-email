import { Panel } from './Panel';
import { IBlock, IBlockData } from '@/typings';
import { BasicType } from '@/constants';
import { createBlock } from '@/utils/createBlock';
import { merge } from 'lodash';

export type ITableTitle = IBlockData<
  {
    color?: string;
    'background-color'?: string;
    'font-size'?: string;
    'font-family'?: string;
    padding?: string;
    border?: string;
  },
  {}
>;

export const TableTitle: IBlock = createBlock({
  name: 'Table title',
  type: BasicType.TABLE_TITLE,
  Panel,
  create: (payload) => {
    const defaultData: ITableTitle = {
      type: BasicType.TABLE_TITLE,
      data: {
        value: {
          content: 'Why use an accordion?',
        },
      },
      attributes: {
        'font-size': '13px',
        padding: '16px 16px 16px 16px',
        border: '1px solid #d9d9d9',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.TABLE],
});
