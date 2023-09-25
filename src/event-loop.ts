type Handler<T> = (task: T) => void;

export interface MicroTaskPort {
  run: () => void;
}

export interface MacroTaskPort {
  addMicroTask: Handler<MicroTask>;
  run: () => void;
}

export interface EventLoopPort {
  addMacroTask: Handler<MacroTaskPort>;
  run: () => void;
}

export class MicroTask implements MicroTaskPort {
  private handler: Handler<MicroTaskPort>;

  constructor(macroTask: MacroTaskPort, handler: Handler<MicroTaskPort>) {
    this.handler = handler;
    macroTask.addMicroTask(this);
  }

  run() {
    this.handler(this);
  }
}

export class MacroTask implements MacroTaskPort {
  private handler: Handler<MacroTaskPort>;
  private microTaskQueue: MicroTaskPort[] = [];

  constructor(eventLoop: EventLoopPort, handler: Handler<MacroTaskPort>) {
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

  addMicroTask(microTask: MicroTaskPort) {
    this.microTaskQueue.push(microTask);
  }
}

export class EventLoop implements EventLoopPort {
  private macroTaskQueue: MacroTaskPort[] = [];

  addMacroTask(macroTask: MacroTaskPort) {
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
