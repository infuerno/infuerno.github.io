---
layout: post
title: "Build 2020: Cloud Challenage"
---
# Build Applications with Azure DevOps

## Create a build pipeline with Azure Pipelines

### Reference

* Continuous Delivery book: https://www.oreilly.com/library/view/continuous-delivery-reliable/9780321670250/
* Learn YAML
* YAML schema reference: https://docs.microsoft.com/en-gb/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema

### Basics

* Agents can be hosted or self-hosted
* Organize agents into agent pools to avoid managing individually
* Agent pools define a sharing boundary for all agents in the pool
* An organization pool is used to share agents across projects
* A project pool provides access to a single organisation agent pool (and no other pools in the **same** project can access the same organisation pool)

### Forking a repo

When forking a repo, it is common to add the original as a remote named `upstream`: e.g. `git remote add upstream https://github.com/MicrosoftDocs/mslearn-tailspin-spacegame-web.git`

### Build the application

`dotnet build --configuration Release`

### Run the application

`dotnet run --configuration Release --no-build --project Tailspin.SpaceGame.Web`

### Trust certificates

`dotnet dev-certs https --trust` (see: https://www.hanselman.com/blog/DevelopingLocallyWithASPNETCoreUnderHTTPSSSLAndSelfSignedCerts.aspx)

### Use variables in build YAML

```
variables:
  buildConfiguration: 'Release'
  wwwrootDir: 'Tailspin.SpaceGame.Web/wwwroot'
  dotnetSdkVersion: '3.1.100'

steps:
- task: UseDotNet@2
  displayName: 'Use .NET Core SDK $(dotnetSdkVersion)'
  inputs:
    packageType: sdk
    version: $(dotnetSdkVersion)
```

### Use templates in build YAML

templates/build.yml
```
parameters:
  buildConfiguration: 'Release'

steps:
- task: DotNetCoreCLI@2
  displayName: 'Build the project - ${{ parameters.buildConfiguration }}'
  inputs:
    command: 'build'
    arguments: '--no-restore --configuration ${{ parameters.buildConfiguration }}'
    projects: '**/*.csproj'
```

azure-pipelines.yml
```
- template: templates/build.yml
  parameters:
    buildConfiguration: 'Debug'

- template: templates/build.yml
  parameters:
    buildConfiguration: 'Release'
```

## Implement a code workflow in your build pipeline by using Git and GitHub

### Resources

* Git Flow: https://nvie.com/posts/a-successful-git-branching-model/
* Splitting a Pull Request: https://www.thedroidsonroids.com/blog/splitting-pull-request

## Run quality tests in your build pipeline by using Azure Pipelines

`dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura /p:CoverletOutput=./TestResults/Coverage/`

## 