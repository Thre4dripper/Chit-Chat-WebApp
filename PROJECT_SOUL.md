# Chit Chat WebApp Project Soul

Date: 2026-05-17
Baseline branch: `main`

This file captures the way the project currently wants to be written. Treat it as the review baseline for future branches: new work should feel like it belongs beside the code already accepted into `main`, unless there is a deliberate reason to evolve the style.

## Product Shape

Chit Chat WebApp is an unfinished React web replica of the public Android project `Thre4dripper/Chit-Chat-AndroidApp`. The web app already mirrors the Android project's Firebase-centered model:

- Users, chats, groups, messages, and registered UID mappings are explicit domain concepts.
- Direct-message chat IDs are deterministic and based on the two users.
- Messages support text, image, sticker, deleted, and first-message types.
- Firebase is the source of truth; Zustand stores mostly coordinate UI state and repository calls.

The product is not trying to be a generic chat template. It is a web version of an existing Chit Chat experience, with Android parity as a guide.

## Folder Responsibilities

- `src/screens`: full page-level React screens such as auth and home.
- `src/fragments`: larger composed page sections grouped by domain, such as home, auth, and profile flows.
- `src/components`: reusable UI pieces.
- `src/components/chat`: chat-specific shell pieces such as `ChatBox`, `ChatHeader`, and `ChatInput`.
- `src/components/chatMessages`: message body renderers.
- `src/components/listItems`: repeated list/message row components, often named with `Item` prefixes.
- `src/dialogs`: modal flows and confirmation UI live under `src/components/dialogs`.
- `src/store`: Zustand stores with UI state and action coordination.
- `src/repositories`: application/domain adapters between stores and Firebase wrappers.
- `src/firebase`: low-level Firebase SDK wrappers grouped by domain.
- `src/models`: class-based models that extend `BaseModel`.
- `src/enums`: TypeScript enums and maps for message/chat types.
- `src/constants`: shared strings, collection names, storage folders, and app constants.
- `src/utils`: focused helpers for Firebase CRUD, storage conversion, chat IDs, Lottie stickers, and general utilities.

## TypeScript And Formatting

- TypeScript is strict: `strict`, `noUnusedLocals`, and `noUnusedParameters` are enabled.
- Imports commonly include explicit `.ts` and `.tsx` extensions for local files.
- Prettier style is 4 spaces, no semicolons, single quotes, trailing commas where valid, 100 print width, and `bracketSameLine` enabled.
- The code accepts `any` in limited places, especially for generic Firebase maps and imported Lottie JSON assets.
- ESLint includes React, React Hooks, TypeScript, React Refresh, and jsx-a11y rules. `yarn lint` is intended to be the gate.

## React Component Style

- Components are usually declared as `const Name: React.FC<Props> = (...) => { ... }`.
- Props interfaces use a `Props` suffix or a local descriptive type.
- Components often destructure props in the function signature.
- Small message renderers can be nested inside a parent component when they are tightly coupled to that parent.
- JSX uses a practical mix of MUI components and Tailwind classes.
- MUI icons are the normal icon source.
- Current UI style favors rounded chat surfaces, slate/blue backgrounds, MUI dialogs, and Tailwind utility layout.

## State Management Style

Stores follow this pattern:

```ts
type someState = {
    value: string | null
}

type someActions = {
    setValue: (value: string | null) => void
}

const useSomeStore = create<someState & someActions>()(
    devtools(
        immer((set) => ({
            value: null,
            setValue: (value) => {
                set((state) => {
                    state.value = value
                })
            },
        }))
    )
)
```

Important store conventions:

- Use `zustand`, `devtools`, and `immer` together.
- Use `persist` only where state must survive reloads.
- Stores can call repositories directly.
- Cross-store reads use `useOtherStore.getState()` when needed.
- Stores should not contain raw Firebase SDK calls; that belongs in repositories or Firebase wrappers.
- Store action names are direct and domain-oriented: `setChatDetails`, `sendTextMessage`, `checkUserRegistration`, `startChat`.

## Repository And Firebase Style

The project uses a three-layer flow:

1. UI components call store actions.
2. Stores call repository methods.
3. Repositories call `src/firebase` wrapper classes.

Repository files are named `*.repository.ts`. Firebase wrapper classes usually expose static methods. The style is callback-first rather than promise-first:

```ts
SomeFirebaseClass.someAction(firestore, input, (result) => {
    // update store or call callback
})
```

Error handling usually logs with `console.error` or `console.log` and returns `false`, `null`, or a callback value rather than throwing.

## Models And Data Shape

- Models are classes, not interfaces.
- Domain models extend `BaseModel`, which provides `toObject()`.
- Model names end in `Model`: `UserModel`, `ChatMessageModel`, `HomeChatModel`, `ChatModel`.
- Constructors list all stored fields directly.
- Firestore write code often converts model instances through `toObject()` or object spread.

Key chat concepts:

- `ChatModel` stores `chatId`, two `DMChatUserModel`s, `chatMessages`, and `mutedBy`.
- `ChatMessageModel` extends `MessageModel` and adds `type`, `from`, and `to`.
- `ChatMessageType` includes text, image, sticker, first message, and deleted-message variants.

## Constants And Enums

- Firestore collection names live in `src/constants/FireStoreCollections.ts`.
- User-facing success and error strings should live in constants when reused or important.
- Message and chat type values live in `src/enums`.
- Sticker assets are mapped in `src/enums/stickerMap.ts`.

## UI Writing Style

The project is informal but purposeful. Common patterns:

- Tailwind handles layout, spacing, overflow, and quick colors.
- MUI handles inputs, dialogs, avatars, buttons, icons, badges, and typography.
- Screens are not highly abstracted; components stay close to the feature they serve.
- Chat UI uses directional component names, such as `ItemChatTextLeft` and `ItemChatTextRight`.
- Fragments are treated as real page sections rather than tiny atomic components.

## Accepted Rough Edges In Main

These currently exist in `main`, so a reviewer should not treat every instance as a branch-only failure. Still, future work should improve them when touched:

- Callback nesting around Firebase.
- Console logs used as development traces.
- Some TODO comments for unfinished Android parity.
- Occasional `any` for Firebase maps and Lottie data.
- Mixed naming style for some type aliases, such as lower-case state/action type names.
- Some component names and comments carry typos from active development.

## Merge Style Rules For New Branches

Before merging a branch into `main`, check that it:

- Preserves the store -> repository -> Firebase wrapper layering.
- Uses existing model classes and enums instead of parallel data shapes.
- Keeps Firebase writes compatible with Android/web schema expectations.
- Uses Firebase Storage for image files and stores URLs in Firestore, not large base64 blobs.
- Keeps dependency changes intentional and minimal.
- Avoids raw `alert`, profanity/debug strings, hardcoded user data, and placeholder copy in user-facing flows.
- Keeps imported local paths consistent with the rest of the branch.
- Passes `yarn lint` and `yarn build` before merge.
- Does not remove CI or analysis config unless the team explicitly wants it removed.

## Better Technique For Future Reviews

Use this file as the baseline, then review feature branches with a repeatable local checklist:

1. Keep `main` clean.
2. Run `git diff --stat main...branch` and `git diff --name-status main...branch`.
3. Run branch checks in a temporary worktree: `git worktree add /tmp/project-branch branch`.
4. Run `yarn install --frozen-lockfile`, `yarn lint`, and `yarn build` inside the worktree.
5. Compare changes against this soul file and the Android reference app.
6. Fix merge blockers on the feature branch, then retest.
