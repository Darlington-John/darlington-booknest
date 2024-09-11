import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the currentlyReading sub-schema


const currentlyReadingSchema: Schema = new Schema({
  name: { type: String, required: false},
  url: { type: String, required: false},
  pdf: { type: String, required: false},
  title: { type: String, required: false},
  author: { type: String, required: false},
  donatedPdf: { type: String, required: false},
  coverImage: { type: String, required: false},
  pageCount: { type: Number, required: false},
  donatedBy: { type: String, required: false},

});

const alreadyReadSchema: Schema = new Schema({
  name: { type: String, required: false},
  url: { type: String, required: false},
  pdf: { type: String, required: false},
  title: { type: String, required: false},
  author: { type: String, required: false},
  donatedPdf: { type: String, required: false},
  coverImage: { type: String, required: false},
  pageCount: { type: Number, required: false},
  donatedBy: { type: String, required: false},
});

const toReadSchema: Schema = new Schema({
  name: { type: String, required: false},
  url: { type: String, required: false},
  pdf: { type: String, required: false},
  title: { type: String, required: false},
  author: { type: String, required: false},
  donatedPdf: { type: String, required: false},
  coverImage: { type: String, required: false},
  pageCount: { type: Number, required: false},
  donatedBy: { type: String, required: false},
});

const shelfSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  books: [
    {

      pdf: { type: String, required: false },
      title: { type: String, required: false },
      url: { type: String, required: false },
      author: { type: String, required: false },
      coverImage: { type: String, required: false },
      pageCount: { type: Number, required: false },
      donatedBy: { type: String, required: false },
      _id: false,
    }
  ]
});

const bookSchema: Schema = new mongoose.Schema({title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String, required: false }, // URL to the PDF file
  coverImage: { type: String, required: false }, // URL to the cover image
  genres: {
    mystery: { type: Boolean, default: false },
    sciFi: { type: Boolean, default: false },
    romance: { type: Boolean, default: false },
    tragedy: { type: Boolean, default: false },
    comedy: { type: Boolean, default: false },
    horror: { type: Boolean, default: false },
    youngAdult: { type: Boolean, default: false },
    inspirational: { type: Boolean, default: false },
    biography: { type: Boolean, default: false },
  },
  pageCount: { type: Number, required: true },
  authorProfile: { type: String, required: false }, // URL to the author's profile picture
  aboutAuthor: { type: String, required: false },
  donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who donated the book
}, { timestamps: true });

interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  pdf: string;
  coverImage: string;
  genres: {
    mystery: boolean;
    sciFi: boolean;
    romance: boolean;
    tragedy: boolean;
    comedy: boolean;
    horror: boolean;
    youngAdult: boolean;
    inspirational: boolean;
    biography: boolean;
  };
  pageCount: number;
  authorProfile?: string;
  aboutAuthor?: string;
  donatedBy: mongoose.Types.ObjectId;
}
interface ICurrentlyReading {
  name: string;
  url: string;
  pdf: string;
  title: string;
  author: string;
  donatedPdf: string;
  coverImage: string;
  pageCount: number;
  donatedBy: string;
}
interface IAlreadyRead {
  name: string;
  url: string;
  pdf: string;
  title: string;
  author: string;
  donatedPdf: string;
  coverImage: string;
  pageCount: number;
  donatedBy: string;
}
interface IToRead {
  name: string;
  url: string;
  pdf: string;
  title: string;
  author: string;
  donatedPdf: string;
  coverImage: string;
  pageCount: number;
  donatedBy: string;
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile: string;
  currentlyReading: ICurrentlyReading[];
  alreadyRead: IAlreadyRead[];
  toRead: IToRead[];
  shelves: Array<{
    name: string;
    description: string;
    books: Array<{
      url?: string;
      pdf?: string;
      title?: string;
      author?: string;
      donatedPdf?: string;
      coverImage?: string;
      pageCount?: number;
      donatedBy?: string;
    }>; // Array of book URLs
  }>;
  donatedBooks: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profile: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentlyReading: { type: [currentlyReadingSchema], default: [] }, // Set default value to []
  alreadyRead: { type: [alreadyReadSchema], default: [] },
  toRead: { type: [toReadSchema], default: [] },
  shelves: { type: [shelfSchema], default: [] },
  donatedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: [] }]
});

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', bookSchema);
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
export { Book };
export type { IUser, IBook };
