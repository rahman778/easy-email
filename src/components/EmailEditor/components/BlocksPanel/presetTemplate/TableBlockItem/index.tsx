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
      children: [
        {
          type: 'table-element',
          data: {
            value: {},
          },
          attributes: {
            'icon-align': 'middle',
            'icon-height': '32px',
            'icon-width': '32px',
            'icon-position': 'right',
            padding: '10px 25px 10px 25px',
          },
          children: [
            {
              type: 'table-title',
              data: {
                value: {
                  content: 'Why use an table?',
                },
              },
              attributes: {
                'font-size': '13px',
                padding: '16px 16px 16px 16px',
              },
              children: [],
            },
            {
              type: 'table-text',
              data: {
                value: {
                  content:
                    '<span style="line-height:20px">\n                Because emails with a lot of content are most of the time a very bad experience on mobile, mj-table comes handy when you want to deliver a lot of information in a concise way.\n              </span>',
                },
              },
              attributes: {
                'font-size': '13px',
                padding: '16px 16px 16px 16px',
                'line-height': '1',
              },
              children: [],
            },
          ],
        },
        {
          type: 'table-element',
          data: {
            value: {},
          },
          attributes: {
            'icon-align': 'middle',
            'icon-height': '32px',
            'icon-width': '32px',
            'icon-position': 'right',
            padding: '10px 25px 10px 25px',
          },
          children: [
            {
              type: 'table-title',
              data: {
                value: {
                  content: 'How it works',
                },
              },
              attributes: {
                'font-size': '13px',
                padding: '16px 16px 16px 16px',
              },
              children: [],
            },
            {
              type: 'table-text',
              data: {
                value: {
                  content:
                    '<span style="line-height:20px">\n                Content is stacked into tabs and users can expand them at will. If responsive styles are not supported (mostly on desktop clients), tabs are then expanded and your content is readable at once.\n              </span>',
                },
              },
              attributes: {
                'font-size': '13px',
                padding: '16px 16px 16px 16px',
                'line-height': '1',
              },
              children: [],
            },
          ],
        },
      ],
    },
  },
];