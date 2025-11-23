# Crime Rate Detection Project

A web application that predicts crime rates in specific cities or areas using machine learning.

## Features

- Interactive web interface for crime rate prediction
- Machine learning model trained on crime data
- Real-time predictions based on location and other factors
- Modern and responsive UI

## Setup Instructions

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Train the model (optional - model is pre-trained):
```bash
python backend/train_model.py
```

3. Run the Flask backend:
```bash
python backend/app.py
```

4. Open `frontend/index.html` in your web browser or use a local server.

## Project Structure

```
├── backend/
│   ├── app.py              # Flask API server
│   ├── model.py            # ML model and prediction logic
│   ├── train_model.py      # Model training script
│   └── crime_model.pkl     # Trained model (generated)
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── data/
│   └── sample_data.csv     # Sample training data
└── requirements.txt        # Python dependencies
```

## Usage

1. Enter a city or area name
2. Select additional parameters (optional)
3. Click "Predict Crime Rate" to get the prediction
4. View the results with risk level indicators

