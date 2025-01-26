import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model'
type MutableLiveDataState = {
    searchResult: UserModel[]
}
type MutableLiveDataActions = {
    setSearchResult: (newSearchResult: UserModel[]) => void
}

const MutableLiveDataStore = create<MutableLiveDataState & MutableLiveDataActions>()(
    devtools(
        immer((set) => ({
            searchResult: [],
            setSearchResult: (newSearchResult) =>
                set((state) => {
                    state.searchResult = newSearchResult;
                }),
        }))
    )

)
export default MutableLiveDataStore