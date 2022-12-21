import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input } from "antd";
import { EditableContext } from "./DragableBodyRow";
import { useDrag } from "react-dnd";

const type = "DraggableBodyRow";

const colors = {
  Value: "red",
  Effort: "blue",
  Score: "green",
  Impact: "red",
  Confidence: "pink"
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  rowRefs,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  const ref = useRef();
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };
  const rowRef = record && rowRefs[record.key];

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
  let childNode = children;
  const [, drag, preview] = useDrag({
    type,
    item: { id: record?.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(ref);
  preview(rowRef);
  if (title === "Sort") {
    return (
      <td ref={ref} {...restProps}>
        <div>Drag</div>
      </td>
    );
  }

  if (editable) {
    childNode = editing ? (
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
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          background: "red"
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
};

export default EditableCell;

export const columns = [
  {
    name: "Value",
    status: "success",
    id: "customfield_10081",
    title: "Value custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  {
    name: "Effort",
    status: "success",
    id: "customfield_10078",
    title: "Effort custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  {
    name: "Score",
    status: "success",
    id: "customfield_10083",
    title: "Score custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  {
    name: "Impact",
    status: "success",
    id: "customfield_10080",
    title: "Impact custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  {
    name: "Reach",
    status: "success",
    id: "customfield_10079",
    title: "Reach custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  {
    name: "Confidence",
    status: "success",
    id: "customfield_10084",
    title: "Confidence custom field",
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey: "com.atlassian.jira.plugin.system.customfieldtypes:numberrange"
  },
  { id: "customfield_10019", key: "customfield_10019", name: "Rank" }
];

export const mergedColumns = columns.map((column) => ({
  ...column,
  title: column.name,
  dataIndex: column.id,
  key: column.id
}));

mergedColumns.push({
  title: "R.I.C.E SCORE",
  key: "rice_score",
  id: "rice_score"
});
