## ⚙️ Installation & Basic Commands

Follow these steps to install Terraform and provision your infrastructure:

1. **Install Terraform**

   * macOS (using Homebrew):

     ```bash
     brew tap hashicorp/tap
     brew install hashicorp/tap/terraform
     ```
   * Linux (using apt):

     ```bash
     sudo apt-get update && sudo apt-get install -y gnupg software-properties-common curl
     curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
     echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
     sudo apt-get update && sudo apt-get install terraform
     ```
   * Windows: Download from the [Terraform website](https://www.terraform.io/downloads) and add to your PATH.

2. **Initialize your working directory**

   ```bash
   terraform init
   ```

   Downloads the required provider plugins and sets up the backend.

3. **Review the execution plan**

   ```bash
   terraform plan -out=tfplan
   ```

   Shows what actions Terraform will take to achieve the desired state.

4. **Apply the plan to provision resources**

   ```bash
   terraform apply "tfplan"
   ```

   Creates or updates infrastructure as defined in your configuration.

5. **Destroy all managed resources**

   ```bash
   terraform destroy
   ```

   Cleans up every resource in the current state.

---

* Modify Terraform files or module inputs
* Re-run `terraform plan` and `terraform apply`
* Terraform will perform in-place updates or replacements based on changes

---

## 🚨 Teardown

To destroy all resources managed by this configuration:

```bash
terraform destroy
```

---

## 📘 Best Practices

* Use remote state (S3 + DynamoDB) for collaboration and state locking
* Tag all resources with `Environment` and `Project` labels
* Store sensitive variables (e.g., RDS password) in a secure secret backend (e.g., AWS Secrets Manager)
* Keep modules DRY and reusable
* Use version control for Terraform modules and state

---

## 📄 License

This Terraform code is licensed under the MIT License. See [LICENSE](../LICENSE) for details.
