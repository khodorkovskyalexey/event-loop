import { Handler } from "./common/types";
import { runNextOneTask } from "./common/utils";
import { MacroTaskPort } from "./macrotask";
import { MicroTaskPort } from "./microtask";

export interface EventLoopPort {
  addMacroTask: Handler<MacroTaskPort>;
  addMicroTask: Handler<MicroTaskPort>;
  run: () => void;
}

export class EventLoop implements EventLoopPort {
  private macroTaskQueue: MacroTaskPort[] = [];
  private microTaskQueue: MicroTaskPort[] = [];

  addMacroTask(macroTask: MacroTaskPort) {
    this.macroTaskQueue.push(macroTask);
  }

  addMicroTask(microTask: MicroTaskPort) {
    this.microTaskQueue.push(microTask);
  }

  run() {
    // run macrotasks
    while (this.macroTaskQueue.length) {
      runNextOneTask(this.macroTaskQueue);

      // run microtasks of current macrotask
      while (this.microTaskQueue.length) {
        runNextOneTask(this.microTaskQueue);
      }
    }
  }
}
