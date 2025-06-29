import * as tf from '@tensorflow/tfjs';

let model;

export async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('/maize_tfjs_model/model.json');
    console.log('✅ TFJS model loaded');
  }
  return model;
}

export async function predictMaize(inputArray) {
  const model = await loadModel();
  const inputTensor = tf.tensor2d([inputArray]); // e.g. [day, month, weekday]
  const outputTensor = model.predict(inputTensor);
  const prediction = await outputTensor.data();
  return prediction[0]; // predicted quantity
}
