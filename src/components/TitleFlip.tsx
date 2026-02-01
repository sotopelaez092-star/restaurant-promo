import {useCurrentFrame, useVideoConfig} from 'remotion';
import {flipInFromTop} from '../utils/animations';

interface TitleFlipProps {
  text: string;
  startFrame: number;
  letterDelay?: number;
  fontSize?: number;
}

export const TitleFlip: React.FC<TitleFlipProps> = ({
  text,
  startFrame,
  letterDelay = 3,
  fontSize = 120,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const letters = text.split('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0px',
      }}
    >
      {letters.map((letter, index) => {
        const delay = startFrame + index * letterDelay;
        const {rotateX, opacity} = flipInFromTop(frame, fps, delay);

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              fontFamily: 'Impact, Haettenschweiler, sans-serif',
              fontSize: `${fontSize}px`,
              fontWeight: 'bold',
              color: '#ffbd59',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              transform: `perspective(800px) rotateX(${rotateX}deg)`,
              transformOrigin: 'center top',
              opacity,
              paddingLeft: letter === ' ' ? '30px' : '0px',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </div>
  );
};
