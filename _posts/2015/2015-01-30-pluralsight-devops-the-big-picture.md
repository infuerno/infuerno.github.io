---
layout: post
title: Pluralsight - DevOps The Big Picture
---
## Problems DevOps solve

### Pain

### Waste

Knowledge waste - losing key information, teams don't have the key information they need to maintain systems
Waiting waste - waiting is a huge problem
Over-production waste - servers over specced
Over-processing waste - exceeding the spec, most features don't get used
Motion waste - long nights will wear out staff, manual testing
Transportation waste - zipping up software, copying unnecessarily
Correction waste - dev teams often incentivised to ship, not to ship well, quality should be built from the beginning, if only checking quality on the way out, the process is wrong
Inventory waste - code waiting to be shipped, not pushed to production
Defect waste - bug goes into production, much more difficult to fix now

### DevOps

Add value, improve flow

LEAN - focus on customer value, eliminate waste, reduce cycle time, share learning continuously sharing, pull work when ready rather than have it pushed

"I.T. is the factory floor of this century" - Gene Kim

DevOps is the result of implementing LEAN principles in IT, shorten the cycle time between dev and ops.

John Willis coined the acronym CAMS - Culture, Automation, Monitoring, Sharing

## Transition to DevOps

### Change culture

Teams and individuals need to be empowered
With empowerment comes accountability
Build in quality from the beginning
Reward for stepping up and fixing a problem, not just having ideas
Value learning, attend conferences
Need to trust each other is doing things in the best interests
Management should reward the right values (not just being a long standing employee)

### Change organisation

Gain understanding. How does everything work? What is the logical architecture? What is the process architecture. 
Value stream mapping, process flow mapping.
Need to gain a clear vision.

Recognise bottlenecks. Poor quality, no communication etc.

Alter team structure. DevOps is a re-org, not a new team to hire. Treat work as services, rather than projects. Specialists encourage silos. Generalists can swap roles easily.

Streamline procedures. How do you do change management, knowledge management, incident management.

### Address objections

Security. Often with DevOps you end up more secure not less secure. 
Operations Impact. Role will still be similar, but more integrated.
Legacy. Same applies to legacy systems and trying to optimise them too.
Skills. Build the skills needed.

## Introducing DevOps Automation

Automate repetitive tasks. Improve the feedback loop. 

### Tools

There are all kinds of tools:
* Collaboration tools
* Planning tools
* Issue tracking tools
* Monitoring tools
* Configuration management tools
* Source control
* Dev environment things
* Continous integration tools
* Deployment tools

#### Collaboration

Standups, downtime exercises (simulate failures).
Tools include real time chat, knowledge repositories.
Real time chat: skype, linq
Group chat: basecamp, slack
Blogging: use blogging tools to store information, Wordpress (read 'A year without pants' by Scott Berkun)
Wiki: Github wiki

#### Planning

How do I get the collective team to help with planning. Formal project management tools, kanban boards. Transparency to all team members.
e.g. trello; visual studio

#### Issue tracking

Have a shared way to collect share and see whats going on.
e.g. zendesk; jira (also supports continuous deployment)

#### Monitoring

Inside out and outside in. Key about seeing the health of the whole system. 
* logstash <http://logstash.net/>
* microsoft system center
* kibana to analyse log files along with elastic search, graphite, stats d
* new relic for monitoring <http://newrelic.com>

#### Configuration management

Enforce consistency through automation
Lots of tools here:
* chef <http://www.getchef.com>; 
* salt <http://www.saltstack.com> focuses on high speed communication between nodes versus the polling strategies which chef or puppet use
* puppet great tool for creating declaritive infrastructure definitions, works with windows and linux, has lots of pre-built modules for e.g. iis
* ansible (uses ssh rather than agents) not much windows support
* cfengine
* powershell dsc (desired state configuration) <http://technet.microsoft.com/en-us/library/dn249912.aspx>

#### Source control

One of the keys of DevOps is to realise the power of source control and of storing the configurations of all of your environments. Track history of changes. See what easily changed between one and the other versus people manually changing boxes.

#### Dev Environments

Dev environments can also be handled using similar tools to configuration management this to support production standard environments to help 
Brower based IDEs like code envy <https://codenvy.com/>
Vagrant is brilliant for standing up virtual servers of a complete environment <http://www.vagrantup.com>. Vagrant cloud can also be used for sharing e.g. via sshing into a box on port 80. 

#### Continuous integration

How are developer copies getting merged to the main branch multiple times a day. 
Centralised build engines, set of automated tests, automated penetration tests etc
Teamcity <http://www.jetbrains.com>
Hudson, now Jenkins
Travis CI <http://travis-ci.com> - integrates well with github

#### Continuous deployment

Continous delivery means you could be delivering constantly, continuous deployment means you are. Goal is to make deployments more reliable and less scary. If you can check in and seconds / minutes later your code is in production it focuses you on thinking about the whole pipeline and bringing dev and operations together. Complete audit trail.
Brings devops to life.

Cloudformation <http://aws.amazon.com/cloudformation> for orchestrating out deployment of environments (not applications - use elastic beanstalk for this)
Packer <http://www.packer.io> - take a running machine, put a provisioner on it that configures it, take that configured machine with the code on it and create a template - a gold machine
Docker <http://docker.com> - OS virtualisation rather than server virtualisation, get more density of use out of a VM. Great way to containerise things.
Octopus deploy <http://octopusdeploy.com> - great visibility, introduce approvals and manual intervention
GO <http://www.go.cd> - just open sourced from thoughtworks












