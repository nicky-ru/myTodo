// Import react components
import React, { useState, useEffect } from 'react';

// Import UI Components
import { Tab, Container, Divider } from 'semantic-ui-react';

import HeaderComponent from './components/Header';
import TodoComponent from './components/Todo';

import { SkynetClient } from 'skynet-js';

const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
const client = new SkynetClient(portal);
// const client = new SkynetClient();

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // list helpers
  const [todoItems, setTodoItems] = useState([]);
  const [item, setItem] = useState('');

  // MySky Helpers
  const [dirNames, setDirNames] = useState(['today', 'important', 'groceries', 'reading_list']);
  const [filePath, setFilePath] = useState();
  const [userID, setUserID] = useState('');
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);

  // When list folder changes, update FilePath state.
  useEffect(() => {
    setFilePath(dataDomain + '/' + dirNames[activeTab]);
  }, [activeTab]);

  // Load items for a new filePath
  useEffect(() => {
    // clear the todoItems state when change to another folder
    setTodoItems([]);
    loadData();
  }, [filePath]);

  // choose a data domain for saving files in MySky
  const dataDomain = 'mytodo';

  // On initial run, start initialization of MySky
  useEffect(() => {
    async function initMySky() {
      try {
        const mySky = await client.loadMySky(dataDomain);

        const loggedIn = await mySky.checkLogin();

        setMySky(mySky);
        setLoggedIn(loggedIn);

        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.log('error while init', e);
      }
    }
    // call async setup function
    initMySky();
  }, []);

  const handleAddItem = async (event) => {
    event.preventDefault();
    console.log(`item to add: ${item}`);

    // new items will be temporary saved in the todoItems state
    // to save the new items to MySky see handleMySkyWrite()
    const items = [...todoItems];
    items.push(item);
    setTodoItems(items);
    setItem('');
  }

  const handleDeleteItem = async (i) => {
    console.log(`item to delete: ${todoItems[i]}`);

    // the item will be removed from the todoItems list in the current state
    // but to remove the item from MySky the user should save changes
    const items = [...todoItems];
    items.splice(i, 1);
    setTodoItems(items);
  }

  const handleMySkyLogin = async () => {
    const status = await mySky.requestLoginAccess();

    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    await mySky.logout();

    setLoggedIn(false);
    setUserID('');
  }

  const handleMySkyWrite = async () => {
    setSaving(true);

    const jsonData = {
      todoItems,
    }

    try {
      console.log('userID: ', userID);
      console.log('filePath: ', filePath);

      await mySky.setJSON(filePath, jsonData);

      console.log('item has been written to SkyDB');
    } catch (e) {
      console.log('error while setJSON: ', e.message);
    }

    setSaving(false);
  }

  // load list of items from MySky for current folder
  const loadData = async () => {
    setLoading(true);

    console.log('loading user data from SkyDB');

    try {
      const { data } = await mySky.getJSON(filePath);

      if (data) {
        setTodoItems(data.todoItems);
        console.log('User data loaded from SkyDB!');
      } else {
        console.error('There was a problem with get json');
      }

    } catch (e) {
      console.log('error while getting JSON');
    }

    setLoading(false);
  }

  // handleSelectTab handles selecting the folder of the mytodo app
  const handleSelectTab = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };

  // define args passed to the TodoComponent
  const formProps = {
    todoItems,
    handleAddItem,
    handleDeleteItem,
    item,
    setItem,
    loadData,
    handleMySkyWrite,
    loggedIn,
    loading,
    saving,
    filePath,
  };

  const panes = [
    {
      menuItem: 'Today',
      render: () => (
        <Tab.Pane>
          <TodoComponent {...formProps}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Important',
      render: () => (
        <Tab.Pane>
          <TodoComponent {...formProps}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Groceries',
      render: () => (
        <Tab.Pane>
          <TodoComponent {...formProps}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Reading List',
      render: () => (
        <Tab.Pane>
          <TodoComponent {...formProps}/>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <HeaderComponent
        loggedIn={loggedIn}
        handleMySkyLogout={handleMySkyLogout}
        handleMySkyLogin={handleMySkyLogin}
        userID={userID}
        />
      <Divider/>
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        panes={panes}
        onTabChange={handleSelectTab}
        activeIndex={activeTab}
      />
    </Container>
  );
}

export default App;
