"""
Script to train the crime rate prediction model
This can be used to retrain the model with new data
"""

from model import CrimeRatePredictor
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def generate_training_data(n_samples=2000):
    """Generate synthetic training data"""
    np.random.seed(42)
    
    # Area types: urban=0, suburban=1, rural=2
    area_types = np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.4, 0.2])
    
    # Population density (per sq km)
    population_density = np.random.normal(5000, 3000, n_samples)
    population_density = np.clip(population_density, 100, 20000)
    
    # Time of day: day=0, night=1
    time_of_day = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Month (1-12)
    month = np.random.randint(1, 13, n_samples)
    
    # Day of week (1-7)
    day_of_week = np.random.randint(1, 8, n_samples)
    
    # Generate crime rate based on features (realistic patterns)
    crime_rate = (
        2.0 +  # Base rate
        area_types * 1.5 +  # Urban areas have higher crime
        (population_density / 2000) * 0.5 +  # Higher density = higher crime
        time_of_day * 1.2 +  # Night has higher crime
        np.sin((month - 1) * np.pi / 6) * 0.5 +  # Seasonal variation
        (day_of_week > 5) * 0.8 +  # Weekends have higher crime
        np.random.normal(0, 0.5, n_samples)  # Random noise
    )
    crime_rate = np.clip(crime_rate, 0.5, 8.0)
    
    # Create DataFrame
    data = pd.DataFrame({
        'area_type': area_types,
        'population_density': population_density,
        'time_of_day': time_of_day,
        'month': month,
        'day_of_week': day_of_week,
        'crime_rate': crime_rate
    })
    
    return data

def train_model():
    """Train the crime rate prediction model"""
    print("Generating training data...")
    data = generate_training_data(n_samples=2000)
    
    print(f"Training data shape: {data.shape}")
    print(f"Crime rate range: {data['crime_rate'].min():.2f} - {data['crime_rate'].max():.2f}")
    
    # Prepare features and target
    X = data[['area_type', 'population_density', 'time_of_day', 'month', 'day_of_week']]
    y = data['crime_rate']
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X, y)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'crime_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # Evaluate model
    predictions = model.predict(X)
    mse = np.mean((predictions - y) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(predictions - y))
    
    print(f"\nModel Performance:")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAE: {mae:.2f}")
    print(f"R² Score: {model.score(X, y):.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\nFeature Importance:")
    print(feature_importance.to_string(index=False))

if __name__ == '__main__':
    train_model()

