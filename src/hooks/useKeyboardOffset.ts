import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, KeyboardEvent, LayoutChangeEvent, Platform } from 'react-native';

export function useKeyboardOffset(topSafeOffset: number = Platform.OS === 'ios' ? 54 : 38) {
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const initialHeightRef = useRef(0);
  const currentHeightRef = useRef(0);
  const rawKbHeightRef = useRef(0);
  const lastTargetRef = useRef(0);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const animateTo = useCallback((target: number, duration?: number) => {
    const clamped = Math.max(0, Math.round(target));
    if (clamped === lastTargetRef.current) return;
    lastTargetRef.current = clamped;
    setKeyboardHeight(clamped);
    Animated.timing(offsetAnim, {
      toValue: clamped,
      duration: duration && duration > 0 ? duration : 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [offsetAnim]);

  const computeEffective = useCallback((rawKbHeight: number) => {
    if (rawKbHeight <= 0) return 0;
    const shrinkDelta =
      initialHeightRef.current > 0 && currentHeightRef.current > 0
        ? Math.max(0, initialHeightRef.current - currentHeightRef.current)
        : 0;
    return Math.max(0, rawKbHeight - shrinkDelta);
  }, []);

  useEffect(() => {
    if (Keyboard.isVisible?.()) {
      const m = Keyboard.metrics?.();
      if (m?.height) {
        rawKbHeightRef.current = m.height;
        animateTo(computeEffective(m.height), 150);
      }
    }

    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvt, (e: KeyboardEvent) => {
      const rawH = e.endCoordinates?.height || 0;
      rawKbHeightRef.current = rawH;
      animateTo(computeEffective(rawH), e.duration);
    });

    const hideSub = Keyboard.addListener(hideEvt, (e?: KeyboardEvent) => {
      rawKbHeightRef.current = 0;
      animateTo(0, e?.duration);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [animateTo, computeEffective]);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    currentHeightRef.current = height;
    setContainerHeight(height);
    if (rawKbHeightRef.current === 0) {
      initialHeightRef.current = height;
    } else {
      animateTo(computeEffective(rawKbHeightRef.current), 100);
    }
  }, [animateTo, computeEffective]);

  const isKeyboardVisible = keyboardHeight > 0;
  const maxContentHeight =
    containerHeight > 0
      ? Math.max(240, isKeyboardVisible ? containerHeight - keyboardHeight - topSafeOffset : containerHeight * 0.85)
      : undefined;

  return { offsetAnim, keyboardHeight, isKeyboardVisible, maxContentHeight, onContainerLayout };
}
