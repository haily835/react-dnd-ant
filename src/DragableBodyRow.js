import React, { useRef } from "react";
import "./index.css";
import { useDrag, useDrop } from "react-dnd";
import { Form } from "antd";

export const EditableContext = React.createContext(null);

const type = "DraggableBodyRow";

const DraggableBodyRow = ({
  index,
  moveRow,
  record,
  className,
  style,
  ...restProps
}) => {
  const dragRef = useRef(null);
  const previewRef = useRef(null);

  const [{ isOver, dropClassName, handlerId }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward"
      };
    },
    hover(item, monitor) {
      if (!previewRef.current) {
        return {};
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return {};
      }
      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return {};
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return {};
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
    // drop: (item) => {
    //   moveRow(item.index, index);
    // }
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type,
    item: {
      index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;

  drag(dragRef);
  preview(previewRef);
  drop(previewRef);

  const [form] = Form.useForm();

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          ref={previewRef}
          className={`${className}${isOver ? dropClassName : ""}`}
          style={{
            ...style,
            opacity
          }}
        >
          <td ref={dragRef}>DRAGG</td>
          <td>
            <Form.Item
              style={{
                margin: 0
              }}
              name={dataIndex}
              rules={[
                {
                  required: true,
                  message: `${title} is required.`
                }
              ]}
            >
              <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
          </td>
          <td>{record.age}</td>
          <td>{record.address}</td>
        </tr>
      </EditableContext.Provider>
    </Form>
  );
};

export default DraggableBodyRow;
