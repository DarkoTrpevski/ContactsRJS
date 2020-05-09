import React, {useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import {SET_ALERT, REMOVE_ALERT} from '../types';

// Because of our proxy settings in our package.json ("proxy": "http://localhost:5000")
// we don't have to add the full path of http://localhost:5000/api/something everytime we make a request/response.

const AlertState = props => {
  const initialState = [];

  // Bringing state and dispatch actions out using the useReducer function.
  const [state, dispatch] = useReducer(alertReducer, initialState);

  //------------------------------------------------------------------------------------------------------------------------
  //*ALERT STATE ACTIONS:

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: {msg, type, id},
    });

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), timeout);
  };

  //------------------------------------------------------------------------------------------------------------------------

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}>
      {props.children}
    </AlertContext.Provider>
  );
};

//--------------------------------------------------------------------------------------------------------------------------

export default AlertState;