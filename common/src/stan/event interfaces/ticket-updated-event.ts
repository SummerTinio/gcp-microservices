import Subjects from '../enum-subjects';

interface TicketUpdatedEvent {
  subject: Subjects.ticketUpdated;
  /**
   * make sure to pull this data off of the actual Mongoose document,
   * *never* from the req.body!
   */
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  }
}

export default TicketUpdatedEvent;