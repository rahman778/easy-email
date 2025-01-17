import { IMAGE_LIST } from '@/assets/image';
import React, { useEffect, useState } from 'react';

interface IPictureProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLImageElement>,
    HTMLElement
  > {
  src: string;
  className?: string;
}
const fallbackPicture = IMAGE_LIST.IMAGE_59;

export function Picture(props: IPictureProps) {
  const [url, setUrl] = useState(props.src);

  useEffect(() => {
    setUrl(props.src);
  }, [props.src]);

  return (
    <picture
      {...{ ...props }}
      {...{
        src: undefined,
        style: {
          display: 'inline-block',
          ...props.style,
        },
      }}
    >
      <source
        type='image/webp'
        srcSet={url + '?imageView2/3/q/70/w/750/format/webp'}
      />
      <img
        onError={() => url !== fallbackPicture && setUrl(fallbackPicture)}
        crossOrigin=''
        style={{
          width: props.style?.width || '100%',
          height: props.style?.height || '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        src={url}
        alt=''
      />
    </picture>
  );
}
