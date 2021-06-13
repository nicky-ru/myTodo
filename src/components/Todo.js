import React from 'react'
import {
  List,
  Form,
  Input,
  Button,
  Divider,
  Popup,
  Header,
  Dimmer,
  Loader,
} from 'semantic-ui-react'

import Items from './Items';
import Loading from './Loading';

const TodoComponent = (props) => {
  return (
    <>

      <Header size='medium'>{props.filePath}:</Header>

      {props.saving === true && (
        <>
          <i>Saving... </i>
          <Loader active inline size={'small'} />
        </>
      )
      }

      {props.loading === true && (
        <Dimmer active inverted>
          <Loading />
        </Dimmer>
      )}
      {props.loggedIn === true && (
        <List>
          <Items
            todoItems={props.todoItems}
            handleDeleteItem={props.handleDeleteItem}
          />
        </List>
      )}

      {props.listNotEmpty === false && (
        <i>The list is empty</i>
      )}


      <Divider />
      <Form onSubmit={props.handleAddItem} id='item-add-form'>
        <Form.Field inline>
          <Input
            type='text' placeholder='e.g. Feed my cat' value={props.item}
            onChange={(e) => {
              // size validation
              if (e.target.value.length < 50) {
                props.setItem(e.target.value);
              }
            }}
          />
          <Popup
            content='Add new todo item to your list'
            trigger={<Button icon='add' type={'submit'} />}
          />
        </Form.Field>
      </Form>
    </>
  );
};

export default TodoComponent