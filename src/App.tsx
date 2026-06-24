import { QueuePage } from "@/pages";
import {
  GlobalGenerationStatus,
  QueueProvider,
} from "@/features/generation-queue";

export default function App() {
  return (
    <QueueProvider>
      <QueuePage />
      <GlobalGenerationStatus />
    </QueueProvider>
  );
}
