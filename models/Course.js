const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, "Please Add A Title For Course"],
        trim: true,
        maxlength: [50, "Title cannot be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please Add Description For Course"],
        maxlength: [500, "Description cannot be more than 500 characters"]
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please Add A Valid Url"
        ]
    },
    address: String,
    phone: {
        type: String,
        maxlength: [11, "Phone Cannot Be More Than 11 Characters"]
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            "Please Add A Valid Email"
        ]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: [true, "Careers are required"],
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science', 
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating cannot be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobGurantee: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

CourseSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

CourseSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);

    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].country
    }
    next();
});

CourseSchema.pre('remove', async function(next) {
    await this.model('Subject').deleteMany({ course: this._id });
    next();
});

CourseSchema.virtual('subjects', {
    ref: 'Subject',
    localField: '_id',
    foreignField: 'course'
});

module.exports = mongoose.model('Course', CourseSchema);