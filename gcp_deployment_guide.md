# Sanjeevani-Kavach Deployment & Troubleshooting Guide

This guide documents the exact, tested procedures for deploying the Sanjeevani-Kavach architecture to Google Cloud Platform. It incorporates critical lessons learned from real-world edge cases.

## Core Prerequisites

Before deploying, you must acquire two API Keys:

1. **Firebase Web API Key**: Navigate to Firebase Console > Project Settings > General. Scroll to "Your apps", register a Web App (`</>`), and copy the `apiKey` string starting with `AIzaSy...`.
2. **Gemini API Key**: Navigate to Google AI Studio > Get API key > Create API key in existing project (`sanjeevani-kavach`).

## Deployment Process (Cloud Shell)

To completely bypass complicated Windows `gcloud` installations and PATH setup errors, this process utilizes the native Google Cloud Shell directly in your browser.

> [!IMPORTANT]
> **ZIP Architecture Check**: When compressing your local `PromptWarsIndia2026` folder on Windows to upload it, ensure you enter the folder and select the inner contents (like `package.json` and `src/`) to create the ZIP.
> If you right-click the outer folder itself, it will create a "nested" ZIP (e.g. `sanjeevani.zip/PromptWarsIndia2026/package.json`). This nesting completely breaks Cloud Build!

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the **Activate Cloud Shell** icon (`>_`) in the top right.
3. Click the three dots menu (`⋮`) inside the shell and select **Upload** to push your `sanjeevani-kavach.zip`.
4. Unzip into a clean directory:
   ```bash
   unzip sanjeevani-kavach.zip -d sanjeevani-kavach
   cd sanjeevani-kavach
   ```

### 1. The Database (Firebase Security Rules)

> [!NOTE]
> If you wish to only deploy Firestore Database rules and manually bypass Cloud Storage limits on the free tier, remove the `"storage": { ... }` block from `firebase.json` before running this.

```bash
firebase deploy --only firestore:rules --project sanjeevani-kavach
```

### 2. The User Interface (Next.js PWA)

Deploy the primary Next.js Frontend. Because Next.js uses strict peer-dependencies (like React 19 vs Framer Motion), we utilize a rigid `Dockerfile` to explicitly command `legacy-peer-deps=true` during `npm install`.

```bash
gcloud run deploy sanjeevani-kavach \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key",NEXT_PUBLIC_FIREBASE_PROJECT_ID="sanjeevani-kavach",GEMINI_API_KEY="your_gemini_key"
```

### 3. The Backend Engine (Python Microservice)

The Python engine handles structural image blurring before AI evaluation. It runs as a wholly separate microservice, granting massive scalable independence from the UI cluster.

```bash
cd cloud-run
gcloud run deploy sanjeevani-kavach-python \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```
---

## 🛑 Troubleshooting Matrix

Here are the most common deployment blockers encountered and the exact fixes to bypass them.

### Error 1: "The term 'gcloud' / 'firebase' is not recognized"
**Cause:** Attempting to execute cloud commands locally on Windows without installing the massive CLI `.exe` toolkits.
**Fix:** Switch entirely to the Google Cloud Shell browser terminal (which comes natively pre-installed), or utilize `npx firebase-tools` for bypassing strict global NPM installations.

### Error 2: "Missing required API firebasestorage.googleapis.com"
**Cause:** Firebase deploy attempts to push `storage.rules`, but you haven't clicked "Get Started" physically in the Cloud Storage UI Console yet.
**Fix:** Navigate to the Firebase Storage console and initiate it, or drastically simply edit `firebase.json` to delete the `"storage"` mapping block temporarily.

### Error 3: "Error 403: 9492...-compute@developer.gserviceaccount.com does not have storage.objects.get access"
**Cause:** When `gcloud run` executes `--source .`, it uploads a ZIP into a temporary Google bucket to build the Docker image. Your server's automated account lacks the IAM permission to read that temporary file.
**Fix:** Execute this binding command to grant Storage Admin access safely:
```bash
gcloud projects add-iam-policy-binding sanjeevani-kavach \
  --member=serviceAccount:your-project-number-compute@developer.gserviceaccount.com \
  --role=roles/storage.admin
```

### Error 4: "Buildpacks exited with non-zero status: 51 (Missing Python Entrypoint)"
**Cause:** Google Cloud Buildpacks aggressively scans folders without a Dockerfile. If you accidentally uploaded a ZIP with a nested outer folder (meaning `package.json` isn't clearly visible), it dives into `cloud-run/` and wrongly assumes your entire Next.js system is a broken Python app.
**Fix:** Ensure your terminal is `cd`'d into the exact directory alongside `package.json`. If peer dependencies crash it, completely bypass buildpacks natively by dropping this precise file into the same directory:
```dockerfile
# /Dockerfile
FROM node:20-alpine
WORKDIR /app
RUN echo "legacy-peer-deps=true" > .npmrc
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Error 5: "Your project must be on the Blaze (pay-as-you-go) plan to deploy functions"
**Cause:** Firebase completely deprecated free NodeJS runtimes for background Cloud Functions.
**Fix:** For workshop demonstrations, modern Agentic Next.js PWAs easily sustain state natively in the client browser, mitigating the hard requirement of the webhook module. To formally deploy the background crons natively, follow the error URL provided and link your existing Cloud Run billing account.
