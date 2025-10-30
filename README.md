# E-199 Emergency Management System

A web-based information system designed to make the management of emergency incidents more efficient, interactive, and real-time. The system supports emergency services such as fire departments, ambulances, and police in responding quickly to incidents by enabling immediate communication, coordination, and data sharing through an online platform.

## Features

### 🚨 Dashboard Overview
- Real-time statistics of active incidents
- Quick view of recently reported incidents
- Emergency service status monitoring
- Average response time tracking

### 📋 Incident Management
- View all incidents with filtering by status and priority
- Detailed incident information including location, type, and contact details
- Update incident status (Reported → Dispatched → Responding → Resolved)
- Priority levels: Critical, High, Medium, Low
- Incident types: Fire, Medical Emergency, Traffic Accident, Hazardous Materials, Rescue Operation

### 📝 Incident Reporting
- Easy-to-use form for reporting new incidents
- Required fields: Type, Priority, Location, Description
- Optional contact information
- Automatic service assignment based on incident type

### 🚒 Emergency Services Management
- **Fire Department**: Track units, personnel, and active responses
- **Medical Emergency**: Monitor ambulance availability and calls
- **Police Department**: View patrol units and response statistics
- Real-time service status updates

### 💬 Communication Center
- Centralized communication hub for coordination
- System notifications for incident updates
- Message feed for team communication
- Real-time incident status broadcasts

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage for data persistence
- **Design**: Responsive design supporting desktop, tablet, and mobile devices
- **Architecture**: Single Page Application (SPA) with client-side routing

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/antreassin/CS359-Web-Programming.git
cd CS359-Web-Programming
```

2. Open the application:
   - **Option 1**: Open `index.html` directly in your web browser
   - **Option 2**: Use a local web server (recommended):
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js (http-server)
   npx http-server -p 8080
   ```
   Then navigate to `http://localhost:8080` in your browser

## Usage

### Reporting an Incident
1. Click on "Report Incident" in the sidebar
2. Fill in the required information (Type, Priority, Location, Description)
3. Optionally add contact information
4. Click "Submit Incident Report"
5. The incident will be added to the system and assigned to the appropriate service

### Managing Incidents
1. Navigate to the "Incidents" view
2. Use filters to view specific incidents by status or priority
3. Click "View" to see detailed information about an incident
4. Use status action buttons to update incident progress:
   - **Dispatch**: Send emergency units to the location
   - **Responding**: Mark units as actively responding
   - **Resolve**: Close the incident when resolved

### Monitoring Services
1. Go to "Emergency Services" view
2. Check the availability and statistics for each service
3. Monitor active responses and daily call counts

### Communication
1. Access the "Communication Center" for team coordination
2. View system messages and incident updates
3. Send messages to coordinate emergency responses

## Data Persistence

The application uses browser LocalStorage to persist data between sessions. Data includes:
- Incident records
- Service statistics
- Communication messages

To clear all data, open the browser console and run:
```javascript
localStorage.clear();
location.reload();
```

## Browser Compatibility

The application is compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
CS359-Web-Programming/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js             # Application logic and interactivity
└── README.md          # Project documentation
```

## Features Highlights

### Real-Time Updates
- Dynamic UI updates without page refresh
- Automatic timestamp formatting (relative time display)
- Live statistics calculation

### Responsive Design
- Mobile-first approach
- Adaptive layout for all screen sizes
- Touch-friendly interface

### User Experience
- Intuitive navigation
- Clear visual hierarchy
- Color-coded priority and status indicators
- Modal dialogs for detailed views

## Future Enhancements

Potential improvements for future versions:
- Backend integration with database
- User authentication and role-based access
- Map integration for incident locations
- Real-time notifications using WebSockets
- Advanced analytics and reporting
- Mobile application
- Multi-language support

## License

This project is created for educational purposes as part of CS359 Web Programming course.

## Contributing

This is an educational project. For any questions or suggestions, please contact the repository owner.

## Acknowledgments

Developed as part of the CS359 Web Programming course to demonstrate modern web application development techniques and emergency management system design principles.
