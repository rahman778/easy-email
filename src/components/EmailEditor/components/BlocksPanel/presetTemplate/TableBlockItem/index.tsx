import { ITable } from '@/components/core/blocks/basic/Table';
import { BlockMaskWrapper } from '@/components/core/wrapper/BlockMaskWrapper';
import { Stack } from '@/components/UI/Stack';
import { TextStyle } from '@/components/UI/TextStyle';
import { BasicType } from '@/constants';
import { RecursivePartial } from '@/typings';
import React from 'react';
import { ShadowDom } from '@/components/UI/ShadowDom';

export function TableBlockItem() {
  return (
    <Stack.Item fill>
      <Stack vertical>
        {list.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={BasicType.TABLE}
              payload={item.payload}
            >
              <ShadowDom>
                <div style={{ position: 'relative' }}>
                {item.payload.data.value.contents}
                </div>
              </ShadowDom>
            </BlockMaskWrapper>
          );
        })}
      </Stack>
    </Stack.Item>
  );
}

const list = [
  {
    payload: {
      type: BasicType.TABLE,
      data: {
        value: {
          contents: [
            {text : "sd"}
          ]
        },
      },
    },
  },
  {
    payload: {
      type: BasicType.TABLE,
      data: {
        value: {
          contents: [
            {text : "sd"}
          ]
        },
      },
    },
  },
];