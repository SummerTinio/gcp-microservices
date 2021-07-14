// import { Publisher, Subjects, TicketCreatedEvent } from '@craftcrewandco/common'
import Publisher from '../../../common/src/stan/abstract class/ac-publisher';
import Subjects from '../../../common/src/stan/enum-subjects';
import TicketUpdatedEvent from '../../../common/src/stan/event interfaces/ticket-updated-event';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.ticketUpdated = Subjects.ticketUpdated;
}

export default TicketUpdatedPublisher;