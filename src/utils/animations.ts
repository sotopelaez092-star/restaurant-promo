import {interpolate, spring} from 'remotion';

/**
 * 字母翻转动画（从上方 rotateX 翻入）
 */
export const flipInFromTop = (
  frame: number,
  fps: number,
  delay: number
): {rotateX: number; opacity: number} => {
  const springValue = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const rotateX = interpolate(springValue, [0, 1], [-90, 0]);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);

  return {rotateX, opacity};
};

/**
 * 合并动效（缩放 + 淡入）
 */
export const mergeIn = (
  frame: number,
  fps: number,
  startFrame: number
): {scale: number; opacity: number} => {
  const springValue = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
    },
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return {scale: springValue, opacity};
};

/**
 * 圆形视频上升弹入
 */
export const riseAndBounce = (
  frame: number,
  fps: number,
  startFrame: number
): {translateY: number; scale: number; opacity: number} => {
  const springValue = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.8,
    },
  });

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [80, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return {
    translateY,
    scale: springValue,
    opacity,
  };
};

/**
 * 按钮从下方弹入
 */
export const buttonBounceIn = (
  frame: number,
  fps: number,
  startFrame: number
): {translateY: number; scale: number; opacity: number} => {
  const springValue = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 120,
    },
  });

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 25],
    [60, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return {
    translateY,
    scale: springValue,
    opacity,
  };
};

/**
 * 淡入动画
 */
export const fadeIn = (
  frame: number,
  startFrame: number,
  duration: number = 30
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateRight: 'clamp',
  });
};
