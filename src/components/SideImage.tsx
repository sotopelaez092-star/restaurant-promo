import {Img, useCurrentFrame} from 'remotion';
import {fadeIn} from '../utils/animations';

interface SideImageProps {
  src: string;
  side: 'left' | 'right';
  startFrame: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export const SideImage: React.FC<SideImageProps> = ({
  src,
  side,
  startFrame,
  width = 280,
  height = 280,
  x,
  y = 380,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, startFrame, 30);

  return (
    <div
      style={{
        position: 'absolute',
        ...(x !== undefined ? {left: `${x}px`} : {[side]: 0}),
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};
