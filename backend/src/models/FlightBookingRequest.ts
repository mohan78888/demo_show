import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPassenger {
  paxType: 'Adult' | 'Child' | 'Infant';
  title: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  age?: number;
  dob?: string;
  passportNumber?: string;
  nationality?: string;
}

export interface IFlightBookingRequest extends Document {
  requestId: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  flight: {
    airline: string;
    flightNumber?: string;
    origin: string;
    destination: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    travelDate: string;
    returnDate?: string;
    travelClass?: string;
    price?: number;
    currency?: string;
    stops?: number;
  };
  passengers: IPassenger[];
  passengerCount: number;
  remarks?: string;
  status: 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED';
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const passengerSchema = new Schema<IPassenger>(
  {
    paxType: {
      type: String,
      enum: ['Adult', 'Child', 'Infant'],
      default: 'Adult',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Passenger title is required'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'Passenger first name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Passenger last name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Passenger gender is required'],
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    dob: {
      type: String,
      trim: true,
    },
    passportNumber: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const flightBookingRequestSchema = new Schema<IFlightBookingRequest>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        lowercase: true,
        trim: true,
      },
      mobile: {
        type: String,
        required: [true, 'Customer mobile is required'],
        trim: true,
      },
    },
    flight: {
      airline: {
        type: String,
        required: [true, 'Flight airline is required'],
      },
      flightNumber: {
        type: String,
        default: '',
      },
      origin: {
        type: String,
        required: [true, 'Origin airport/city is required'],
      },
      destination: {
        type: String,
        required: [true, 'Destination airport/city is required'],
      },
      departureTime: {
        type: String,
        default: '',
      },
      arrivalTime: {
        type: String,
        default: '',
      },
      duration: {
        type: String,
        default: '',
      },
      travelDate: {
        type: String,
        required: [true, 'Travel date is required'],
      },
      returnDate: {
        type: String,
        default: '',
      },
      travelClass: {
        type: String,
        default: 'Economy',
      },
      price: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      stops: {
        type: Number,
        default: 0,
      },
    },
    passengers: {
      type: [passengerSchema],
      required: [true, 'At least one passenger is required'],
      validate: {
        validator: function (v: IPassenger[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one passenger must be provided.',
      },
    },
    passengerCount: {
      type: Number,
      required: true,
      default: 1,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [1000, 'Remarks cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const FlightBookingRequest: Model<IFlightBookingRequest> =
  mongoose.models.FlightBookingRequest ||
  mongoose.model<IFlightBookingRequest>('FlightBookingRequest', flightBookingRequestSchema);

export default FlightBookingRequest;
