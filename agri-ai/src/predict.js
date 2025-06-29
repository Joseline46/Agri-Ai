import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  const model = await tf.loadLayersModel('/maize_tfjs_model/model.json');
  return model;
}

export async function predict(model, inputArray) {
  const inputTensor = tf.tensor2d([inputArray]);
  const prediction = model.predict(inputTensor);
  const values = await prediction.array();
  return values[0][0];
}

// Example usage
(async () => {
  const model = await loadModel();
  const prediction = await predict(model, [2025, 3, 15, 6]);
  console.log(`Predicted Quantity (kg): ${prediction.toFixed(2)}`);
})();
