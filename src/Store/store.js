import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["recipe"],
  whitelist: ["auth", "secondaryTables"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export let store = createStore(persistedReducer, composeWithDevTools());
export let persistor = persistStore(store);
