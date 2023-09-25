type Handler<T> = (task: T) => void;

interface MacroTaskPort {
  addMicroTask: Handler<MicroTask>;
}

interface EventLoopPort {
  addMacroTask: Handler<MacroTask>;
}

export class MicroTask {
  private handler: Handler<MicroTask>;

  constructor(macroTask: MacroTaskPort, handler: Handler<MicroTask>) {
    this.handler = handler;
    macroTask.addMicroTask(this);
  }

  run() {
    this.handler(this);
  }
}

export class MacroTask {
  private handler: Handler<MacroTask>;
  private microTaskQueue: MicroTask[] = [];

  constructor(eventLoop: EventLoopPort, handler: Handler<MacroTask>) {
    this.handler = handler;
    eventLoop.addMacroTask(this);
  }

  run() {
    this.handler(this);
    while (this.microTaskQueue.length) {
      const nextOneMicroTask = this.microTaskQueue.shift();

      if (nextOneMicroTask) {
        nextOneMicroTask.run();
      }
    }
  }

  addMicroTask(microTask: MicroTask) {
    this.microTaskQueue.push(microTask);
  }
}

export class EventLoop implements EventLoopPort {
  private macroTaskQueue: MacroTask[] = [];

  addMacroTask(macroTask: MacroTask) {
    this.macroTaskQueue.push(macroTask);
  }

  run() {
    while (this.macroTaskQueue.length) {
      const nextOneMacroTask = this.macroTaskQueue.shift();

      if (nextOneMacroTask) {
        nextOneMacroTask.run();
      }
    }
  }
}
