import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { Table } from "antd";
import update from "immutability-helper";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBodyRow from "./DragableBodyRow";

import EditableCell from "./EditableCell";

const defaultColumns = [
  {
    title: "Sort",
    dataIndex: "sort",
    key: "sort",
    editable: false
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    editable: true
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    editable: true
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    editable: true
  }
];

const init = [];
for (let i = 0; i < 500; i += 1) {
  init.push({
    key: i.toString(),
    name: "row " + i,
    age: i * 10,
    address: "London " + i
  });
}
const App = () => {
  const [data, setData] = useState(init);

  const [rowRefs, setRowRefs] = useState({});

  useEffect(() => {
    console.log("-------rowRefs-------", rowRefs);
  }, [rowRefs]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const newData = update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, data[dragIndex]]
        ]
      });
      console.log("----data from update----", newData);
      setData(newData);
    },
    [data]
  );

  useEffect(() => {
    console.log("----data-----", data);
  }, [data]);

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    setData(newData);
  };

  const columns = defaultColumns.map((col) => {
    // if (!col.editable) {
    //   return col;
    // }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        rowRefs
      })
    };
  });
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        rowClassName={() => "editable-row"}
        components={{
          body: {
            // cell: EditableCell,
            row: DraggableBodyRow
          }
        }}
        onRow={(record, index) => {
          console.log(record);
          const attr = {
            index,
            moveRow,
            record
          };
          return attr;
        }}
        pagination={false}
      />
    </DndProvider>
  );
};
export default App;
