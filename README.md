# 🌍 MapMyProfile

**MapMyProfile** is a full-featured frontend web application built using **React**, allowing users to view a list of profiles and explore their geographic locations on an interactive map.

This project was created as part of a frontend case study to demonstrate proficiency in responsive UI development, integration of third-party map services, and robust user interactions.

---

## 🔗 Live Demo

🌐 [Visit the Deployed App on Netlify](https://graceful-beijinho-af1a9d.netlify.app)  
📂 [GitHub Repository](https://github.com/omg2804/mapmyprofile)

---

## 🚀 Features

### 👤 Profile Display
- View a collection of user profiles including:
  - Name
  - Photo
  - Brief description

### 🗺️ Interactive Mapping
- Integrated **Google Maps** or **Mapbox**
- Displays dynamic map markers based on selected profile addresses

### 📍 Summary Button
- Each profile has a **"Summary"** button
- On click, map is displayed with a marker highlighting the user’s location

### 🔎 Search & Filter
- Real-time search based on name or location
- Filter profiles using various criteria

### 🛠️ Admin Dashboard
- Add, edit, and delete profiles with validations
- Easy-to-use CRUD interface for managing profile data

### 📱 Responsive Design
- Fully mobile-friendly layout
- Adapts seamlessly across devices

### ⚠️ Error Handling & Feedback
- Graceful handling of invalid addresses or API failures
- Includes loading spinners for better user feedback

### 🧾 Detailed Profile View
- Clicking on a profile shows extended information like:
  - Contact info
  - Interests
  - Address details

---

## 🧑‍💻 Tech Stack

- **Framework:** React + Vite
- **Map Services:** Google Maps / Mapbox
- **UI:** Tailwind CSS / Bootstrap / Mantine (based on your usage)
- **State Management:** useState, Context API (if used)
- **Deployment:** Netlify

---

## 📁 Project Structure
mapmyprofile/
├── dist/                         
├── src/                           
│   ├── components/                
│   ├── contexts/                  
│   ├── data/                      
│   ├── pages/                     
│   ├── services/                  
│   ├── App.tsx                    
│   ├── index.css                 
│   ├── main.tsx                   
│   └── vite-env.d.ts             
│
├── index.html                     
├── .gitignore                     
├── .gitattributes                 
├── eslint.config.js              
├── package.json                   
├── package-lock.json              
├── postcss.config.js              
├── tailwind.config.js             
├── tsconfig.app.json              
├── tsconfig.json                  
├── tsconfig.node.json             
└── vite.config.ts                 



---

## 🧪 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/omg2804/mapmyprofile
cd mapmyprofile

# Install dependencies
npm install

# Add your map API key to .env
VITE_MAP_API_KEY=your_google_or_mapbox_key

# Run the app
npm run dev


```
## 🌐 Deployment
-This app is deployed on Netlify. You can also deploy it using:

- **Vercel** 
- **GitHub Pages** 
- **Firebase Hosting** 
- **Render** 
---

## 🙌 Acknowledgements

- **React** 
- **Tailwind CSS** 
- **Google Maps API/Mapbox** 
- **Vite**
- **Icons via Lucide / Heroicons**


## ✨ Author
 **Om Gaikwad**

