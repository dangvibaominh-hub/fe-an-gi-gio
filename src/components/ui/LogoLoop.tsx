"use client";

import {
  type CSSProperties,
  type Key,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./LogoLoop.css";

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

type Direction = "left" | "right" | "up" | "down";

export type LogoLoopNodeItem = {
  ariaLabel?: string;
  href?: string;
  node: ReactNode;
  title?: string;
};

export type LogoLoopImageItem = {
  alt?: string;
  height?: number;
  href?: string;
  sizes?: string;
  src: string;
  srcSet?: string;
  title?: string;
  width?: number;
};

export type LogoLoopItem = LogoLoopNodeItem | LogoLoopImageItem;

export interface LogoLoopProps<TLogo extends LogoLoopItem = LogoLoopItem> {
  ariaLabel?: string;
  className?: string;
  direction?: Direction;
  draggable?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  gap?: number;
  hoverSpeed?: number;
  logoHeight?: number;
  logos: readonly TLogo[];
  pauseOnHover?: boolean;
  renderItem?: (item: TLogo, key: Key) => ReactNode;
  scaleOnHover?: boolean;
  speed?: number;
  style?: CSSProperties;
  width?: number | string;
}

const toCssLength = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

function useResizeObserver(
  callback: () => void,
  elements: React.RefObject<HTMLElement | null>[],
  dependencies: unknown[],
) {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) {
        return null;
      }

      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [callback, elements, dependencies]);
}

function useImageLoader(
  seqRef: React.RefObject<HTMLElement | null>,
  onLoad: () => void,
  dependencies: unknown[],
) {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad, { once: true });
        img.addEventListener("error", handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
}

function useAnimationLoop(
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean,
) {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const dragRef = useRef({
    didDrag: false,
    isDragging: false,
    lastPosition: 0,
    pointerId: null as number | null,
  });

  const applyOffset = useCallback(
    (offset: number) => {
      const track = trackRef.current;
      if (!track) return;

      track.style.transform = isVertical
        ? `translate3d(0, ${-offset}px, 0)`
        : `translate3d(${-offset}px, 0, 0)`;
    },
    [isVertical, trackRef],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      applyOffset(offsetRef.current);
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime =
        Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (dragRef.current.isDragging) {
        velocityRef.current = 0;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target =
        isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor =
        1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        applyOffset(offsetRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      lastTimestampRef.current = null;
    };
  }, [
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    hoverSpeed,
    isVertical,
    trackRef,
    applyOffset,
  ]);

  const startDrag = useCallback(
    (pointerId: number, position: number) => {
      dragRef.current = {
        didDrag: false,
        isDragging: true,
        lastPosition: position,
        pointerId,
      };
      velocityRef.current = 0;
    },
    [],
  );

  const moveDrag = useCallback(
    (pointerId: number, position: number) => {
      const drag = dragRef.current;
      const sequenceSize = isVertical ? seqHeight : seqWidth;

      if (!drag.isDragging || drag.pointerId !== pointerId || sequenceSize <= 0) {
        return false;
      }

      const delta = position - drag.lastPosition;
      drag.lastPosition = position;

      if (Math.abs(delta) > 0) {
        drag.didDrag = true;
        offsetRef.current =
          ((offsetRef.current - delta) % sequenceSize + sequenceSize) %
          sequenceSize;
        applyOffset(offsetRef.current);
      }

      return drag.didDrag;
    },
    [applyOffset, isVertical, seqHeight, seqWidth],
  );

  const endDrag = useCallback((pointerId: number) => {
    const drag = dragRef.current;
    if (drag.pointerId !== pointerId) return false;

    drag.isDragging = false;
    drag.pointerId = null;
    lastTimestampRef.current = null;
    return drag.didDrag;
  }, []);

  return { endDrag, moveDrag, startDrag };
}

function LogoLoopComponent<TLogo extends LogoLoopItem>({
  logos,
  speed = 120,
  direction = "left",
  draggable = false,
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps<TLogo>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);
  const suppressClickRef = useRef(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) {
      return hoverSpeed;
    }

    if (pauseOnHover === true) {
      return 0;
    }

    if (pauseOnHover === false) {
      return undefined;
    }

    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === "up" || direction === "down";

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = isVertical
      ? direction === "up"
        ? 1
        : -1
      : direction === "left"
        ? 1
        : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;

    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;

    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;

      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);

        if (containerRef.current.style.height !== `${targetHeight}px`) {
          containerRef.current.style.height = `${targetHeight}px`;
        }
      }

      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport =
          containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        const copiesNeeded =
          Math.ceil(viewport / sequenceHeight) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded =
        Math.ceil(containerWidth / sequenceWidth) +
        ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [
    logos,
    gap,
    logoHeight,
    isVertical,
  ]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  const dragControls = useAnimationLoop(
    trackRef,
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    effectiveHoverSpeed,
    isVertical,
  );

  const cssVariables = useMemo(
    () =>
      ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }) as CSSProperties,
    [gap, logoHeight, fadeOutColor],
  );

  const rootClassName = useMemo(
    () =>
      [
        "logoloop",
        isVertical ? "logoloop--vertical" : "logoloop--horizontal",
        draggable && "logoloop--draggable",
        fadeOut && "logoloop--fade",
        scaleOnHover && "logoloop--scale-hover",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [isVertical, draggable, fadeOut, scaleOnHover, className],
  );

  const handleMouseEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) {
      setIsHovered(true);
    }
  }, [effectiveHoverSpeed]);

  const handleMouseLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) {
      setIsHovered(false);
    }
  }, [effectiveHoverSpeed]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggable || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      dragControls.startDrag(
        event.pointerId,
        isVertical ? event.clientY : event.clientX,
      );
    },
    [dragControls, draggable, isVertical],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggable) return;

      if (
        dragControls.moveDrag(
          event.pointerId,
          isVertical ? event.clientY : event.clientX,
        )
      ) {
        event.preventDefault();
      }
    },
    [dragControls, draggable, isVertical],
  );

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggable) return;

      const didDrag = dragControls.endDrag(event.pointerId);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      suppressClickRef.current = didDrag;
    },
    [dragControls, draggable],
  );

  const handleClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    },
    [],
  );

  const renderLogoItem = useCallback(
    (item: TLogo, key: Key) => {
      if (renderItem) {
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }

      const isNodeItem = "node" in item;
      const content = isNodeItem ? (
        <span
          className="logoloop__node"
          aria-hidden={Boolean(item.href && !item.ariaLabel)}
        >
          {item.node}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAriaLabel = isNodeItem
        ? item.ariaLabel ?? item.title
        : item.alt ?? item.title;
      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || "logo link"}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      );
    },
    [renderItem],
  );

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) =>
            renderLogoItem(item, `${copyIndex}-${itemIndex}`),
          )}
        </ul>
      )),
    [copyCount, logos, renderLogoItem],
  );

  const containerStyle = useMemo(
    () => ({
      width: isVertical
        ? toCssLength(width) === "100%"
          ? undefined
          : toCssLength(width)
        : toCssLength(width) ?? "100%",
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style, isVertical],
  );

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
      >
        {logoLists}
      </div>
    </div>
  );
}

export const LogoLoop = memo(LogoLoopComponent) as typeof LogoLoopComponent;

export default LogoLoop;
