---
description: how to deploy the diagnostic center website
---

Since this project is a static website (Vanilla HTML, CSS, JS), you can deploy it for free in minutes.

### Option 1: Netlify (Easiest)
1.  **Drag and Drop**: Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag the entire `projectaboutdiagnostics` folder into the browser.
3.  Your site is now live! You will get a URL like `lucky-cat-123.netlify.app`.

### Option 2: GitHub Pages (Recommended)
1.  **Create Repository**: Go to GitHub and create a new repository called `diagnostic-center`.
2.  **Upload Files**: Upload your project files (index.html, style.css, script.js, and assets folder) to the main branch.
3.  **Enable Pages**: Go to **Settings** > **Pages**.
4.  Under **Build and deployment**, set Source to **Deploy from a branch**.
5.  Select the `main` branch and click **Save**.
6.  Wait 1-2 minutes; your site will be live at `https://yourusername.github.io/diagnostic-center/`.

### Option 3: Vercel
1.  Go to [Vercel](https://vercel.com/new).
2.  If you have your code on GitHub, import the repository.
3.  Alternatively, use the **Vercel CLI**:
    ```powershell
    npm install -g vercel
    vercel
    ```
4.  Follow the prompts to deploy.
