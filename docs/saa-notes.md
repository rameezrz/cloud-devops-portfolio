# Solutions Architect Associate prep

1. An enterprise has two separate AWS accounts: Account A (production environment) and Account B (external vendor logging and monitoring). The vendor in Account B needs programmatic access to read specific log files in an Amazon S3 bucket located in Account A. What is the most secure and recommended way to architect this access?

    **Ans** : Create an IAM role in Account A with a trust policy that permits Account B to assume it, and attach a permissions policy allowing read access to the S3 bucket.

2. You have deployed a multi-tier web application inside a custom VPC. Your application backend EC2 instances reside in a private subnet and need to download critical security updates from the internet. However, these instances must not accept inbound connections originating from the internet. Which architectural component should you implement to satisfy these requirements?

    **Ans** : Deploy a NAT gateway in a public subnet of your VPC and configure the private subnet's route table to route outbound internet traffic (0.0.0.0/0) to the NAT gateway.

3. A company requires that its developers can only execute AWS API calls and access administrative resources when they are connected from the corporate office network, which uses a specific public IP range (203.0.113.0/24). Which IAM policy configuration should a solutions architect apply to enforce this constraint?

    **Ans** : Create an IAM policy with a Condition block containing the aws:SourceIp key set to 203.0.113.0/24 and an explicit Deny or Allow structure.

4. An organization has three VPCs in the same AWS Region: VPC A (CIDR 10.1.0.0/16), VPC B (CIDR 10.2.0.0/16), and VPC C (CIDR 10.3.0.0/16). A VPC peering connection is established between VPC A and VPC B, and another separate VPC peering connection is established between VPC B and VPC C. There is no peering connection between VPC A and VPC C. What is required for workloads in VPC A to communicate directly with VPC C?

    **Ans** : Establish a new, direct VPC peering connection between VPC A and VPC C, and update their respective route tables.

5. An application running on EC2 instances inside a private subnet of a VPC frequently queries Amazon DynamoDB tables. To optimize cost and enhance security, management wants to ensure this traffic stays entirely within the AWS backbone network without traversing NAT gateways or the public internet. What is the most optimal solution?

    **Ans** : Create a Gateway VPC Endpoint for DynamoDB and associate it with the route table of the private subnet.

6. A systems administrator notices that an EC2 instance in a private subnet can successfully receive inbound SSH traffic (port 22) from a bastion host, but outbound responses are failing or blocked. The Security Group attached to the EC2 instance allows all outbound traffic (0.0.0.0/0). What is the most likely cause of this issue at the subnet level?

    **Ans** : The Network ACL (NACL) associated with the subnet has an explicit deny or missing allow rule for ephemeral return ports (1024-65535) on outbound traffic.
Network ACLs are stateless, meaning you must explicitly allow both inbound traffic and outbound return (ephemeral) traffic in the NACL rules.

7. A large enterprise wants corporate employees to log into the AWS Management Console using their existing credentials managed in an on-premises Active Directory system that supports SAML 2.0. Management does not want to create individual IAM users for each employee in AWS. How should a solutions architect implement this?

    **Ans** : Configure the corporate Identity Provider as a SAML identity provider in IAM, create an IAM role that trusts this provider, and map SAML assertions to the role.
SAML-based federation allows external identity providers to authenticate users and pass assertions to assume a trusted IAM role in AWS.

8. An engineer launches a new EC2 instance inside a newly created public subnet of a VPC. The instance is assigned an Elastic IP address, but external systems cannot ping or connect to the instance via the internet. Upon inspection, the Internet Gateway is correctly attached to the VPC. What is missing?

    **Ans** : The custom route table associated with the subnet lacks a route directing 0.0.0.0/0 traffic to the Internet Gateway.
A subnet is only public if its associated route table contains an explicit route sending destination 0.0.0.0/0 to an Internet Gateway.

9. You want to delegate the creation of IAM users and roles to junior systems administrators within your organization. However, you want to guarantee that these junior admins cannot create roles or policies that grant themselves full administrator access (privilege escalation). What feature should you implement?

    **Ans** : Attach an IAM permissions boundary to the junior administrators' IAM entities to limit the maximum permissions they can grant when creating new users or roles.
Permissions boundaries set the maximum permissions that an identity-based policy can grant to an IAM entity, effectively preventing privilege escalation.

10. Your application runs on EC2 instances deployed in a private IPv6-enabled subnet within a VPC. The instances need to initiate outbound IPv6 connections to external services on the internet to pull software packages. However, external internet entities must not be able to initiate inbound IPv6 connections to your instances. Which VPC component should you use?

    **Ans** : An Egress-Only Internet Gateway attached to the VPC and referenced in the private subnet's route table for ::/0.
An Egress-Only Internet Gateway is a stateful component for IPv6 traffic that enables outbound communication from the VPC to the internet while preventing inbound connections.