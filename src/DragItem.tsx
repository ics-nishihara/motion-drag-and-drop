import { motion, useDragControls } from "framer-motion";
import {
  FC,
  useRef,
  PointerEvent,
  useState,
  RefObject,
  useEffect,
  MutableRefObject,
} from "react";

type Props = {
  index: number;
  droppableArea: MutableRefObject<RefObject<HTMLInputElement>[]>;
  onDrop?: (index: number, targetAreaIndex: number) => void;
};

export const DragItem: FC<Props> = ({ index, droppableArea, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [dragHtml, setDragHtml] = useState<string>("");

  const [droppableAreaRect, setDroppableAreaRect] =
    useState<{ rect: DOMRect | undefined; canDrop: boolean }[]>();

  const controls = useDragControls();

  const startDrag = (event: PointerEvent) => {
    controls.start(event, { snapToCursor: false });
    console.log(ref.current);
    if (!ref.current) {
      return;
    }
    const html = ref.current.innerHTML;
    setDragHtml(html);
  };

  const endDrag = () => {
    setDragHtml("");
  };

  useEffect(() => {
    setDroppableAreaRect(
      droppableArea.current.map((area) => {
        return {
          rect: area.current?.getBoundingClientRect(),
          canDrop: area.current?.dataset.isDroppable === "true",
        };
      }),
    );
  }, []);

  const determineCanDrop = (point: { x: number; y: number }) => {
    if (!droppableAreaRect) {
      return { canDrop: false, targetArea: undefined };
    }
    const targetAreaIndex = droppableAreaRect.findIndex((area) => {
      if (!area.rect) {
        return { canDrop: false, targetArea: undefined };
      }
      return (
        point.x > area.rect.left &&
        point.x < area.rect.right &&
        point.y > area.rect.top &&
        point.y < area.rect.bottom &&
        area.canDrop
      );
    });
    console.log({ targetAreaIndex });
    return {
      canDrop: targetAreaIndex !== -1,
      targetAreaIndex,
    };
  };

  return (
    <div className="dragItemWrapper">
      <div ref={ref} onPointerDown={startDrag} onPointerUp={endDrag}>
        <div className="dragItem">Drag Me {index}</div>
      </div>
      <motion.div
        drag={true}
        dragSnapToOrigin={true}
        whileDrag={{ opacity: 0.5 }}
        onDrag={(_, info) => console.log(info.point)}
        onDragEnd={(_, info) => {
          console.log(info.point,droppableAreaRect)
          const { canDrop, targetAreaIndex } = determineCanDrop(info.point);
          if (canDrop && targetAreaIndex !== undefined) {
            console.log("dropped");
            onDrop?.(index, targetAreaIndex);
          }
          setTimeout(() => {
            setDragHtml("");
          }, 500);
        }}
        dragControls={controls}
        className="dragItemIcon"
      >
        <div dangerouslySetInnerHTML={{ __html: dragHtml }}></div>
      </motion.div>
    </div>
  );
};
