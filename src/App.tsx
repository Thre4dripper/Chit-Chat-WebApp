import { ChatsFragment } from "./screens/ChatsFragment.tsx";
import { ChattingFragment } from "./screens/ChattingFragment.tsx";

function App() {
    return <div className={'flex flex-row'}>
        <div className={'w-[25rem] shrink-0'}>
            <ChatsFragment/>
        </div>
        <div className={'flex-1 w-2/3'}>
            <ChattingFragment/>
        </div>
    </div>
}

export default App
