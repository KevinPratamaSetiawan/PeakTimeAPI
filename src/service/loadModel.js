const tf = require('@tensorflow/tfjs');
const tfdf = require('@tensorflow/tfjs-tfdf');
require('dotenv').config();

async function loadModel() {
    return tfdf.loadTFDFModel(process.env.MODEL_URL);
}

module.exports = loadModel;