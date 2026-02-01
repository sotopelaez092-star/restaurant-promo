import {useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeIn} from '../utils/animations';

interface DescriptionMergeProps {
  text: string;
  startFrame: number;
  fontSize?: number;
}

export const DescriptionMerge: React.FC<DescriptionMergeProps> = ({
  text,
  startFrame,
  fontSize = 28,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scale, opacity} = mergeIn(frame, fps, startFrame);

  return (
    <p
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: `${fontSize}px`,
        color: '#ffbd59',
        textAlign: 'center',
        lineHeight: '1.5',
        margin: 0,
        padding: 0,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {text}
    </p>
  );
};
