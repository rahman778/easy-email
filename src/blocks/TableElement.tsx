import { omit } from 'lodash';
import { BasicType } from '@/constants';
import { RecursivePartial } from '@/typings';
import React from 'react';
import { ITableElement } from '@/components/core/blocks/basic/TableElement';
import MjmlBlock from '@/components/core/MjmlBlock';

export type TableElementProps = RecursivePartial<
  ITableElement['data']
> &
  RecursivePartial<ITableElement['attributes']> & {
    children?: JSX.Element | JSX.Element[] | string;
  };

export function TableElement(props: TableElementProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children'])}
      value={props.value}
      type={BasicType.TABLE_ELEMENT}
    >
      {props.children}
    </MjmlBlock>
  );
}
