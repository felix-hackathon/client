import { RootState, Store } from './store'

export default class ReduxService {
  static getState(): RootState {
    return Store.getState()
  }

  static getUser() {
    return Store.getState().user
  }

  static dispatch(action: any) {
    return Store.dispatch(action)
  }
}
