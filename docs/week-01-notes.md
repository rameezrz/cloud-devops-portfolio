# Week 1 — Cloud Engineering Prep

- Setting up and configuring the development environment took more time than I expected.
- I encountered several errors and spent a lot of time troubleshooting issues that initially seemed simple.
- At a few points, I felt disappointed and even considered dropping the plan because things weren't progressing as quickly as I wanted.
- However, every attempt taught me something new, and solving each issue gave me a better understanding of the tools and environment.
- I worked on AWS account security, GitHub profile and portfolio setup, tool installation, networking fundamentals, Linux commands, and Dockerizing my MERN application.
- I realized that learning cloud engineering involves more than just following instructions; understanding errors and knowing how to troubleshoot them are equally important.
- Although the week took more effort than expected, completing the planned tasks gave me a sense of accomplishment and confidence to continue.
- My biggest takeaway is to be patient with the learning process, focus on consistent progress, and treat errors as opportunities to learn rather than reasons to give up.
- **Next week:** Build on these fundamentals, continue with hands-on labs, and aim to spend less time getting frustrated and more time understanding the problems I encounter.

## Lessons learned: WSL networking on a restricted network

**Symptom:** In WSL2 (Ubuntu), `apt update` ignored every mirror, and DNS lookups hung, while the same machine's browser worked.

**Diagnosis:** WSL's DNS pointed to its built-in forwarder, and Windows had no proxy configured. That suggested traffic from WSL's virtual network adapter was being dropped on the host network, not a Linux configuration problem.

**Fix:** I used [wsl-vpnkit](https://github.com/sakai135/wsl-vpnkit), which routes WSL traffic through a user-space network stack on the Windows host. Networking then worked. Check your own organization's policy before using tools like this.

**Takeaway:** Test connectivity in layers (DNS, then HTTPS, then package mirrors) before changing settings. A fallback plan (here, AWS CloudShell) keeps the work moving while you troubleshoot.
