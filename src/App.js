import React, { useReducer } from "react";
import Moment from "react-moment";

import "./App.css";

function cashbookReducer(state, action) {
  switch (action.type) {
    case "SHOW_MODAL":
      return {
        ...state,
        showModal: action.showModal,
        entryType: action.entryType,
      };
    case "SET_AMOUNT":
      return {
        ...state,
        amount: action.amount,
      };
    case "SET_NOTETEXT":
      return {
        ...state,
        notesText: action.notesText,
      };
    case "CLEAR_INPUTS":
      return {
        ...state,
        amount: 0,
        notesText: "",
      };
    case "UPDATE_CASHENTRIES":
      return {
        ...state,
        cashbookEntries: [
          ...state.cashbookEntries,
          {
            note: state.notesText,
            amount: state.amount,
            type: state.entryType,
            timestamp: new Date(),
          },
        ],
      };
    default:
      throw new Error(`Unhandled action type - ${action.type}`);
  }
}

function App() {
  const initialState = {
    showModal: false,
    entryType: null,
    amount: null,
    notesText: "",
    cashbookEntries: [],
  };
  const [state, dispatch] = useReducer(cashbookReducer, initialState);

  function onOutClickHandler() {
    dispatch({ type: "SHOW_MODAL", showModal: true, entryType: 0 });
  }

  function onInClickHandler() {
    dispatch({ type: "SHOW_MODAL", showModal: true, entryType: 1 });
  }

  function onSubmit() {
    dispatch({ type: "UPDATE_CASHENTRIES" });
    dispatch({ type: "SHOW_MODAL", showModal: false });
    dispatch({ type: "CLEAR_INPUTS" });
  }

  function getTodaysBalance() {
    const { cashbookEntries } = state;
    return cashbookEntries.length === 0
      ? 0
      : cashbookEntries.reduce(
          (prev, curr) =>
            curr.type === 0
              ? parseFloat(prev) - parseFloat(curr.amount)
              : parseFloat(prev) + parseFloat(curr.amount),
          0
        );
  }

  const { showModal, entryType, amount, notesText, cashbookEntries } = state;

  return (
    <div className="App">
      <div className="header">
        <div className="header__title">My Cashbook</div>
        <div className="today-balance">
          <h1 data-testid="balance">{getTodaysBalance()}&nbsp;₹</h1>
          <p>Todays Balance</p>
        </div>
      </div>
      {cashbookEntries.length === 0 ? (
        <div className="transaction">No Entry found!</div>
      ) : (
        cashbookEntries.map((entry) => {
          return (
            <div key={entry.timestamp} className="transaction">
              <div className="entry">
                <div className="amount">
                  <Moment date={entry.timestamp}></Moment>
                </div>
                <h1>{entry.note}</h1>
              </div>
              <div className="entry out">
                <h1>Out</h1>
                <div className="amount">
                  {entry.type === 0 ? entry.amount : "-"}
                </div>
              </div>
              <div className="entry in">
                <h1>In</h1>
                <div className="amount">
                  {entry.type === 1 ? entry.amount : "-"}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div className="action-group">
        <button
          data-testid="cashout-btn"
          type="button"
          className="red"
          onClick={onOutClickHandler}
        >
          Out
        </button>
        <button
          data-testid="cashin-btn"
          type="button"
          className="green"
          onClick={onInClickHandler}
        >
          In
        </button>
      </div>
      {showModal && (
        <div className="model">
          <div className="model-content">
            <h2>New Entry</h2>
            <button
              type="button"
              className="close-btn"
              onClick={() => dispatch({ type: "SHOW_MODAL", showModal: false })}
            >
              Close
            </button>
            <input
              data-testid="amount"
              type="number"
              placeholder="₹0.00"
              onChange={({ target }) =>
                dispatch({ type: "SET_AMOUNT", amount: target.value })
              }
            />
            <input
              data-testid="note"
              type="text"
              onChange={({ target }) =>
                dispatch({ type: "SET_NOTETEXT", notesText: target.value })
              }
            />
            <button
              data-testid="create-entry-btn"
              type="button"
              className={`${entryType === 1 ? "green-btn" : "red-btn"}`}
              onClick={onSubmit}
              disabled={!amount || !notesText}
            >
              {`${entryType === 1 ? "IN" : "OUT"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
