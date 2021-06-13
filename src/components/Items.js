import React, { useEffect, useState } from 'react';
import { Icon, List } from 'semantic-ui-react';

const Items = (props) => {
  const [todoItems, setTodoItems] = useState([]);

  // refresh content of the list in the current folder
  // after adding or removing an item
  useEffect(() => {
    let items = [];

    props.todoItems.forEach((item, i) => {
      items.push(
        <List.Item key={i} style={{textTransform: 'capitalize'}}>
          <Icon
            link
            name={'check'}
            onClick={() => {props.handleDeleteItem(i);}}
          />
          {item}
        </List.Item>
      );
    });

    setTodoItems(items);
  }, [props.todoItems]);

  return(todoItems);
};

export default Items;