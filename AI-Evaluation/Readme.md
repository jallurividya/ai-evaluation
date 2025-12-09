# 🕒 AI-Powered Time Tracking Web Application

A clean and simple web application that helps users log their daily activities, track how their 24 hours are spent, and visualize the breakdown using analytics.  
Built using **HTML/CSS/JavaScript**, **Firebase Authentication**, and **Firebase Realtime Database**.

---

## 🚀 Live Demo  
🔗 **Deployed Link:** *Add your GitHub Pages link here*

---

## 📹 Video Walkthrough  
🔗 **Video Link:** *Add your YouTube / Google Drive link here*

### Your video should include:
- Walkthrough of the main features  
- Show the dashboard with activities  
- Show the “No data available” state  
- Briefly explain how AI tools helped you during development  

---

## 🧰 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Realtime%20Database-039BE5?style=for-the-badge&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white" />
</p>

### Frontend
- HTML  
- CSS  
- JavaScript  
- DOM Manipulation  

### Backend / Database
- Firebase Authentication  
- Firebase Realtime Database  

### Deployment
- GitHub Pages  

---

## ⭐ Features

### ✔ User Authentication  
- Users can sign up and log in securely using Firebase Auth.

### ✔ Add & Track Daily Activities  
Each activity includes:  
- Activity Name  
- Category  
- Duration in minutes  

### ✔ 24-Hour Validation  
- Users must complete **exactly 1440 minutes** for a day (24 hours).

### ✔ Dashboard  
Shows:
- All activities logged for the day  
- Total hours spent  
- Time spent per category  
- Number of activities  

### ✔ Analytics Page  
- Pie Chart displaying time distribution  
- “No Data Available” fallback view  
- Previous/Next date navigation  

### ✔ Responsive UI  
- Modern, clean, professional layout inspired by Mocha UI  

---

## 📂 Folder Structure

```md
/project
  ├── index.html
  ├── login.html
  ├── dashboard.html
  ├── analytics.html
  ├── signup.html
  ├── api.js
  ├── dashboard.js
  ├── analytics.js
  ├── firebase.js
  ├── auth.js
  ├── Readme.md
  ├── auth.css
  └── style.css


🧪 How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/jallurividya/ai-evaluation/tree/main/AI-Evaluation
cd your-repo

2️⃣ Add Firebase configuration

Inside firebase.js, replace with your Firebase config.

3️⃣ Host locally

Use Live Server (VS Code) or any static server.

4️⃣ Deploy to GitHub Pages

Push code

Go to Settings → Pages

Select branch: main

Folder: /root

Save

Done! Your site will be live in seconds.

📸 Screenshots

<img src="screenshots/home.png" width="400px">
![This is an alt text.](./screenshots/home.png "This is a sample image.")
![Home Page](./screenshots/home.png "Home Page View")
![Dashboard](screenshots/dashboard.png "Dashboard Overview")
![Analytics](screenshots/analytics.png "Analytics Section")

🚀 Future Improvements

- Dark mode

- Weekly & monthly reports

- Export to PDF

- Drag-and-drop activity sorting

- AI-powered productivity suggestions

🙌 Acknowledgment

This project was built with the help of AI tools (ChatGPT) for:

- UI design

- Code generation

- Bug fixing

- Optimization

- Documentation (this README)
