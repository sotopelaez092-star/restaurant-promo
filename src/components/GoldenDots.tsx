import {useCurrentFrame, interpolate} from 'remotion';

export const GoldenDots: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 0.6], {
    extrapolateRight: 'clamp',
  });

  const dotPattern = {
    backgroundImage: `radial-gradient(circle, #ffbd59 4px, transparent 4px)`,
    backgroundSize: '30px 30px',
  };

  return (
    <>
      {/* 左侧点装饰 */}
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '302.4px',
          width: '302.2px',
          height: '90px',
          ...dotPattern,
          opacity,
          transform: 'rotate(-90deg)',
          transformOrigin: 'top left',
        }}
      />

      {/* 右侧点装饰 */}
      <div
        style={{
          position: 'absolute',
          left: '990px',
          top: '302.4px',
          width: '302.2px',
          height: '165.4px',
          ...dotPattern,
          opacity,
          transform: 'rotate(-90deg)',
          transformOrigin: 'top left',
        }}
      />
    </>
  );
};
