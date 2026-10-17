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

## Lessons Learned: WSL Networking and Firewall Blocker

While setting up the Ubuntu environment using WSL on my work laptop, I encountered a network connectivity issue. WSL was unable to establish a working network connection, possibly due to firewall or network restrictions on the corporate laptop.

I spent time troubleshooting the issue, but the usual setup wasn't working as expected. Instead of giving up or abandoning the Ubuntu environment, I explored alternative solutions and came across [wsl-vpnkit](https://github.com/sakai135/wsl-vpnkit), a project designed to help WSL access network connectivity in VPN and restricted networking environments.

After setting up `wsl-vpnkit`, the network connection started working as expected, and I was able to continue with the remaining Linux and cloud engineering tasks.

**Key takeaway:** Environment and networking issues can consume more time than the actual task. I learned the importance of troubleshooting systematically, researching alternative solutions, and understanding that the problem may lie in the host network configuration rather than in Linux or WSL itself.

**Future improvement:** When facing similar issues, I will investigate the root cause, check network and firewall restrictions, and explore well-documented workarounds before considering abandoning the setup.
