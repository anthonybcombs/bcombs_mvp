import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import { takeLatest, takeLeading } from "redux-saga/effects";
import * as actionType from "../actions/Constant";
import { authenticated } from "../actions/Auth";
import { addCalendar } from "../actions/Calendars";
import { deletedEvent, updatedEvent, addedEvent } from "../actions/Events";
import reducer from "../reducers";
function* rootSaga() {
  yield takeLatest(actionType.REQUEST_AUTH, authenticated);
  yield takeLatest(actionType.REQUEST_ADD_CALENDAR, addCalendar);

  yield takeLatest(actionType.REQUEST_ADD_EVENT, addedEvent);
  yield takeLatest(actionType.REQUEST_DELETE_EVENT, deletedEvent);
  yield takeLatest(actionType.REQUEST_UPDATE_EVENT, updatedEvent);
}
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
