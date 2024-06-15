const tf = require('@tensorflow/tfjs');
require('dotenv').config();

const { loadTFDFModel } = require('@tensorflow/tfjs-tfdf');
const { io } = require('@tensorflow/tfjs-core');

const BUCKET_URL = process.env.MODEL_URL;

async function loadModel() {
    return await loadTFDFModel({
        loadModel: () =>
            fetch(`${BUCKET_URL}/model.json`)
                .then(response => response.json())
                .then(modelJson =>
                    io.getModelArtifactsForJSON(modelJson, weightsManifest =>
                        fetch(`${BUCKET_URL}/group1-shard1of1.bin`)
                            .then(response => response.arrayBuffer())
                            .then(weightData => [io.getWeightSpecs(weightsManifest), weightData])
                    )
                ),
        loadAssets: () =>
            fetch(`${BUCKET_URL}/assets.zip`).then(response => response.arrayBuffer())
    });
}

module.exports = loadModel;