import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import { takeLatest, takeLeading } from "redux-saga/effects";
import * as actionType from "../actions/Constant";
import { authenticated } from "../actions/Auth";
import reducer from "../reducers";
function* rootSaga() {
  yield takeLeading(actionType.REQUEST_AUTH, authenticated);
}
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  reducer,
  compose(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
