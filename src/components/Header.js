import React from 'react'
import { Input, Button, Divider, Header, Container } from 'semantic-ui-react';

const HeaderComponent = (props) => {

  return (
    <>
      <Header
        as="h1"
        content="Skynet Todo List"
        textAlign="left"
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <Divider/>
      <>
        {props.loggedIn === true && (
          <Button onClick={props.handleMySkyLogout}>
            Log Out of MySky
          </Button>
        )}
        {props.loggedIn === false && (
          <Button color="green" onClick={props.handleMySkyLogin}>
            Login with MySky
          </Button>
        )}
        {props.loggedIn === null && <Button>Loading MySky...</Button>}
        <br/>
        <Container style={{ marginTop: '1em' }}>
          <label>
            Discoverable UserID <i>(Shared across MySky)</i>
          </label>
          <Input
            placeholder="You must Login with MySky..."
            value={props.userID}
            loading={props.loggedIn === null}
            icon="user circle"
            iconPosition="left"
            fluid
            disabled
          />
        </Container>
      </>
    </>
  );
};

export default HeaderComponent