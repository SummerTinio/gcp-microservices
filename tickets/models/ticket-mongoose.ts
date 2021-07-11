// Mongoose Interfaces in order: Attrs --> Doc --> Model

import mongoose from 'mongoose';

// attributes required to build a new ticket
// -- from the user
interface TicketAttrs {
  title: string,
  price: number,
  userId: string
}

// properties that every ticket document has
interface TicketDoc extends mongoose.Document {
  title: string,
  price: number,
  userId: string,
  createAt: string
}

// properties tied to the Model itself
// e.g. any static methods like Ticket.build()
interface TicketModel extends mongoose.Model<TicketDoc>{
  build: (attrs: TicketAttrs) => TicketDoc,
}

// Mongoose-specific validation
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

// to enable type-checking for attributes
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;