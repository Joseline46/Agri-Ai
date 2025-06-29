//  If You Want to Predict on New Data Later
// You’ll need to provide:

// Year

// Month

// Day

// DayOfWeek

// For example:

// python
// Copy
// Edit
// new_data = pd.DataFrame([{
//     'Year': 2025,
//     'Month': 3,
//     'Day': 15,
//     'DayOfWeek': 5  # Saturday
// }])

// prediction = model.predict(new_data)
// print(f"Predicted quantity: {prediction[0]:.2f} kg")