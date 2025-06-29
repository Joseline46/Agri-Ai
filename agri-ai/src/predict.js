import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  const model = await tf.loadLayersModel('/maize_model/model.json');
  return model;
}

export async function predict(model, inputArray) {
  const inputTensor = tf.tensor2d([inputArray]);
  const prediction = model.predict(inputTensor);
  const values = await prediction.array();
  return values[0][0];
}

