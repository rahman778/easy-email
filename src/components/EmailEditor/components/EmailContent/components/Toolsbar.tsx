import React, { useContext, useState } from 'react';

import { getIndexByIdx, getParentIdx, getSiblingIdx } from '@/utils/block';
import { classnames } from '@/utils/classnames';
import { Form } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from 'antd';
import { EditorPropsContext } from '@/components/Provider/PropsProvider';
import { useBlock } from '@/hooks/useBlock';
import { useFocusIdx } from '@/hooks/useFocusIdx';
import { Stack } from '@/components/UI/Stack';
import {
  ImageUploaderField,
  TextAreaField,
  TextField,
} from '@/components/core/Form';
import { BlocksMap } from '@/components/core/blocks';
import { BasicType } from '@/constants';
import { IBlock } from '@/typings';

const columnBlock = BlocksMap.findBlockByType(BasicType.COLUMN);
const sectionBlock = BlocksMap.findBlockByType(BasicType.SECTION);

export function ToolsBar({ block }: { block: IBlock; }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { onAddCollection } = useContext(EditorPropsContext);
  const {
    moveBlock,
    copyBlock,
    removeBlock,
    focusBlock: focusBlockData,
    addBlock,
  } = useBlock();
  const { onUploadImage } = useContext(EditorPropsContext);
  const { focusIdx, setFocusIdx } = useFocusIdx();
  const isPage = block.type === BasicType.PAGE;

  const isVerticalBlock = columnBlock.validParentType.some((item) =>
    block.validParentType.some((p) => p === item)
  );
  const isHorizontalBlock = sectionBlock.validParentType.some((item) =>
    block.validParentType.some((p) => p === item)
  );

  const handleMoveUp = () => {
    moveBlock(focusIdx, getSiblingIdx(focusIdx, -1));
  };

  const handleMoveDown = () => {
    moveBlock(focusIdx, getSiblingIdx(focusIdx, 1));
  };

  const handleCopy: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    copyBlock(focusIdx);
  };

  const handleAddToCollection = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    removeBlock(focusIdx);
  };

  const handleSelectParent = () => {
    setFocusIdx(getParentIdx(focusIdx)!);
  };

  const handleAddRows = () => {
    if (block.type === BasicType.WRAPPER) {
      const parentIdx = getParentIdx(focusIdx)!;
      addBlock({
        type: BasicType.WRAPPER,
        parentIdx: parentIdx,
        positionIndex: getIndexByIdx(focusIdx) + 1,
        payload: {
          children: sectionBlock.create({
            children: [columnBlock.create({})],
          }),
        },
      });
    } else {
      const parentIdx = getParentIdx(focusIdx)!;
      addBlock({
        type: BasicType.SECTION,
        parentIdx: parentIdx,
        positionIndex: getIndexByIdx(focusIdx) + 1,
        payload: {
          children: [columnBlock.create({})],
        },
      });
    }
  };

  const onSubmit = (values: {
    label: string;
    helpText: string;
    thumbnail: string;
  }) => {
    if (!values.label) return;
    const uuid = uuidv4();
    onAddCollection?.({
      label: values.label,
      helpText: values.helpText,
      data: focusBlockData!,
      thumbnail: values.thumbnail,
      id: uuid,
    });
    setModalVisible(false);
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          fontSize: 14,
          zIndex: 3,
          color: '#000',
          width: '100%',
          pointerEvents: 'none',
          lineHeight: '22px',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            transform: 'translateY(-100%)',
            display: 'flex',
            // justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              color: '#ffffff',
              backgroundColor: '#1890ff',
              height: '22px',

              display: 'inline-flex',
              padding: '1px 5px',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            {block.name}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(ev) => {
              ev.preventDefault();
            }}
            style={{
              display: isPage ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <ToolItem
              width={12}
              iconName='icon-back-parent'
              onClick={handleSelectParent}
            />
            <ToolItem iconName='icon-copy' onClick={handleCopy} />
            <ToolItem
              iconName='icon-collection'
              onClick={handleAddToCollection}
            />
            <ToolItem iconName='icon-delete' onClick={handleDelete} />
          </div>
        </div>
        <Form
          initialValues={{ label: '', helpText: '', thumbnail: '' }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Modal
              zIndex={2000}
              visible={modalVisible}
              title='Add to collection'
              onOk={() => handleSubmit()}
              onCancel={() => setModalVisible(false)}
            >
              <Stack vertical>
                <Stack.Item />
                <TextField
                  label='Title'
                  name='label'
                  validate={(val: string) => {
                    if (!val) return 'Title required!';
                    return undefined;
                  }}
                />
                <TextAreaField label='Description' name='helpText' />
                <ImageUploaderField
                  label='Thumbnail'
                  name={'thumbnail'}
                  uploadHandler={onUploadImage}
                  validate={(val: string) => {
                    if (!val) return 'Thumbnail required!';
                    return undefined;
                  }}
                />
              </Stack>
            </Modal>
          )}
        </Form>
      </div>

      {/* add row/ add column */}

      {/* {
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: 14,
            zIndex: 3,
            lineHeight: '22px',
            color: '#000',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isVerticalBlock && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translate(100%,-50%)',
              }}
            >
              <ToolItem
                width={22}
                iconName='icon-add'
                onClick={handleAddColumn}
              />
            </div>
          )}
          {isHorizontalBlock && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '0',
                transform: 'translate(-50%, 100%)',
              }}
            >
              <ToolItem
                width={22}
                iconName='icon-add'
                onClick={handleAddRows}
              />
            </div>
          )}
        </div>
      } */}
    </>
  );
}

function ToolItem(props: {
  iconName: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  width?: number;
}) {
  return (
    <div
      onClick={props.onClick}
      style={{
        color: '#ffffff',
        backgroundColor: '#1890ff',
        height: 22,
        fontSize: props.width || 14,
        lineHeight: '22px',
        width: 22,
        display: 'flex',
        pointerEvents: 'auto',
        cursor: 'pointer',
        justifyContent: 'center',
      }}
      className={classnames('iconfont', props.iconName)}
    />
  );
}
