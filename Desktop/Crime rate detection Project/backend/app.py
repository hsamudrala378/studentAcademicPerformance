from flask import Flask, request, jsonify
from flask_cors import CORS
from model import CrimeRatePredictor
import os
import traceback

app = Flask(__name__)
# Configure CORS to handle all origins and methods
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Initialize the predictor
try:
    predictor = CrimeRatePredictor()
    print("Predictor initialized successfully")
except Exception as e:
    print(f"Error initializing predictor: {e}")
    import traceback
    traceback.print_exc()
    predictor = None

@app.route('/')
def home():
    return jsonify({
        "message": "Crime Rate Detection API",
        "status": "running",
        "predictor_ready": predictor is not None
    })

@app.route('/health', methods=['GET', 'OPTIONS'])
def health():
    """Health check endpoint"""
    print("Health endpoint called!")
    return jsonify({
        "status": "healthy",
        "predictor_ready": predictor is not None
    })

@app.route('/predict', methods=['POST', 'OPTIONS', 'GET'])
def predict():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    
    # Handle GET requests (for testing)
    if request.method == 'GET':
        return jsonify({
            'message': 'Use POST method to make predictions',
            'example': {
                'city': 'New York',
                'area_type': 'urban',
                'population_density': 5000,
                'time_of_day': 'day',
                'month': 6,
                'day_of_week': 1
            }
        })
    
    print(f"Received request: {request.method} {request.path}")
    print(f"Content-Type: {request.content_type}")
    print(f"Headers: {dict(request.headers)}")
    
    if predictor is None:
        return jsonify({
            'success': False,
            'error': 'Predictor not initialized. Please check server logs.'
        }), 500
    
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        if data is None:
            return jsonify({
                'success': False,
                'error': 'No JSON data received'
            }), 400
        
        # Extract parameters
        city = data.get('city', '')
        area_type = data.get('area_type', 'urban')  # urban, suburban, rural
        population_density = data.get('population_density', 5000)  # per sq km
        time_of_day = data.get('time_of_day', 'day')  # day, night
        month = data.get('month', 6)  # 1-12
        day_of_week = data.get('day_of_week', 1)  # 1-7 (Monday=1)
        
        # Make prediction
        prediction = predictor.predict(
            city=city,
            area_type=area_type,
            population_density=population_density,
            time_of_day=time_of_day,
            month=month,
            day_of_week=day_of_week
        )
        
        # Determine risk level
        crime_rate = prediction['crime_rate']
        if crime_rate < 2.0:
            risk_level = "Low"
            risk_color = "#4CAF50"
        elif crime_rate < 4.0:
            risk_level = "Medium"
            risk_color = "#FF9800"
        else:
            risk_level = "High"
            risk_color = "#F44336"
        
        return jsonify({
            'success': True,
            'city': city,
            'crime_rate': round(crime_rate, 2),
            'risk_level': risk_level,
            'risk_color': risk_color,
            'factors': prediction['factors']
        })
    
    except Exception as e:
        print(f"Error in predict: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/cities', methods=['GET'])
def get_cities():
    """Return list of sample cities"""
    cities = [
        "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
        "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
        "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
        "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington"
    ]
    return jsonify({'cities': cities})

@app.route('/routes', methods=['GET', 'OPTIONS'])
def list_routes():
    """List all available routes for debugging"""
    print("Routes endpoint called!")
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'path': str(rule)
        })
    return jsonify({'routes': routes})

@app.before_request
def log_request_info():
    """Log all incoming requests for debugging"""
    print(f"\n{'='*50}")
    print(f"Request: {request.method} {request.path}")
    print(f"Full URL: {request.url}")
    print(f"Content-Type: {request.content_type}")
    print(f"Origin: {request.headers.get('Origin', 'N/A')}")
    print(f"All Headers: {dict(request.headers)}")
    print(f"{'='*50}")
    
    # Handle OPTIONS requests globally for CORS
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        return response

@app.errorhandler(404)
def not_found(error):
    print(f"404 Error - Path: {request.path}, Method: {request.method}")
    response = jsonify({
        'success': False, 
        'error': f'Endpoint not found: {request.method} {request.path}',
        'available_endpoints': ['/', '/health', '/predict', '/cities']
    })
    response.status_code = 404
    return response

@app.errorhandler(405)
def method_not_allowed(error):
    print(f"405 Error - Path: {request.path}, Method: {request.method}")
    # Get allowed methods for this route
    allowed_methods = []
    for rule in app.url_map.iter_rules():
        if str(rule) == request.path:
            allowed_methods = list(rule.methods - {'HEAD', 'OPTIONS'})
    response = jsonify({
        'success': False,
        'error': f'Method {request.method} not allowed for {request.path}',
        'allowed_methods': allowed_methods if allowed_methods else ['POST']
    })
    response.status_code = 405
    return response

@app.errorhandler(500)
def internal_error(error):
    import traceback
    print("Internal server error:")
    print(traceback.format_exc())
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all unhandled exceptions"""
    import traceback
    print(f"Unhandled exception: {e}")
    print(traceback.format_exc())
    return jsonify({
        'success': False,
        'error': f'Server error: {str(e)}'
    }), 500

if __name__ == '__main__':
    # Print all registered routes on startup
    print("\n" + "="*50)
    print("Registered Routes:")
    print("="*50)
    for rule in app.url_map.iter_rules():
        print(f"  {rule.endpoint:20s} {str(rule.methods):30s} {rule}")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000, host='127.0.0.1')

