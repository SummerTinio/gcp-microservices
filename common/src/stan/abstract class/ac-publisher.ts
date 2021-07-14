import nats from 'node-nats-streaming';
import Subjects from '../enum-subjects';

interface PublisherEvent {
  /**
   * i.e. can be any of the ff.
   * - Subjects.ticketCreated
   * - Subjects.orderUpdated ... etc. --> check your Subjects enum file!
   */
  subject: Subjects;
  /**
   * make sure to pull this data off of the actual Mongoose document,
   * *never* from the req.body!
   */
  data: any;
}

abstract class Publisher<T extends PublisherEvent> {
  constructor(client: nats.Stan) {
    this.client = client;
  }

  abstract subject: T['subject'];
  private client: nats.Stan;

  /** 
   * `try { await publisher.publish({ ... }) 
   * } catch (err) { ... }`
   * 
   * - make sure to pull your data off the actual Mongoose document,
   * NEVER from req.body directly!
  */
  publish(data: T['data']): Promise<void> {

    return new Promise((resolve, reject) => {

      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    });
  }
}

export default Publisher;