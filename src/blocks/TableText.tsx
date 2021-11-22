import { omit } from 'lodash';
import { BasicType } from '@/constants';
import { RecursivePartial } from '@/typings';
import React from 'react';
import { ITableText } from '@/components/core/blocks/basic/TableText';
import MjmlBlock from '@/components/core/MjmlBlock';

export type TableTextProps = RecursivePartial<ITableText['data']> &
  RecursivePartial<ITableText['attributes']> & {
    children?: JSX.Element | JSX.Element[] | string;
  };

export function TableText(props: TableTextProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children'])}
      value={props.value}
      type={BasicType.TABLE_TEXT}
    >
      {props.children}
    </MjmlBlock>
  );
}
