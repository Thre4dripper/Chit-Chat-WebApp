import React from "react";
import ChatsFragment from "./screens/ChatsFragment.tsx";
import ChattingFragment from "./screens/ChattingFragment.tsx";

const App: React.FC = () => {
    return <div className={'flex flex-row bg-slate-900/90 '}>
        <div className={'w-[25rem]'}>
            <ChatsFragment/>
        </div>
        <div className={'flex-1 w-2/3'}>
            <ChattingFragment/>
        </div>
    </div>
}

export default App
