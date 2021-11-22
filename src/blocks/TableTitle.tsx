import { omit } from 'lodash';
import { BasicType } from '@/constants';
import { RecursivePartial } from '@/typings';
import React from 'react';
import { ITableTitle } from '@/components/core/blocks/basic/TableTitle';
import MjmlBlock from '@/components/core/MjmlBlock';

export type TableTitleProps = RecursivePartial<ITableTitle['data']> &
  RecursivePartial<ITableTitle['attributes']> & {
    children?: JSX.Element | JSX.Element[] | string;
  };

export function TableTitle(props: TableTitleProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children'])}
      value={props.value}
      type={BasicType.TABLE_TITLE}
    >
      {props.children}
    </MjmlBlock>
  );
}
