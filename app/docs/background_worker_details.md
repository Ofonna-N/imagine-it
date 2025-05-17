Great questions! Here’s a clear breakdown:

---

### 1. **Where does the job run?**

The `downgradeExpiredSubscriptionsJob` is **not** run on a user's device or in the browser.  
It should run **on your server** (where your backend code and database access live).

---

### 2. **How do I run it daily?**

You have two common options:

#### **A. Cron Job (Server-Side Script)**

- Use a tool like [cron](https://en.wikipedia.org/wiki/Cron) (on Linux) or a scheduled task (on Windows) to run a Node.js script every day.
- Example cron entry to run at midnight:
  ```
  0 0 * * * /usr/bin/node /path/to/your/project/app/jobs/downgrade_expired_subscriptions_runner.js
  ```
- You’ll need a small runner script, e.g.:
  ```typescript
  // filepath: app/jobs/downgrade_expired_subscriptions_runner.js
  import { downgradeExpiredSubscriptionsJob } from "./downgrade_expired_subscriptions";
  downgradeExpiredSubscriptionsJob()
    .then(() => {
      console.log("Downgrade job complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Downgrade job failed:", err);
      process.exit(1);
    });
  ```

#### **B. Background Worker (Cloud Scheduler)**

- If you deploy on a platform like Vercel, AWS, or GCP, use their scheduled jobs feature to run the script daily.
- The script is the same as above.

---

### 3. **Does it run as a user? What about RLS?**

- **No, it does not run as a user.**  
  It runs as a backend process with **service-level database access**.
- **RLS (Row Level Security):**  
  If your database (e.g., Supabase/Postgres) enforces RLS, you must run this job with a service role or privileged connection that can bypass RLS, or you must write RLS policies that allow this job to update user records as needed.
- **Never run this in the browser or as part of user-triggered code.**

---

### 4. **Summary**

- The job is a backend/server process, not a user action.
- Schedule it with cron or a cloud scheduler.
- Ensure it has the necessary DB permissions (service role, not user session).
- It will not violate RLS if run with proper privileges.

---

**If you need a ready-to-use runner script or help with a specific deployment platform, let me know!**
