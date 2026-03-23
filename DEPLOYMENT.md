# 🚀 The Ultimate Free Tier Deployment Guide

Welcome to the **GradeAI** deployment guide! Here, we will use three fantastic services to host your entire ML pipeline—completely for free. 

### ⚙️ The Stack
*   **Database**: MongoDB Atlas (Free 512MB Cluster)
*   **Backend**: Render.com (Free Web Service)
*   **Frontend**: Vercel (Free Next.js Hosting)

*(**Note:** By default, I've restricted your backend server to "1 worker" because PyTorch & OCR algorithms take a lot of memory. The free tier on Render gives you 512MB RAM, which should just be enough if it handles one file at a time!)*

---

## Step 1: Set up the Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and register for a free account.
2. Build a Database – choose the **M0 Free** cluster.
3. Once the cluster is created, go to **Database Access** under Security on the left sidebar and create a new database user.
    * Use a **Username** (e.g. `gradeai_admin`)
    * Use a **Password** (e.g. `your_secure_pass!`)
4. Next, go to **Network Access** and select "Add IP Address". Click **"Allow Access from Anywhere"** (`0.0.0.0/0`) since our cloud backend will need access.
5. Finally, go back to **Database** (under Deployments), click **Connect**, select **Drivers**, and copy the connection string.
    * It will look like this: `mongodb+srv://gradeai_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    * Replace `<password>` with the password you made in step 3. 
    * Add `gradeai_db` before the `?` so it connects to your specific DB namespace. (e.g. `...mongodb.net/gradeai_db?retry...`)

---

## Step 2: Push Your Code to GitHub
Before Vercel or Render can build your code, it needs to be online in a repository.
1. Open up your code editor terminal.
2. Create a repository on GitHub (make it Public or Private).
3. Run:
   ```bash
   git init
   git add .
   git commit -m "Deployment ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

---

## Step 3: Set up Backend (Render)
1. Go to [Render](https://render.com) and sign up with your GitHub account.
2. Click **New +** and select **Web Service**.
3. Choose **"Build and deploy from a Git repository"** and select your GitHub repository.
4. Set the following details:
   * **Name**: `gradeai-backend`
   * **Language**: `Docker` (Render will automatically detect your `backend/Dockerfile`!)
   * **Root Directory**: `backend` *(Crucial step! Don't miss this!)*
   * **Instance Type**: `Free`
5. Click **Advanced / Environment Variables** and add:
   * `ENVIRONMENT` = `production`
   * `MONGODB_URL` = *(Paste the URI you got from MongoDB Atlas)*
   * `DATABASE_NAME` = `gradeai_db`
   * `JWT_SECRET` = *(Make up a long random password/secret key)*
   * `CORS_ORIGINS` = `*` *(We'll lock this down later in Step 5)*
6. Click **Create Web Service**. 
   > **Note:** The first deployment on Render will take ~5-15 minutes because it installs PyTorch. Once it's live, copy the URL they provide you on the dashboard (e.g., `https://gradeai-backend.onrender.com`).

---

## Step 4: Set up Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and log in with GitHub.
2. Click **Add New... -> Project**.
3. Import your GitHub repository.
4. **Important Framework Settings**:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: `frontend` (Click edit and select the `frontend` folder).
5. Open **Environment Variables** and add:
   * `NEXT_PUBLIC_API_URL` = `https://gradeai-backend.onrender.com/api/v1` *(Replace with your ACTUAL Render backend URL)*
6. Click **Deploy**. Vercel only takes 1-2 minutes!
7. Once finished, visit your flashy Vercel URL!

---

## Step 5: Final Security Lockdown! (Required)
Right now, your Backend accepts traffic from anywhere (`CORS_ORIGINS = *`). Let's secure it.
1. Copy the live URL of your Vercel frontend (e.g. `https://gradeai-frontend-alpha.vercel.app`).
2. Go back to Render Dashboard -> Web Service -> Environment Variables.
3. Update `CORS_ORIGINS` to equal your Vercel URL (WITHOUT a trailing slash).
   * Example: `https://gradeai-frontend-alpha.vercel.app,http://localhost:3000`
4. The backend will automatically restart, locking out unauthorized domain access.

**🎉 Congratulations! You have successfully deployed a sophisticated ML architecture 100% for free!**
