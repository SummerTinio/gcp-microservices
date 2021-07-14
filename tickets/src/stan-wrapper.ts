import nats from 'node-nats-streaming';

/**
 * wrapper for a stan (nats-streaming) 
 * client singleton.
 */
class StanWrapper {
  /**
   * undefined at this point. 
   * 
   * will only be defined when stan.connect() is called
   */
  private _client?: nats.Stan; // <-- undefined at this point. will only be defined when StanWrapper.connect() is called

  /**
   * to reference the actual stan client,
   * - from outside: reference `stan.client`, *not* stan.client()
   *   - e.g. `stan.client.on('close', () => { ... })`
   * - from inside this StanWrapper class: reference `this.client`
   * 
   * purpose
   * - to expose stan client to outside world,
   * but still make TS complain when
   * anyone tries to modify that client (since it's still a private property)
   */
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  /**
   * @param clusterID the -cid from your natsstreaming YAML file
   * @param clientID arbitrary name for each particular instance of the service
   * @param url url pointing to the natsstreaming srv (not the deployment) on Port 4222 (the client port, not the monitoring port). 
   * 
   * - on GCP (live): http:// natsstreaming-srv:4222 , 
   * - or on local machine: http:// localhost:4222 ... then kubectl port-forward natsstreaming-depl-iddfsfgibberish 4222:4222
   */
  connect(clusterID: string, clientID: string, url: string) {
    this._client = nats.connect(clusterID, clientID, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS!');
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err)
      });

    });
  }
};

/**
 * call `await stan.connect()` to get the *instantiated, configured* stan client singleton
 * - client will only be defined after calling `stan.connect()`
 * - no built-in graceful exit mechanism.
 * - implement graceful exit from `mongodb-starter.ts`!
 *   - from inside `mongodb-starter.ts`: use entire graceful exit spt.
 *   - from inside route handler (PUB): `await new TicketUpdatedPublisher(stan.client).publish({ ... })`
 *   - from inside route handler (SUB): `new TicketUpdatedListener(stan.client).listen()`
 */
const stan = new StanWrapper();

export default stan;
  // pattern/could also be export const stanWrapper = new StanWrapper();
