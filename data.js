/*
 * Portfolio content.
 * To add a project: copy one entry in PROJECTS, change the fields, and push.
 * Set featured: true to also show it in the "Featured work" section.
 */
const GH = 'https://github.com/atteks-za/athenkosi-portfolio/';

const DOMAINS = {
  cloud:      { label: 'Cloud',            icon: 'fa-cloud' },
  networking: { label: 'Networking',       icon: 'fa-network-wired' },
  security:   { label: 'Cybersecurity',    icon: 'fa-shield-halved' },
  devops:     { label: 'DevOps',           icon: 'fa-gears' },
  sysadmin:   { label: 'Systems & Infra',  icon: 'fa-server' }
};

const PROJECTS = [
  // ── Networking ──
  {
    title: 'Enterprise FortiGate SD-WAN with IPsec VPN Failover',
    domain: 'networking', featured: true,
    summary: 'Two-site enterprise network with dual-WAN SD-WAN failover over site-to-site IPsec, built on FortiGate VMs across ESXi and Proxmox, with MikroTik routers as simulated ISPs.',
    tags: ['FortiGate SD-WAN', 'IPsec', 'MikroTik', 'Failover'],
    url: GH + 'tree/Networking/Enterprise%20FortiGate%20SD-WAN%20with%20IPsec%20VPN%20Failover%20(HQ%20%E2%86%94%20Branch)'
  },
  {
    title: 'Ubiquiti UniFi Multi-WAN Load Balancing & VLAN Segmentation',
    domain: 'networking',
    summary: 'Small-business network on UniFi hardware with dual-WAN load balancing, separate VLANs and SSIDs for IT, Finance and Guest, and Layer 3 firewall isolation.',
    tags: ['UniFi', 'Dual-WAN', 'VLANs', 'Wi-Fi'],
    url: GH + 'tree/Networking/Multi-WAN-VLAN-Segmentation-Lab'
  },
  {
    title: 'FortiGate Site-to-Site VPN (HQ ↔ Branch)',
    domain: 'networking',
    summary: 'Route-based IPsec VPN between two FortiGates, giving every HQ VLAN full reachability to the branch office subnet.',
    tags: ['FortiGate', 'IPsec', 'Route-based VPN'],
    url: GH + 'tree/Networking/FortiGate%20Site-to-Site%20VPN'
  },
  {
    title: 'BGP ISP Peering & Route Redistribution',
    domain: 'networking',
    summary: 'eBGP session between the simulated ISP (AS 65000) and the FortiGate edge (AS 65001), with routes shared into the internal OSPF network.',
    tags: ['BGP', 'eBGP', 'FortiGate', 'Cisco'],
    url: GH + 'tree/Networking/BGP%20ISP%20Peering%20%26%20Route%20Redistribution'
  },
  {
    title: 'OSPF Dynamic Routing & VLAN Propagation',
    domain: 'networking',
    summary: 'OSPF Area 0 between the FortiGate and the HQ core router, so VLAN subnets are learned dynamically instead of through static routes.',
    tags: ['OSPF', 'FortiGate', 'Cisco IOS-XE'],
    url: GH + 'tree/Networking/OSPF%20implementation'
  },
  {
    title: 'FortiGate Edge Firewall & Policy Routing',
    domain: 'networking',
    summary: 'FortiGate VM deployed as the lab’s edge firewall and gateway, with WAN/LAN interfaces, static routes to internal VLANs, NAT policies and DNS.',
    tags: ['FortiGate', 'Firewall Policies', 'NAT'],
    url: GH + 'tree/Networking/FortiGate%20Edge%20Firewall%20%26%20Policy%20Routing'
  },
  {
    title: 'Inter-VLAN Routing & DHCP',
    domain: 'networking',
    summary: 'Cisco CSR1000v configured as the HQ core router: 802.1Q subinterfaces, DHCP for three VLANs, NAT overload and a default route to the firewall.',
    tags: ['Cisco IOS-XE', '802.1Q', 'DHCP', 'NAT'],
    url: GH + 'tree/Networking/Inter-VLAN%20Routing%20%26%20DHCP%20(CSR-HQ-01)'
  },
  {
    title: 'VLAN Segmentation with Cisco vIOS-L2',
    domain: 'networking',
    summary: 'Layer 2 distribution switch with an 802.1Q trunk to the core router, access ports for management, server and user VLANs, and a management SVI.',
    tags: ['Cisco vIOS-L2', 'VLANs', 'Trunking'],
    url: GH + 'tree/Networking/VLAN%20Segmentation%20with%20Cisco%20vIOS-L2'
  },
  {
    title: 'ISP Router Simulation with NAT',
    domain: 'networking',
    summary: 'Simulated ISP edge router on a Cisco CSR1000v in Proxmox, with NAT overload (PAT), static routing and loopback-based public IP addressing.',
    tags: ['Cisco CSR1000v', 'NAT/PAT', 'Proxmox VE'],
    url: GH + 'tree/Networking/ISP%20Router%20Simulation%20with%20NAT'
  },

  // ── Cloud ──
  {
    title: 'Identity & Access Management with AWS Identity Center',
    domain: 'cloud',
    summary: 'Set up AWS IAM Identity Center, created users and assigned SecurityAudit permission sets following least-privilege access.',
    tags: ['IAM Identity Center', 'Permission Sets', 'Least Privilege'],
    url: GH + 'blob/AWS-Bootcamp/Identity%20&%20Access%20Management%20with%20AWS%20Identity%20Center/readme.md'
  },
  {
    title: 'Deploying a Secure Windows EC2 Instance',
    domain: 'cloud',
    summary: 'Launched a Windows Server 2019 EC2 instance in a public subnet, with RDP locked down to a single trusted IP address.',
    tags: ['EC2', 'Security Groups', 'RDP'],
    url: GH + 'blob/AWS-Bootcamp/Deploying%20a%20Secure%20Windows%20EC2%20Instance/readme.md'
  },
  {
    title: 'Multi-VPC Networking & Peering',
    domain: 'cloud',
    summary: 'Two VPCs with non-overlapping CIDRs and public/private subnets, connected through VPC peering and updated route tables.',
    tags: ['VPC', 'Subnets', 'VPC Peering'],
    url: GH + 'tree/AWS-Bootcamp/Multi-VPC%20Networking%20&%20Peering%20Configuration'
  },
  {
    title: 'Containerized Grafana Dashboard on ECS Fargate',
    domain: 'cloud',
    summary: 'Ran the official Grafana image on ECS Fargate and published it through a public endpoint protected by security group rules.',
    tags: ['ECS Fargate', 'Docker', 'Grafana'],
    url: GH + 'blob/AWS-Bootcamp/Containerized%20Grafana%20Dashboard%20on%20ECS%20Fargate/readme.md'
  },
  {
    title: 'ECS-Hosted Metabase Connected to Amazon RDS',
    domain: 'cloud',
    summary: 'Metabase on ECS Fargate backed by PostgreSQL on RDS, with database access allowed only from the ECS tasks on port 5432.',
    tags: ['ECS Fargate', 'RDS PostgreSQL', 'Security Groups'],
    url: GH + 'blob/AWS-Bootcamp/ECS-Hosted%20Metabase%20Connected%20to%20Amazon%20RDS/readme.md'
  },
  {
    title: 'CloudWatch Monitoring Dashboard for ECS',
    domain: 'cloud',
    summary: 'Deployed Nginx on ECS Fargate, tuned task CPU and memory, and built a CloudWatch dashboard to track performance under load.',
    tags: ['CloudWatch', 'ECS', 'Observability'],
    url: GH + 'blob/AWS-Bootcamp/CloudWatch%20Monitoring%20Dashboard%20for%20ECS%20Application/readme.md'
  },
  {
    title: 'Static Website with S3 & CloudFront',
    domain: 'cloud',
    summary: 'Hosted a static website on S3 with a secure bucket policy and delivered it worldwide over HTTPS through CloudFront.',
    tags: ['S3', 'CloudFront', 'Bucket Policies'],
    url: GH + 'blob/AWS-Bootcamp/Static%20Portfolio%20Website%20with%20S3%20&%20CloudFront/readme.md'
  },
  {
    title: 'Custom Domain Hosting with Route 53, CloudFront & ACM',
    domain: 'cloud',
    summary: 'Pointed a registered domain at Route 53, issued an SSL certificate with ACM and served the site securely through CloudFront.',
    tags: ['Route 53', 'ACM', 'CloudFront', 'HTTPS'],
    url: GH + 'blob/AWS-Bootcamp/Secure%20Custom%20Domain%20Hosting%20with%20Route%2053,%20CloudFront%20&%20ACM/readme.md'
  },
  {
    title: 'Serverless Automation with S3 Events & Lambda',
    domain: 'cloud',
    summary: 'S3 uploads trigger a Lambda function that logs event details to CloudWatch and sends email alerts through SES.',
    tags: ['Lambda', 'S3 Events', 'CloudWatch Logs', 'SES'],
    url: GH + 'blob/AWS-Bootcamp/Serverless%20Automation%20with%20S3%20Event%20Triggers%20&%20Lambda/readme.md'
  },

  // ── Cybersecurity ──
  {
    title: 'Active Directory Penetration Testing',
    domain: 'security', featured: true,
    summary: 'End-to-end attack chain against a lab AD domain: enumeration, MITM6 DNS takeover, credential cracking, Kerberoasting, lateral movement and full domain compromise.',
    tags: ['Kali Linux', 'Active Directory', 'Kerberoasting', 'MITM6'],
    url: GH + 'blob/Cybersecurity/Active%20Directory%20Penetration%20Testing/TCMREADME%20(1).md'
  },

  // ── DevOps ──
  {
    title: 'Cloud Ops Monitoring & Incident Response Platform',
    domain: 'devops', featured: true,
    summary: 'AWS environment built with Terraform, instrumented with CloudWatch alarms and SNS alerts, with two real incidents taken from detection to recovery and written up as runbooks.',
    tags: ['Terraform', 'CloudWatch', 'SNS', 'Runbooks'],
    url: GH + 'tree/DevOps/mini-msp-center'
  },
  {
    title: 'End-to-End CI/CD Pipeline for a Node.js App',
    domain: 'devops',
    summary: 'Every push triggers Jenkins to build and test the app, run SonarQube quality checks, package it with Docker and deploy it to AWS EC2.',
    tags: ['Jenkins', 'SonarQube', 'Docker', 'AWS EC2'],
    url: GH + 'tree/DevOps/End-to-End%20CI/CD%20Pipeline%20for%20Node.js%20CRUD%20Application'
  },
  {
    title: 'Application Deployment on AWS EKS',
    domain: 'devops',
    summary: 'Containerised a web app, published it to Docker Hub and deployed it to an EKS cluster behind a Kubernetes LoadBalancer service.',
    tags: ['EKS', 'Kubernetes', 'Docker', 'kubectl'],
    url: GH + 'tree/DevOps/Application%20Deployment%20on%20Kubernetes%20Cluster%20using%20AWS%20EKS'
  },
  {
    title: 'Kubernetes Monitoring with Prometheus & Grafana',
    domain: 'devops',
    summary: 'Installed kube-prometheus-stack on EKS with Helm to monitor cluster health, workloads and resource usage in Grafana.',
    tags: ['Prometheus', 'Grafana', 'Helm', 'EKS'],
    url: GH + 'tree/DevOps/Kubernetes%20Monitoring%20with%20Prometheus%20and%20Grafana'
  },
  {
    title: 'Automated Infrastructure Provisioning with Terraform',
    domain: 'devops',
    summary: 'Provisioned a VPC, public subnet, internet gateway, security group and EC2 instance on AWS as repeatable Infrastructure as Code.',
    tags: ['Terraform', 'AWS', 'IaC'],
    url: GH + 'tree/DevOps/Automated%20Infrastructure%20Provisioning%20with%20Terraform'
  },

  // ── Systems & Infrastructure ──
  {
    title: 'Veeam Backup & Replication',
    domain: 'sysadmin',
    summary: 'Veeam B&R on VMware ESXi protecting an Exchange 2019 VM and a physical Windows Server through a Veeam Agent, with GFS retention.',
    tags: ['Veeam', 'VMware ESXi', 'Exchange 2019'],
    url: GH + 'tree/System-Administration-Infrastructure/Veeam%20Backup%20%26%20Replication'
  },
  {
    title: 'Secondary DNS & DHCP Server with Zone Replication',
    domain: 'sysadmin',
    summary: 'Windows Server 2025 secondary DNS replicating the AD zone from the primary DC, plus the corporate DHCP scope, with PowerShell rebuild scripts.',
    tags: ['Windows Server 2025', 'DNS', 'DHCP', 'PowerShell'],
    url: GH + 'tree/System-Administration-Infrastructure/Secondary%20DNS%20%26%20DHCP%20Server'
  }
];

const CERTS = [
  {
    name: 'Microsoft Certified: Security Operations Analyst Associate (SC-200)',
    issuer: 'Microsoft',
    logo: 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-associate-badge.svg',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/PepengweniAthenkosi-6414/C62CA2E24568FA61?sharingId=B604582EF6741134'
  },
  {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    logo: 'https://images.credly.com/images/80d8a06a-c384-42bf-ad36-db81bce5adce/blob',
    url: 'https://www.credly.com/badges/6c3c45fa-1cdb-44a6-82ad-0595b4769c87/linked_in_profile'
  },
  {
    name: 'KCNA: Kubernetes and Cloud Native Associate',
    issuer: 'The Linux Foundation',
    logo: 'https://images.credly.com/size/340x340/images/f28f1d88-428a-47f6-95b5-7da1dd6c1000/KCNA_badge.png',
    url: 'https://www.credly.com/badges/aa7a5c46-5703-464d-a64d-99fa5a4a5a97/public_url'
  },
  {
    name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    logo: 'https://images.credly.com/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png',
    url: 'https://www.credly.com/badges/cbdffdff-107f-45bf-9859-950bfe8cfa06/linked_in_profile'
  },
  {
    name: 'BP130: Advanced Structured Cabling Design & Installation',
    issuer: 'Molex Connected Enterprise Solutions',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Molex_Logo_Updated.svg',
    url: 'https://drive.google.com/file/d/1jHgLu5hsMho_mLk92U0M7uyNKNEj9SWI/view?usp=sharing'
  },
  {
    name: 'AWS Cloud Bootcamp',
    issuer: 'CloudSec Network',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    url: 'https://learn.cloudsecnetwork.com/cert/view/CSN-V4YBAICX'
  }
];

const LINKS = {
  email: 'athenkosi.peps@gmail.com',
  linkedin: 'https://www.linkedin.com/in/athenkosi-pepengweni-036443183/',
  github: 'https://github.com/atteks-za',
  cv: 'https://drive.google.com/file/d/1eYBBOo0nAGaHdhUYYPxO24yvY1Xd9f4y/view?usp=sharing'
};
