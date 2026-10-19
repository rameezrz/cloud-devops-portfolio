# Week 02

## Provider

A Terraform provider is a executable binary plugin that serves as the translation layer between Terraform's configuration language (HCL) and the upstream APIs of a cloud platform or service.

Because Terraform has no single default provider, it cannot assume anything about where you want to build infrastructure. Providers act as the drivers that allow Terraform to communicate with external platforms such as Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, Kubernetes, or GitHub.

## Resource

A resource in Terraform is the core building block of Infrastructure as Code (IaC), representing a single infrastructure object, such as a virtual machine, database, storage bucket, or DNS record that Terraform creates, updates, and deletes.

## Variable

In Terraform, a variable (specifically known as an input variable) acts as a dynamic placeholder or parameter for your infrastructure configuration.

Instead of hardcoding specific values (like an AWS region, IP address, or server size) directly into your code, you use variables to make your configurations reusable, flexible, and maintainable across different environments (such as development, staging, and production). Think of them like function arguments in standard programming languages.


| Value Type | Purpose | Analogy |
| -------- | -------- | -------- |
| Input Variables | External parameters passed into the configuration. | Function arguments |
| Local Values (Locals) | Internal temporary variables calculated inside the code (cannot be set externally). | Local variables inside a function |
| Output Values | Information exposed to the command line or other configurations after deployment. | Return values of a function |


## Output

In Terraform, an output is a named value that extracts and exposes data from your deployed infrastructure. Conceptually, they function exactly like return values in a programming language.

| Command | Description | 
| -------- | -------- | 
| `terraform output` | Lists all defined root module outputs and their values.
| `terraform output instance_public_ip` | Retrieves the value of one specific output. 
| `terraform output -json` | Formats all outputs into a JSON object, ideal for parsing in scripts via tools like `jq`.
| `terraform output -raw instance_public_ip` | Prints a clean string value without quotes or formatting, useful for environment variables.


## State

In Terraform, state is a JSON file that acts as the single source of truth for your managed infrastructure. By default, it is stored locally as a file named terraform.tfstate.

Its primary purpose is to map the resource declarations in your configuration code (.tf files) to the real-world resources deployed in your cloud provider.

**Local Backend**: Stores the file on your local machine. This works well for isolated or personal projects.

**Remote Backend**: For teams, state is stored in a shared cloud environment like an Amazon S3 bucket, Azure Blob Storage, or Terraform Cloud. Remote backends provide state locking (preventing two people from running updates simultaneously and corrupting the file) and keep secrets out of local environments.

## Remote state

- Remote state gives every run (and every teammate/CI job) one shared source of truth, instead of a local file that can be lost, diverged, or committed with secrets by accident.
- Locking stops two `apply` runs from writing state at once, which can corrupt it; `use_lockfile = true` does this natively in S3, so no DynamoDB table is needed.
- Versioning + encryption + a public-access block mean state (which can contain sensitive values) is recoverable, protected at rest, and never exposed.

### Bootstrap (one-time)
`infra/bootstrap` creates the state bucket and keeps its own state **locally** (gitignored).
    cd infra/bootstrap && terraform init && terraform apply
If the local bootstrap state is lost, re-run `init` and `terraform import` each resource (see the import commands in docs), then confirm `terraform plan` shows no changes.