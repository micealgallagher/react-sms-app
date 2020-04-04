/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import SmsItem from './sms-item.js';
import { useState, useEffect, useRef } from 'react';

const axios = require('axios');
const R = require('ramda');

export default function SmsList() {
  // Keeping isLoaded and data together because they change together - async state update
  const [messages, setMessages] = useState({ isLoaded: false, data: [], error: '' });
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const countRef = useRef(0);
  const searchTermChange = e => setSearchTerm(e.target.value);
  const getErrorText = error => `${error.response.status} - ${error.response.statusText}`;

  useEffect(() => {
    axios
      .get('https://5e6a7b350f70dd001643be10.mockapi.io/api/v1/messages')
      .then(response => setMessages(prevMessages => ({ ...prevMessages, ...{ isLoaded: true, data: response.data.messages } })))
      .catch(error => setMessages({ isLoaded: true, data: [], error: getErrorText(error) }))
  }, []); // [] denotes componentDidMount()

  // Is there a more standard way to achieve this pattern?
  const hasLoadedSuccessfully = messages.isLoaded && messages.error.length === 0;
  const hasLoadedWithoutItems = hasLoadedSuccessfully && messages.data.length === 0;
  const hasLoadedWithError = messages.isLoaded && messages.error.length > 0;

  const containsSearchTerm = m => {
    const containsIn = field => R.contains(searchTerm.toLocaleLowerCase(), field.toLowerCase())
    return R.or(
      containsIn(m.message),
      containsIn(m.contact)
    )
  };

  const handleFocusClick = () => {
    countRef.current = parseInt(countRef.current) + 1;
    setCount(countRef.current);
  };
  
  return (
    <div css={css`
      width: 30vw;
    `}
    >
      <h1>SMS List</h1>
      <button onClick={handleFocusClick}>focus</button>
      <input type="text" placeholder="search" onChange={searchTermChange} />
      <input value={count} type="text" placeholder="search" onChange={searchTermChange} />

      {!messages.isLoaded && <h3><i>Loading....</i></h3>}
      {hasLoadedWithError && <h3><i>{messages.error}</i></h3>}
      {hasLoadedWithoutItems && <h3><i>No Messages</i></h3>}

      {
        // messages.data.reduce((acc, cur, index, arr) => {
        //   const shouldAccumulate = containsSearchTerm(cur);
        //   if (arr.length - 1 === index) {

        //   }
        //   return shouldAccumulate ? [...acc, { ...<SmsItem {...cur} /> }] : acc
        // }, [<h3><i>No messages</i></h3>])


        // messages.data.reduce((acc, cur) => (
        //   containsSearchTerm(cur) ? [...acc, {...cur} ]: acc
        // ), [{message: 'No result'}]).map(m => <SmsItem {...m} />)
        // ), [<h3><i>Noting matching search term</i></h3>]).map(m => <SmsItem {...m} />)
        // Didn't want to store retrieved values AND filtered values to do .length 
        R.when(
          R.isEmpty,
          () => <h3><i>Nothing to display</i></h3>
        )(
          messages.data.filter(containsSearchTerm).map(m => <SmsItem {...m} />)
        )
      }
    </div>
  );
};
