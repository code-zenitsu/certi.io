
const express = require('express');
const mongoose = require('mongoose');
const certificatesRouter = require('./routes/certificates');
const { mongoURI } = require('./config');

const app = express();
const port = 3000;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());
app.use('/api/certificates', certificatesRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
