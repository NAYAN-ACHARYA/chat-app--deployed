# 📩 Chat App

A real-time chat application built using the **MERN (MongoDB, Express, React, Node.js) stack** with WebSockets for instant messaging.

🔗 **Live Demo**: https://chat-app-deployed-j920.onrender.com

---

## 🔑 Demo Credentials

Use the following credentials to quickly test the live app:

* **Email:** [nayannomm@gmail.com](mailto:nayannomm@gmail.com)
* **Password:** homelander

---

## 🚀 Getting Started

Follow these steps to set up and run the project after cloning the repository.

### **1️⃣ Clone the Repository**

Open a terminal and run:

```sh
git clone git@github.com:NAYAN-ACHARYA/chat-app--deployed.git  
cd chat-app--deployed 
```

### **2️⃣ Install Dependencies**

Run the following command in the **root directory** to install dependencies:

```sh
npm install  
```

### **3️⃣ Build the Project**

After installing dependencies, build the frontend:

```sh
npm run build  
```

### **4️⃣ Start the Application**

Once the build is complete, start the development server:

```sh
npm run dev  
```

### **5️⃣ Open in Browser**

The app should now be running at:

```
http://localhost:5000  
```

---

## 📌 Project Structure

```
chat-app--dev/  
│── backend/        # Express.js backend  
│── frontend/       # React frontend  
│── node_modules/   # Dependencies  
│── package.json    # Project configuration  
│── .env.example    # Example environment variables  
│── README.md       # Project documentation  
```

---

## 🛠️ Configuration

### **1️⃣ Setup Environment Variables**

Create a `.env` file in the **root directory** and add the necessary environment variables. Example:

```
MONGO_URI=your-mongodb-connection-string  
PORT=5000  
PASS=your-email-passkey  
```

### **2️⃣ Replace API URLs in Frontend**

If running the project locally, replace all instances of:

```
https://chat-app-deployed-j920.onrender.com/api/  
```

with:

```
http://localhost:5000/api/  
```

in your frontend files (e.g., API calls inside `frontend/src/`).

---

## 🛠️ Troubleshooting

* Ensure **MongoDB is running** before starting the backend.
* Run `npm run build` **before** `npm run dev` to avoid frontend issues.
* If encountering module issues, try:

  ```sh
  rm -rf node_modules package-lock.json && npm install  
  ```
* For WebSocket issues, check the backend **socket.io setup**.

---

## 👨‍💻 Contributing

Feel free to submit issues or pull requests to improve the project.
