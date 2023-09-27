import { EventLoopPort } from "./event-loop";
import { Handler } from "./types";
import { MicroTaskPort } from "./microtask";

export interface MacroTaskPort {
  addMicroTask: Handler<MicroTaskPort>;
  run: () => void;
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
