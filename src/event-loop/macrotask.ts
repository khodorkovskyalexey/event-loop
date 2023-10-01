import { EventLoopPort } from "./event-loop";
import { Handler } from "./common/types";
import { MicroTaskPort } from "./microtask";

export interface MacroTaskPort {
  addMicroTask: Handler<MicroTaskPort>;
  run: () => void;
}

export class MacroTask implements MacroTaskPort {
  private handler: Handler<MacroTaskPort>;

  constructor(private readonly eventLoop: EventLoopPort, handler: Handler<MacroTaskPort>) {
    this.handler = handler;
    eventLoop.addMacroTask(this);
  }

  run() {
    this.handler(this);
  }

  addMicroTask(microTask: MicroTaskPort) {
    this.eventLoop.addMicroTask(microTask);
  }
}
