import { EventLoop, MacroTask, MicroTask } from "./event-loop";

const eventLoop = new EventLoop();

new MacroTask(eventLoop, (macroTask: MacroTask) => {
  console.log(123);

  new MicroTask(macroTask, () => {
    console.log('001');
  });

  new MacroTask(eventLoop, (macroTask: MacroTask) => {
    console.log(789);

    new MicroTask(macroTask, () => {
      console.log('002');
    });
  });
});

new MacroTask(eventLoop, (macroTask: MacroTask) => {
  console.log(456);

  new MicroTask(macroTask, () => {
    console.log('003');
  });
});

eventLoop.run();

// output:
// 123
// 001
// 456
// 003
// 789
// 002