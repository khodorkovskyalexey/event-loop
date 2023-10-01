import { Handler } from "./common/types";
import { MacroTaskPort } from "./macrotask";

export interface MicroTaskPort {
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
