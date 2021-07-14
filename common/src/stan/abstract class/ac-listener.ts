import nats from 'node-nats-streaming';
import Subjects from '../enum-subjects';

/**
 * any general STAN event or message
 * - from w/c abstract class generic extends from
 * 
 * `abstract class Listener<T extends ListenerEvent>`
 */
 interface ListenerEvent {
  /**
   * i.e. can be any of the ff.
   * - Subjects.ticketCreated
   * - Subjects.orderUpdated .. etc. --> check your Subjects enum file!
   */
  channel: Subjects;
  /**
   * type your data in the subclass itself -- i.e.
   * - interface TicketCreatedEvent {
        channel: Subjects.ticketCreated;
        data: {
          id: string;
          title: string;
          price: number;
        }
      }
   * - `onMessage(parsedData: TicketCreatedEvent['data'], rawMsg: nats.Message)`
   */
  data: any;
}


/**
 * Reusable wrapper for STAN Listener (nats-streaming) pub-sub.
 * 
 * to use this:
 * - create a subclass of Listener
 * - instantiate that subclass and call .listen()
 * 
 * `new TicketCreatedListener(stan).listen()`
 */
abstract class Listener<T extends ListenerEvent>{
  constructor(client: nats.Stan) {
    this.client = client;
  }
  /**
   *  name of channel this Listener will subscribe to
   *  - **make sure to mark this as readonly** (a.k.a. 'final' in Java terms)
   *  - `readonly channel: Subjects.ticketCreated = Subjects.ticketCreated`
   *  - note: Channel.ticketCreated maps to 'ticket:created'
   * 
   * POV of listener
   * - channel === something we listen to
   * - subscription === allows us to listen to that channel
   * 
   * POV of publisher
   * - subject === name of channel we want to publish to
   * - data === data we're publishing to the subject
   * 
   */
  abstract channel: T['channel'];

  /**
   *  name of queue Group this listener will join.
   *  - use process.env.MS (name of microservice)
   *  - **queueGroupName === durable Name** in this case.
   *  
   *  `queue group name` - to ensure only 1 stan instance receives the message. i.e. to prevent double-processing
   *  
   *  `durable name` - to persist tracking of processed messages
   */
  abstract queueGroupName: string;

  /**
   * max # of seconds this listener has
   * to ack a message
   * 
   * __ * 1000 = __ seconds
   */
  protected ackWait = 5 * 1000;

  /**
   *  pre-initialized STAN client. a.k.a. 'stan'
   * 
   *  stored, instantiated call to nats.connect()
   */
  private client: nats.Stan;

  /**
   * configured subscription options.
   * @returns nats.SubscriptionOptions -- i.e. stan.subscriptionOptions()
      - .setManualAckMode(true)
      - .setDeliverAllAvailable()
      - .setAckWait(this.ackWait)
      - .setDurableName(this.queueGroupName);
   */
  subscriptionOptions(): nats.SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }
  /**
   *  fxn to run when message is received
   * 
   *  e.g. callback w/ code to process data in persistent db. 
   *  - must call rawMsg.ack() manually!
   */
  abstract onMessage(parsedData: any, rawMsg: nats.Message): void;

  /**
   * sets up subscription
   * - to a particular channel, e.g. Subjects.ticketCreated
   * - channel === this.subject
   */
  listen() {
    const subscription: nats.Subscription = this.client.subscribe(
      this.channel,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: nats.Message) => {
      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    })
  }

  parseMessage(msg: nats.Message) {
    const data = msg.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
  }
}

export default Listener;