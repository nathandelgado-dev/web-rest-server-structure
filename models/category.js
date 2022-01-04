const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: {
        type: String,
        required: (true, 'The name is requiered'),
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

categorySchema.methods.toJSON = function() {
    const { __v, state, ...data } = this.toObject();
    return data;
}
module.exports = model('Categorie', categorySchema);