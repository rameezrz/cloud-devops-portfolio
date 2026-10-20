# 🐧 Linux Cheatsheet

### 10 Essential Commands for Everyday Linux Administration

A quick reference for searching files, managing permissions, monitoring processes, troubleshooting services, and checking system resources.

---

## 1. `grep` — Search Text

**Purpose:** Searches for a specific word or pattern inside files or command output.

**Example:**

```bash
grep -i "error" /var/log/syslog
```

**What it does:** Finds lines containing `error`, ignoring uppercase and lowercase differences, in the system log.

**Useful variation:**

```bash
grep -rn "TODO" ./src/
```

Searches recursively for `TODO` in files under `src/`, displaying line numbers.

---

## 2. `find` — Locate Files and Directories

**Purpose:** Searches for files and directories based on names, types, sizes, and other criteria.

**Example:**

```bash
find /var/log -type f -name "*.log"
```

**What it does:** Lists regular files ending in `.log` under `/var/log`.

**Useful variation:**

```bash
find . -type f -mtime -1
```

Finds files modified within the last 24 hours under the current directory.

---

## 3. `chmod` — Change File Permissions

**Purpose:** Changes who can read, write, or execute a file or directory.

**Example:**

```bash
chmod 755 script.sh
```

**What it does:** Gives the owner read, write, and execute permissions, while the group and others get read and execute permissions.

**Permission reference:**

- `r` = Read (4)
- `w` = Write (2)
- `x` = Execute (1)

**Useful variation:**

```bash
chmod u+x script.sh
```

Adds execute permission for the file owner.

---

## 4. `chown` — Change File Ownership

**Purpose:** Changes the owner and optionally the group of a file or directory.

**Example:**

```bash
sudo chown appuser:appgroup app.log
```

**What it does:** Changes the owner to `appuser` and the group to `appgroup`.

**Useful variation:**

```bash
sudo chown -R appuser:appgroup /opt/myapp
```

Recursively changes ownership for the directory and its contents. Use `-R` carefully.

---

## 5. `ps aux` — List Running Processes

**Purpose:** Displays running processes, including their users, CPU usage, memory usage, and process IDs (PIDs).

**Example:**

```bash
ps aux | grep nginx
```

**What it does:** Searches the process list for entries containing `nginx`.

**Useful variation:**

```bash
ps aux --sort=-%mem | head
```

Shows the processes using the most memory near the top of the list.

---

## 6. `journalctl -u ssh` — Inspect Service Logs

**Purpose:** Reads logs collected by `systemd`, filtered by a particular service.

**Example:**

```bash
sudo journalctl -u ssh -n 50
```

**What it does:** Displays the latest 50 log entries for the SSH service on systems where the unit is named `ssh`.

**Useful variations:**

```bash
sudo journalctl -u ssh -f
sudo journalctl -u ssh --since today
```

- `-f` follows new log entries in real time.
- `--since today` shows entries since the beginning of today.

---

## 7. `ip a` — Inspect Network Interfaces

**Purpose:** Displays network interfaces, IP addresses, and interface status.

**Example:**

```bash
ip a
```

**What it does:** Lists interfaces such as `eth0`, `ens160`, or `lo`, along with their IPv4 and IPv6 addresses.

**Useful variation:**

```bash
ip -br a
```

Shows a more compact summary of network interfaces and their addresses.

---

## 8. `ss -tlnp` — Inspect Listening Ports

**Purpose:** Displays TCP sockets that are listening for incoming connections, with process information when available.

**Example:**

```bash
sudo ss -tlnp
```

**What it does:** Lists listening TCP ports, local addresses, and associated processes where permissions allow.

**Option breakdown:**

- `-t` = TCP sockets
- `-l` = Listening sockets
- `-n` = Numeric addresses and port numbers
- `-p` = Process information

**Useful variation:**

```bash
sudo ss -tlnp | grep ':3000'
```

Checks for a listening TCP port matching `3000`.

---

## 9. `df -h` — Check Disk Space

**Purpose:** Displays filesystem capacity, used space, and available space in human-readable units.

**Example:**

```bash
df -h
```

**What it does:** Shows disk usage in units such as GB and MB, helping identify filesystems running low on space.

**Useful variation:**

```bash
df -h /var
```

Shows the disk usage of the filesystem containing `/var`.

**Remember:** `df` reports filesystem usage, not the size of an individual directory.

---

## 10. `htop` — Monitor System Resources

**Purpose:** Provides an interactive, real-time view of running processes, CPU utilization, memory usage, and system load.

**Example:**

```bash
htop
```

**What it does:** Opens an interactive process monitor where you can inspect processes, sort them, and manage them if you have sufficient permissions.

**Useful keys:**

- `F3` — Search for a process
- `F4` — Filter processes
- `F6` — Select a sort column
- `F9` — Send a signal to a process
- `F10` — Quit

**Installation if missing (Ubuntu/Debian):**

```bash
sudo apt update && sudo apt install htop
```

---

## 💡 Quick Reference

| Command             | Main use                   |
| ------------------- | -------------------------- |
| `grep`              | Search text                |
| `find`              | Locate files               |
| `chmod`             | Change permissions         |
| `chown`             | Change ownership           |
| `ps aux`            | List processes             |
| `journalctl -u ssh` | Inspect service logs       |
| `ip a`              | Inspect network interfaces |
| `ss -tlnp`          | Check listening TCP ports  |
| `df -h`             | Check disk space           |
| `htop`              | Monitor system resources   |

---

### Best Practice

When troubleshooting a Linux server, start by checking **logs, processes, network interfaces, listening ports, and disk space**. Use commands such as `chmod`, `chown`, and `kill` carefully, especially on production systems.

_Last updated: October 2026_
