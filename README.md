# ERA2 Generation Queue
Тестовый экран живой очереди генераций для ERA2.
`React 19` · `TypeScript strict` · `Vite` · `Tailwind CSS v4` · `lucide-react`
## Запуск
```bash
npm install
npm run dev
```
Проверки перед ревью: `npm run lint` и `npm run build`.
## Реализовано
Живая очередь без backend: `queued`, `running`, `done`, `failed`, `cancelled`.
- `MAX_CONCURRENT = 2`, FIFO promotion по `createdAt`.
- Тики прогресса, разные скорости для `text`, `image`, `video`, `audio`.
- Случайные ошибки генерации с понятными сообщениями.
- Фильтры status/type, поиск по prompt/model, сортировка newest/oldest.
- Desktop rows, mobile cards, loading/error/empty states.
- Persist в `localStorage`; при restore `running` переводится в `queued`.
- Global floating status bar для активных генераций.
## Дополнительно
- Создание задачи через модалку.
- Перезапуск симуляции через fresh seed.
- `cloneFreshSeed()` для актуальных timestamp.
- Градиентный progress bar с `prefers-reduced-motion`.
## Карта ревью
- Domain types: `src/entities/generation-task/model/types.ts`
- Seed: `src/entities/generation-task/model/seed.ts`
- Reducer FSM: `src/features/generation-queue/model/queueReducer.ts`
- Engine event source: `src/features/generation-queue/model/queueEngine.ts`
- Selectors: `src/features/generation-queue/model/selectors.ts`
- Provider: `src/features/generation-queue/model/QueueProvider.tsx`
- Queue UI: `src/features/generation-queue/ui/`
- Widget: `src/widgets/generation-queue/ui/GenerationQueue.tsx`
- Global status bar: `src/features/generation-queue/ui/GlobalGenerationStatus.tsx`
## Архитектура
- Store: `Context + useReducer`, без Zustand/RTK.
- Reducer держится как чистый finite state machine.
- Engine не мутирует state, а dispatch-ит actions.
- `QueueProvider` монтируется в `App`.
- Page и status bar читают один source of truth.
- Public API слайсов идёт через `index.ts`, без deep imports между слайсами.
## Не делалось
Backend, auth и chat screen не реализовывались.
