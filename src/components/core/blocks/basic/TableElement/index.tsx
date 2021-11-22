import { Panel } from './Panel';
import { IBlockData } from '@/typings';
import { BasicType } from '@/constants';
import { createBlock } from '@/utils/createBlock';
import { merge } from 'lodash';
export type ITableElement = IBlockData<
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

export const TableElement = createBlock<ITableElement>({
  name: 'Table element',
  type: BasicType.TABLE_ELEMENT,
  Panel,
  create: (payload) => {
    const defaultData: ITableElement = {
      type: BasicType.TABLE_ELEMENT,
      data: {
        value: {},
      },
      attributes: {
        'icon-align': 'middle',
        'icon-height': '32px',
        'icon-width': '32px',

        'icon-position': 'right',
        padding: '10px 25px 10px 25px',
        border: '1px solid #d9d9d9',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.TABLE],
});
