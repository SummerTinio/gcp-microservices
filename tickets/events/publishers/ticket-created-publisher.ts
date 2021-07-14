// import { Publisher, Subjects, TicketCreatedEvent } from '@craftcrewandco/common'
import Publisher from '../../../common/src/stan/abstract class/ac-publisher';
import Subjects from '../../../common/src/stan/enum-subjects';
import TicketCreatedEvent from '../../../common/src/stan/event interfaces/ticket-created-event';


class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.ticketCreated = Subjects.ticketCreated;
}

export default TicketCreatedPublisher;