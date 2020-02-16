---
layout: post
title: "Terraform: Getting Started - Azure"
---
## Resources

* https://learn.hashicorp.com/terraform/?track=azure#azure
* https://shell.azure.com/ - online shell
* https://www.terraform.io/docs/providers/azurerm/ - Azure RM provider documentation
* https://github.com/terraform-providers/terraform-provider-azurerm/blob/master/CHANGELOG.md - release log for Azure provider

# Install Terraform

* Download from https://www.terraform.io/downloads.html
* Unzip to e.g. C:\Tools
* Add to PATH

# Create Configuration

* `provider` block configures the provider - can use Azure and AWS in the same file - common practice - full list of providers: https://www.terraform.io/docs/providers/index.html (A LOT!!)
* `resource` block requires type and name (used to reference the resource later in the configuration)

# Build Infrastructure

* `terraform init` automatically downloads providers - set TF_DATA_DIR to download plugins / state etc to non working directory: https://www.terraform.io/docs/commands/environment-variables.html#tf_data_dir
* `terraform apply` generates and displays the execution plan (without saving)
* `terraform plan` generates an execution plan
* `terraform state list` list resources
* `terraform state show [xxx]` shows the current state for [xxx] - this contains very important information - required for terraform to know about the current state - consider using remote state (https://www.terraform.io/docs/state/remote.html)

# Change Infrastructure

* `terraform apply` apply any new changes in .tf file to the infrastructure
* `terraform show` to see current state of the infrastructure

# Deploy Infrastructure

* `terraform destroy` destroys all elements in the infrastructure (as though all resources were removed from the .tf file had been blanked out)

# Resource Dependencies

* Interpolation syntax allows referencing other values. Use `${}` e.g. `${aws_instance.web.id}`. 
* Format is usually: `TYPE.NAME.ATTRIBUTE`
* If a resource is countable (has the `count` attribute set), reference individual resources by index e.g. `${aws_instance.web.0.id}`
* Get a list using the splat syntax e.g. `${aws_instance.web.*.id}`
* See: https://www.terraform.io/docs/configuration-0-11/interpolation.html
* Terraform will automatically work out dependencies by studying the resource attributes used in interpolation expressions. Thus it can determine the correct order in which to create resources. This is the PRIMARY way to inform Terraform of these dependencies - use where possible.

# Provision

Terraform provisioners help you do additional setup and configuration when a resource is created or destroyed. You can move files, run shell scripts, and install software.

* DO NOT USE instead of configuration management tool to maintain state and configuration for existing resources. Use chef, ansible, DSC.
* Consider Packer for creating custom images where the image is managed as code as an alternative approach
* Provisioners are defined on resources, usually new resources just being provisioned
* Nevertheless, the `null_resource` is available (which also allows the `depends_on` attribute to help control flow)
* Provisioners are only run during CREATE or DESTROY - but NOT UPDATE (either create OR destroy OR both). e.g. `when = "destroy"`.
* If provisioning fails the resources will be marked `taint`ed. They will be destroyed and recreated on the next `apply`.

# Input Variables

* Variables are specified and can be given default values in a file `variables.tf`
* Variable values can be set from another file either `terraform.tfvars` or `*.auto.tfvars` (or specify using `-var-file`), or from command line `-var` for relevant commands (`plan`, `apply`, `refresh`)
* For secrets create a secrets file locally and use `-var-file` to load it
* Multiple files can be specified e.g. `terraform apply -var-file='secret.tfvars' -var-file='production.tfvars'`
* Environment variables of the value `TF_VAR_name` will be read e.g. `TF_VAR_location` to set the value of `location`
* Variable type can be string, list, map
* Lists can specify type either implicitly or explicitly e.g. `variable "cidrs" { default = [] }` or `variable "cidrs" { type = "list" }`
* Maps can be defined implicitly by specifying a default value which is a map, using `default = {}`, or explicitly
* Apply variables from a map using the `lookup` function e.g. `sku = "${lookup(var.sku, var.location)}"` or `${var.sku["uksouth"]}`

# Output Variables

* Use to output information and data resulting from the infrastructure provisioning e.g. IP addresses
* Define e.g.
```
`output "ip" {
  value = "${azurerm_public_ip.publicip.ip_address}"
}`
```
* Automatically printed following `terraform apply`
* Can additionally be queried using `terraform output [output-var-name]`

# Modules

Terraform modules are self-contained packages of Terraform configurations that are managed as a group. Modules are used to create reusable components, improve organization, and to treat pieces of infrastructure as a black box. e.g. `network` module, `compute` module.

* As with resource blocks, a module block requires a name 
* The only mandatory attribute is source, the location of the module in e.g. the official Terraform Registry, a private registry, directly from Git, Mercurial, HTTP or local files
* Following the addition of modules, rerun `terraform init` to retrieve modules. `-upgrade` checks for any newer versions of existing modules and providers
* Module outputs are often used as the input to other modules using `${module.NAME.OUTPUT}`

# Remote State Storage

Supports team based workflows via remote backends.
