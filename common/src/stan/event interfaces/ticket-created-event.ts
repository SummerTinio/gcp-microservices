import Subjects from '../enum-subjects';

interface TicketCreatedEvent {
  subject: Subjects.ticketCreated;
  /**
  * make sure to pull this data off of the actual Mongoose document,
  * *never* from the req.body!
  */
  data: {
    id: string;
    title: string;
    price: number;
    userId: number;
  }
}

export default TicketCreatedEvent;