interface RunnablePort {
  run: () => void;
}

export const runNextOneTask = (fifoQueue: RunnablePort[]) => {
  const nextOneTask = fifoQueue.shift();

  if (nextOneTask) {
    nextOneTask.run();
  }
};
