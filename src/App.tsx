import "./App.css";
import { DragItem } from "./DragItem.tsx";
import { RefObject, useRef, useState } from "react";

function App() {
  const droppableArea = useRef<RefObject<HTMLInputElement>[]>([]);
  const [droppableList, setDroppableList] = useState<
    {
      canDrop: boolean;
      dropItemNumber: null | number;
    }[]
  >([
    { canDrop: true, dropItemNumber: null },
    { canDrop: false, dropItemNumber: null },
    { canDrop: true, dropItemNumber: null },
  ]);
  droppableList.forEach(() => {
    droppableArea.current.push(useRef<HTMLInputElement>(null));
  });

  const handleDrop = (index: number, targetAreaIndex: number) => {
    console.log(`drop ${index} to ${targetAreaIndex}`);
    const newList = [...droppableList];
    newList[targetAreaIndex].dropItemNumber = index;
    setDroppableList(newList);
  };

  console.log(droppableArea.current);
  return (
    <>
      <div className="dragItemList">
        {[1, 2, 3].map((i) => {
          return (
            <DragItem
              key={i}
              index={i}
              droppableArea={droppableArea}
              onDrop={handleDrop}
            />
          );
        })}
      </div>

      <div className="dropAreaList">
        {droppableList.map((dropArea, index) => {
          return (
            <div
              className="dropArea"
              key={index}
              data-is-droppable={dropArea.canDrop}
              ref={droppableArea.current[index]}
            >
              <div>
                <p>{dropArea.canDrop ? "Can Drop" : "Can't Drop"}</p>
                {dropArea.dropItemNumber && (
                  <p>Drop Item Number: {dropArea.dropItemNumber}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
