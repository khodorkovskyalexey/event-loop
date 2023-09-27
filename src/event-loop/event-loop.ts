import { Handler } from "./types";
import { MacroTaskPort } from "./macrotask";

export interface EventLoopPort {
  addMacroTask: Handler<MacroTaskPort>;
  run: () => void;
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
