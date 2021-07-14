class StanWrapper {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => { // <-- this is the actual fxn that'll get invoked when stan.publish() is called from inside a test
        callback();
    });
  } 
}

const stan = new StanWrapper();

export default stan;