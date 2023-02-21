import { legacy_createStore, combineReducers } from "redux";
import { CollApsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
//引入redux-persist这个包做数据持久化 存到本地localStorage中
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["LoadingReducer"], //黑名单  不会对他进行持久化
};

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);

const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
