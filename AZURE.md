# ☁️ Azure VM Deployment Guide

This guide details how to boot and run the **Interview Calibration** web app on any Microsoft Azure Virtual Machine (Ubuntu LTS recommended). 

We have provided two modern, ready-to-use pathways to get your server running on **Port 3000**:
1. **Method A: Docker Compose** (Recommended — isolated, fast, self-contained)
2. **Method B: PM2 Native Boot Script** (No Docker required — standard Ubuntu shell automation)

---

## 🔒 Crucial Prerequisite: Configure Azure Port Filtering (NSG)

Azure VMs block all incoming web traffic by default. Before trying to access the application link, you **must allow inbound traffic on Port 3000** via the Azure portal:

1. Open the [Azure Portal](https://portal.azure.com/) and navigate to your **Virtual Machine**.
2. Under the left-hand **Settings** menu, select **Networking** (or **Network settings**).
3. Click the **Add inbound port rule** button on the right.
4. Fill in the network rule fields:
   - **Source**: `Any`
   - **Source port ranges**: `*`
   - **Destination**: `Any`
   - **Service**: `Custom`
   - **Destination port ranges**: `3000`
   - **Protocol**: `TCP`
   - **Action**: `Allow`
   - **Priority**: Keep default (e.g., `310`)
   - **Name**: `Allow_Port_3000_TCP`
5. Click **Add**. The rule will apply in about 15 seconds.

---

## 🐳 Method A: Booting with Docker Compose (Recommended)

Docker handles all system Node dependencies inside container boundaries. To run this on your Azure VM:

### 1. Install Docker & Compose on your Azure VM
If your VM does not have Docker or Compose installed, run the standard Ubuntu setup:
```bash
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

### 2. Boot the Container Group
Navigate to the directory containing our `docker-compose.yml` and run:
```bash
sudo docker compose up --build -d
```
- The `--build` flag builds your custom local Docker image incorporating changes.
- The `-d` flag runs the container in **detached daemon mode** so it stays active even if you disconnect from your SSH terminal session.

### 3. Verification
Run the following to check container logs:
```bash
sudo docker compose logs -f
```
Now navigate to `http://<YOUR_AZURE_VM_PUBLIC_IP_OR_DNS>:3000`!

---

## ⚡ Method B: Booting with Native Scripting (Ubuntu VM)

If you prefer to run the application directly inside Node.js on the VM system operating system, we created an automated setup script `setup-azure-vm.sh`.

### 1. Give executing privileges to the setup script
Inside your VM SSH terminal, make our shell script executable:
```bash
chmod +x setup-azure-vm.sh
```

### 2. Execute the Auto-Setup
Run the script as your standard user:
```bash
./setup-azure-vm.sh
```
This automated process will:
- Reprovision Ubuntu software repositories.
- Set up **Node.js LTS (v20)**.
- Pull in standard compilers (`build-essential`).
- Install **PM2** process manager globally.
- Clean-install dependencies (`npm install`).
- Build web bundles (`npm run build`).
- Register your boot process in background PM2.

### 3. Access Live Operations
Once the script displays green checkmarks, the application is live:
- **View active services**: `pm2 status`
- **Follow logs**: `pm2 logs`
- **Restart applications**: `pm2 restart interview-calibrator`

Navigate to `http://<YOUR_AZURE_VM_PUBLIC_IP_OR_DNS>:3000` in your web browser!

---

## 🎚️ Managing System Settings (.env)

If you incorporate custom third-party integrations or need to set environment parameters, create or edit the `.env` file in the project folder with your VM terminal:

```bash
nano .env
```

Declare settings as desired (e.g., the standard express environment):
```env
PORT=3000
NODE_ENV=production
```

After modifying `.env`, restart the app using whichever pathway you chose:
* **For Docker**: `sudo docker compose restart`
* **For PM2**: `pm2 restart interview-calibrator`
