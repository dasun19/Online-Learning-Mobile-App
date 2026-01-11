# Online Learning Mobile App with ChatGPT Integration

A full-stack mobile learning platform built with the MERN stack, featuring AI-powered course recommendations through ChatGPT integration.

## Features

### For Students
- Register and login to access courses
- Browse and enroll in available courses
- View enrolled courses and unenroll when needed
- Get AI-powered course recommendations based on career goals

### For Instructors
- Create, update, and delete courses
- Manage course content and descriptions
- View enrolled students for each course
- Access instructor-specific course dashboard

## Tech Stack

- **Frontend**: React Native
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI ChatGPT API
- **Security**: bcrypt for password hashing

## Architecture

The application follows the MVC architecture pattern with RESTful API communication between the React Native frontend and Node.js backend.

```
React Native App → REST API → Node.js + Express → MongoDB
                                     ↓
                              OpenAI ChatGPT API
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git
- OpenAI API key
- Android Studio (for Android) or Xcode (for iOS)

## Installation

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/dasun19/Online-Learning-Mobile-App.git

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key

# Start the development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to mobile app directory
cd mobile_app

# Install dependencies
npm install

# Update API endpoint
# Set your computer's IP address in: mobile_app/src/api/axios.ts

# Run on Android
npx react-native run-android

# Start Metro bundler
npx react-native start
```


### Local Development
For local testing, update the IP address in `mobile_app/src/api/axios.ts` to match your computer's network IP.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Courses
- `POST /api/courses/create` - Create course (Instructor)
- `GET /api/courses` - Get all courses
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)
- `GET /api/courses/my-courses/list` - Get instructor's courses
- `GET /api/courses/:id/students` - Get enrolled students (Instructor)

### Enrollment
- `POST /api/courses/enroll/:courseId` - Enroll in course (Student)
- `GET /api/courses/enrolled/list` - View enrolled courses (Student)
- `POST /api/courses/unenroll/:id` - Unenroll from course (Student)

### AI Recommendations
- `POST /api/chat/recommendations` - Get ChatGPT course recommendations

## Security

- JWT-based authentication and authorization
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Environment variables for sensitive data
- Token validation middleware

## Future Enhancements

- Payment gateway integration
- Course ratings and reviews
- Multimedia support (photos/videos in course content)
- Offline course access
- Advanced AI personalization
- Admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes with clear messages
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Repository

[https://github.com/dasun19/Online-Learning-Mobile-App.git](https://github.com/dasun19/Online-Learning-Mobile-App.git)