---
layout: post
title: "Google IT Support Professional Certificate: The Bits and Bytes of Computer Networking"
---

## Network models

* The TCP/IP Five-Layer Network Model
![The TCP/IP Five-Layer Network Model](https://www.dropbox.com/s/r52dofmau5vz61l/2018-01-29%2022_10_31-The%20TCP_IP%20Five-Layer%20Network%20Model%20-%20Google%20_%20Coursera.png?raw=1)
* OSI Networking Model: https://en.wikipedia.org/wiki/OSI_model

Physical Layer
: Represents the physical devices that interconnect computers

Data link layer
: Responsible for defining a common way of these signals so network devices can communicate

Ethernet
: Beyond specifying physical layer attributes, the Ethernet standards also define a protocol responsible for getting data to nodes on the same network or link.

Network (internet) layer
: Allows different networks to communicate with each other through devices known as routers

Transport layer
: Sorts out which client and server programs are supposed to get data

## The Basics of Networking Devices

Crosstalk
 : When an electrical pulse on one wire is accidentally detected on another wire. Cat5e and Cat6 cables introduced measures to reduce crosstalk

Fiber cables
 : Contain individual optical fibers, which are tiny tubes made out of glass about the width of a human hair

Collision domain
: A network segment where only one device can communicate at a time. If multiple devices try sending data at the same time, the electrical pulses sent across the cable can interfere with each other

Hub
: A physical layer device that allows for connetions from many computers at once. Less common now.

Switch
: A data link layer device, which can inspect the contents of the ethernet protocol data being sent and determin which system the data is destined for, thereby reducing collisions. Hubs and switches are the primary devices used to connect computers on a single network, usually referred to as a LAN, or local area network

Router
: A network layer device that knows how to forward data between independent networks

Border Gateway Protocol (BGP)
: Routers share data with each other via this protocol, which lets them learn about the most optimal paths to forward traffic

## Physical Layer

Modulation
: A way of varying the voltage of the charge moving across a cable - with computer networking, this is more commonly know as **line coding**.

Duplex communication
: The concept that information can flow in both directions across the cable (e.g. phone call). One of two pairs of the 4 pairs in a twisted pair cable are used to communicate in one direction and the other two pairs in the other direction

Simplex communication
: This process is unidirectional (e.g. baby monitor)

Full duplex
: Devices can communicate at exactly the same time (simultaneous)

Half duplex
: Devices can communicate both ways, but not at the same time (take turns)

## Data Link Layer

Ethernet is the most common protocol at this layer. This layer provide a means for software at higher levels of the stack to send and receive data. The Data Link Layer abstracts away the details of the physical layer and the hardware in use.

CSMA/CD
: Carrier Sense with Collision Detection. Prior to switches, nodes on a network could not selectively talk to each other, they had to broadcast messages to the entire network, and so to be intelligable only one node could speak at once - a collision domain. To solve this CSMA/CD is a way to help determin when the communication channels are clear and when a device is free to transmit data.
    - If no one else transmitting - send data
    - If two or more nodes try to send data at the same time, back off for a random amount of time and try again

MAC address
: Media Access Control address is a globally unique identifier attached to an individual network interface. 48 bit, 6 octets - first 3 octets are assigned to individual manufacturers, last 3 octets are assigned as desired by the manufacturer - must never use the same number twice. Ethernet uses MAC addresses to identify the source node and the target node. 

Unicast
: transmission for just one node

Multicast
: transmission for a group of nodes

Broadcast
: transmisison for all nodes using a broadcast address. The broadcast address for ethernet is ff:ff:ff:ff:ff:ff

Ethernet frame
: A data packet at the data link Layer

Preamble
: 8 bytes (64 bits) split into two sections - first 7 bytes are alternating 1s and 0s for synchronisation, last byte is the SFD (Start Frame Delimiter) which indicate the header is about to start.

Destination and Source MAC address
: Hardware address of the intended recipient and sender respectively (for this stretch only)

VLAN field (optional)
: Allows having multiple logical LANs on the same physical equipment. Often used to segregate differenty types of traffic e.g. VoIP and Internet

EtherType field
: 16 bits describing the protocol

Payload
: The data. From 46 to 1500 bytes long - contains data from the higher levels

Frame Check Sequence
: 4 bytes (32 bits) checksum for the entire frame. The checksum is calculated by performing a cyclical redundancy check (CRC) against the frame. The CRC is a mathematical calculation which will always have the same value when calculated on the same set of data. This tells the receiver if the data is ok, or corrupt. The FCS is appended to the end of the Ethernet frame. If the CRC check fails, the data is discarded.

## Network Layer

Switches quickly learn the MAC addresses of the node connected to each port and can forward traffic quickly, but this doesn't scale. IP addresses are used to route traffic across different networks. 

IP datagram
: A data packet at the network layer

![https://www.dropbox.com/s/6r1db62xxyteopk/Disection%20of%20an%20IP%20datagram.png?raw=1](Disection of an IP Datagram)

Version
: 4 bits e.g. 4 or 6

Header length field
: Usually 20 bytes with IPv4

Identification field
: Used when data needs to be split across multiple IP datagrams. All packets with the same number belong to one group.

Flag field
: Indicates if the datagram is allowed to be fragmented, or has already been fragmented

TTL
: 8 bit field indicates how many router hops a datagram can traverse before its thrown away. Each hop decrements this field and if the value reaches 0 the router discards the datagram. This is to stop endless loops due to misconfiguration. 

Protocol field
: Indicates the transport layer protocol, e.g. TCP or UDP

Header checksum
: Since the TTL has to be decremented, this needs to be recalculated each time

Source and Destination IP addresses
: Address of the sender and recipient for the complete transmission

### IP Address Classes

* Class A - first octet used for the network ID, last 3 for the host id
* Class B - first 2 octets used for the network ID, last 2 for the host id
* Class C - first 3 octets used for the network ID, last octet for the host id

### ARP - Address Resolution Protocol

ARP is a protocol used to discover the hardware address of a node with a certain IP address. The IP datagram is encapsulated in an ethernet frame which requires a MAC address. Most network devices maintain a local ARP table - a list of IP addresses and the MAC addresses associated with them. If there is no entry in the ARP table for a particular IP address, a node sends a broadcast ARP messages delivered to all computers on the local network. When the node with the corresponding IP addresses received the message, it sends back an ARP response containing the MAC address required. ARP entries expire after a short amount of time. 

### Subnetting
TODO

### Routing

Simple at a high level, but very complex at the detailed level. Only ISPs tend to deal with complex routing.

Router
: A network device that forwards traffic depending on the destination address of that traffic. Has at least two NICs because it has to be connected to at least two networks. 

Basic routing
: Receive data package -> Examine destination IP -> Loop up IP in routing table -> Forward traffic on the interface closest to the remote network, creating a new ethernet frame with its interface as the new source MAC address and either another gateway OR the node itself as the destination MAC address (from its own ARP table)

Routing table
: The most basic routing table has 4 columns: Destination network - definition of the remote network e.g. stored in CIDR notation - will have a catch all entry for all IP addresses it doesn't have a listing for; Next hop - next router which should receive data for a particular desination network OR network directly connected; Total hops: crucial since a router may know of many different paths to a network, and this indicates which way is likely quickest - will be updated when it receives data from its neighbours; Interface - which of its own interfaces it should forward the traffic out of

A core ISP router often has millions of rows in its routing table, which must be consulted for everything single packet!

Non-routable address space
: Reserved ranges of IP addresses for internal networks only. Gateway routers will not forward traffic for these addresses (NAT allows nodes to communicate outwards). The 3 ranges are: 10.0.0.0/8; 172.16.0.0/12; 192.168.0.0/16

#### Routing Protocol Examples
* Interior Gateway Routing
    + Distance Vector:
        - RIP: https://en.wikipedia.org/wiki/Routing_Information_Protocol
        - EIGRP: https://en.wikipedia.org/wiki/Enhanced_Interior_Gateway_Routing_Protocol
    + Link State:
        - OSPF: https://en.wikipedia.org/wiki/Open_Shortest_Path_First
* Interior Gateway Routing
    + BGP: https://en.wikipedia.org/wiki/Border_Gateway_Protocol

#### RFCs
* The IETF who now own the multitude of RFCs: http://www.ietf.org/
* April Fool's Day RFCs: https://en.wikipedia.org/wiki/April_Fools%27_Day_Request_for_Comments
    - RFC 1149
    - RFC 3514

## Transport Layer

Port
: A 16-bit number that's used to direct traffice to specific services running on a networked computer (also know as a socket address or socket number when appended to an IP address with a colon)

TCP segment
: Made up of a TCP header and data section

![TCP segment](https://www.dropbox.com/s/9yyevqb8dxjme23/Dissection%20of%20a%20TCP%20Segment.png?raw=1)

Source port
: A high-numbered port chosen from a special section of ports know as ephemeral ports

Sequence number
: A 32-bit number that's used to keep track of where in a sequence of TCP segments this one is expected to be

Acknowledgement number
: The number of the next expected segment

Data offset field
: A 4-bit number that communicates how long the TCP header for this segment is

TCP window
: Specifies the range of sequence numbers that might be sent before an acknowledgement is required

TCP control flags
: * URG (urgent) - segment is considered urgent, check the urgent pointer field for more details
* ACK (acknowledged) - if the value is one, check the acknowledge number field
* PSH (push) - the transmitting device wants the receiving device to push currently-buffered data to the application on the receiving end asap
* RST (reset) - one of the sides in a TCP connection hasn't been able to properly recover from a series of missing or malformed segments
* SYN (synchronize) - used in the handshake, check the sequence number field
* FIN (finish) - when set to one, the transmitting computer doesn't have any more data to send, connection can be closed

The three-way handshake 
: Used to initiate a TCP connection: A -> B SYN; B -> A SYN/ACK;A -> B ACK

The four-way hanshake
: Used to end a TCP connection: A -> B (or B -> A) FIN; B -> A ACK; B -> A FIN; A -> B ACK;

Socket states
: A port can be used to communication if a program has opened a socket on that port. The socket can exist in a number of states (exact states may vary by system)
* LISTEN - A TCP socket is ready and listening for incoming connections (server side onely)
* SYN_SENT - A synchronisation request has been sent, but the connection hasn't been established yet (client side only)
* SYN_RECEIVED - A socket previously in a LISTEN state has received a synchronisation request and sent a SYN/ACK back (server side only)
* ESTABLISHED - TCP connection is in working order, both sides free to send data (client / server)
* FIN_WAIT - FIN sent, but ACK not yet recieved
* CLOSE_WAIT - Connection closed on the TCP layer, but the program that opened the socket hasn't released it yet
* CLOSED - Connection fully terminated

### System ports v Ephemeral ports

* There are system ports (1-1023), registered ports (1024-49151) and ephemeral ports (49152–65535) - https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

## Session Layer (OSI model)

Facilitates the communication betwee actual applications and the transport layer - takes the data from the TCP layer and hands it off to the next layer, the presentation layer

## Presentation Layer (OSI model)

Ensures the unencapsulated application layer data is able to be understood by the application in question - may handle encryption or compression of data
 
## Walkthrough

1. A user opens a browser and types in the address of a web page on a server using the IP address.
2. The web browser communicates with the local networking stack - part of the OS responsible for handling networking functions - saying that it wants to establish a TCP connection to the specified IP address and port
3. The networking stack checks its own subnet and recognises that the destination is on another network - so the request will need to go to the gateway (which it knows the IP address of)
4. The ARP table is consulted to get the MAC address of the gateway - there is no entry - so the computer sends an ARP Request to the broadcast address of ff:ff:ff:ff:ff:ff - this goes to every node on the local network - the gateway will then respond with its MAC address - the computer will now update its ARP table with the new information
5. To initiate an outbound TCP connection, an outbound source port is required, the OS identifies an available port in the ephemeral range and opens a socket connecting the web browser to this port
6. The networking stack starts to build a TCP segment using the source port e.g. 50000, the destination port e.g. 80, the sequence number e.g. ???? and the SYN flag set. The checksum is then calculated and populated in the header. There is no data at this point - we need to establish the connection first and this simply needs the initial segment to contain the first part of the three way TCP handshake - SYN - to the receiving server.
7. The TCP segment is passed to the Network layer. This layer constructs an IP header using the source IP, the destination IP, and a TTL of e.g. 64. The TCP segment is added to the IP datagrams payload. Finally the checksum is calcuated.
8. An ethernet frame needs to now be constructed to get this first datagram at least as far as the gateway. The header is populated including the source MAC address and the gateway's MAC address, the IP datagram is inserted, and the checksum calculated
9. The Ethernet frame is sent as binary data via the NIC attached to the computer. The binary data is sent as modulations of the voltage of an electrical current running across a Cat6 cable connected to a network switch. 
10. The switch receives the frame and inspects the destination MAC address. The switch knows which interface the destination is connected to and forwards the ethernet frame to this interface, which in turn will send the binary data down the wire.
11. The gateway router now recieves the ethernet frame, inspects the destination which is itself and calculates and compares the checksum
12. The used ethernet frame is discarded and the IP datagram checksum calcualted and checked
13. The router then checks the destination address and does a lookup against the routing table. The lookup returns a route, which is one hop away via router B.
14. The router then decrements the TTL, calculates a new checksum for the IP datagram
15. The router now needs to construct an ethernet frame with the MAC address of router B - it consults its ARP table, finds an entry and constructs the ethernet frame, adds the IP datagram and calclates the checksum before putting it on the wire via its NIC connected to network B.
16. The frame is sent via a switch to router B which performs all the same checks and discards the ethernet frame. The desination IP address in the IP datagram is on its own network, so it decrements the TTL, calculates a new checksum and starts constructing an ethernet frame using the data from its ARP table to send to the final destination
17. Finally at the destination computer, the ethernet frame is inspected, checked and discarded. The IP datagram is checked and the destination IP address checked - it is its own! The IP datagram is discarded. The TCP segment checksum is examined, calculated and compared. 
18. The port in the TCP segment is now checked. The networking stack on this computer checks there is an open socket on port 80. There is and its in the LISTEN state. The flags are checked, SYN is set, so the sequence number field is also checked and the value stored for the ACK response to be sent back shortly

## Network Services

A good subset of all network services help make networking more user friendly and secure. If something isn't working on the network, the services here are an important place to start.

## DNS

DNS
: A global and highly distributed network service that resolves strings of letters into IP addresses

* DNS serves lots of purposes e.g. domain names can be resolved to different servers, based on the geographic location of the request. This also depends on DNS. 
* Four things which need to be specifically configured on a node on a network for a standard modern network configuration:
    - IP address
    - Subnet mask
    - Gateway for the host
    - DNS server (or without DNS can only use IP addresses)
* Five types of DNS servers (with one DNS server often fulfilling multiple roles at once):
    - Caching name servers - provided by ISP - cache known domain name lookups - most caching servers are also recursive name servers
    - Recursive name servers - perform full DNS resolution requests
    - Root name servers
    - TLD name servers
    - Authoritative name servers
* Computers and phones will often have their own DNS cache, so they don't have to reach out to the local name server

### Full recursive DNS resolution steps

1. Local name server contacts one of 13 **root name servers**
    - previously actual servers distributed geographically
    - now distributed via **anycast**, a technique used to route traffic to different destinations depending on factors like location, congestion or link health - a node can route a datagram to a specific IP, but see it routed to multiple places
2. Root name server will redirect query to towards the responsible **TLD name server** - the TDL being the last part of a domain name e.g. `.com`. TLD name servers will again likely be a a globally distribution of anycast accessible servers
3. The TDL name server will respond with the authoritative name server to contact, responsible for the last 2 parts of a domain name e.g. `weather.com` (usually run by the company that runs the site)
4. The authorative name server when queried will respond with the IP address in question

### DNS and UDP

* DNS normally uses UDP rather than TCP. A DNS request and its response can usually fit into a singe UDP datagram. Using TCP takes a minimum of 44 packets, using UDP takes 8 packets. The DNS resolver simply asks a DNS server again if a reply is not given.
* DNS over TCP does exist when the data does not fit inside a single datagram. In this instance the DNS server responds to this effect, demanding that the DNS resolver re requests using TCP.

### DNS Resource Record Types

A record
: Used to point a certain domain name at a certain IPv4 IP address - usually a single A record is configured for a single domain name

DNS round robin
: A single domain name has multiple A records used to balance traffic across multiple IPs. If there are multiple A records, all would be returned for a DNS request, but cycling the order in which they are returned. The DNS resolving computer would try the first one first, but can fall back on the others if this one doesn't work. 

Quad A - AAAA - record
: Returns an IPv6 record, rather than an IPv4 record

CNAME record (short for Canonical Name)
: Used to redirect traffic from one domain to another e.g. microsoft.com -> www.microsoft.com. The DNS resolving machine would initially get back www.microsoft.com in response to microsoft.com and would then perform a name resolution against www.microsoft.com. Useful instead of setting up two A records for the two domains.

MX record (Mail Exchange)
: Used to deliver email to the correct server

SRV record (Service record)
: Defines the location of specific services, like the MX record, but for lots of other service types besides email e.g. caldav

TXT record ()
: Originally designed to associate some text with a specific domain name. However it is increasingly used to contain configuration data for other services to consume.

### Domain names

* ICANN is a sister organisation to the IANA. Help to define and control both the global IP spaces and the global DNS system.
* A registrar is a company which has an agreement with ICANN to sell unregistered domain names.
* DNS can support up to 127 levels of domain for a single FQDN - each individual section is limited to 63 charaters - the full FQDN is limited to 255 characters

### DNS Zones

* DNS servers are actually responsible for DNS zones
    - root servers are responsible for the root zone
    - each TLD server is responsible for the zone covering its TLD etc
* All DNS servers are authoritative inluding root and TLD name servers - the zones these are authoritative for are special cases
* DNS zones allows for easier control over multiple levels of a domain - network admins can split their domains into different zones using subdomains - n + 1 nameservers would then be required - one for the domain and one for each of the subdomains
* Zones are configured using a zone file - must contain an SOA declaration (Start of Authority)

SOA record (Start of Authority)
: Declares the zone and the name of the name server authoritative for it

NS record
: Other name servers also responsible for this zone

Reverse look up zone files
: Let DNS resolvers ask for an IP and get the FQDN associated with it

PTR record (Pointer resource record)
: Resolves an IP to a name

## DHCP

An application level protocol which automates the configuration process of hosts on a network. When connecting to a network, a machine can query a DHCP server and get all the configuration information in one go.

Dynamic allocation
: A range of IP addresses is set aside for client devices and one of these IP addreses is issued when they request one

Automatic allocation
: Similarlity has a range of IP addresses, but keeps track of which IP addresses clients have received in the past - will assign the same IP to the same machine each time _if possible_

Fixed allocation
: Manually specified list of MAC addresses and corresponding IPs - if the MAC address is not found, can fallback to automatic or dynamic, but can refuse the request

DHCP can be used for mulitple things, not just the basic network configuration e.g. NTP

DHCP discovery
: The process by which a client attempts to get network configuration information (if configured to use DHCP)

1. Server discover step - client sends a DHCPDISCOVER message on to the network using a specially crafted broadcast message. DHCP listens on port 67 and DHCPDISCOVER messages are always sent from port 68 on the client over UDP. The destination IP address would be 255.255.255.255 and the source address is 0.0.0.0 - goes to every node on the network
2. DHCP server checks its configuration and if possible to allocate an IP address will send back a DHCPOFFER address to 255.255.255.255:68 from itself (e.g. 192.168.0.1:67) - again goes to every machine on the network and the original client recognises that this message is meant for itself since a field contains the clients MAC address, previously sent in the DHCPDISCOVER message
3. Client processes the DHCPOFFER to check what IP address is being offered
4. If acceptable client sends DHCPREQUEST
5. Server sends DHCPACK
6. Client's networking stack now sets up own networking configuation using information presented by the server

DHCP lease
: Configuration sent to the client as part of DHCP discovery - only valid for a fixed amount of time

## NAT

Takes one IP address and translates it into another. Lots of reasons to do this.

NAT
: Technology that allows a gateway usually a router or a firewall to rewrite the source IP of an outgoing IP datagram, while retaining the original IP in order to rewrite it into the response

Normally a router will simply decrement the TTL, recalculate the checksum and send a packet on its way. However, if a router is configured to NAT, it will additionally update the source address from the originating node, to itself. To the destination, it will look as though the packet originated at the router. The router is hiding the IP of the source from the destination, known as NAT masquerading. Significant security measure. Hundreds of nodes on the source network can communicate but without revealing their IP addresses.  Known as One-to-many NAT, used in lots of LANs today.

Port preservation
: A technique where the source port chosen by the client is the same port used by the router

A router using one-to-many NAT will need to keep track of which incoming packets need to go to which nodes. One way is to use the original source port (a high random number port) as a lookup, storing it in a table. If two different computers happen to choose the same number - the router selects a different random port to use instead (and presumably NATs the IP address and the port)

Port forwarding
: A technique where specific destination ports can be configured to always be deliverd to specific nodes

Traffic delivered to a gateway router on port 80 is always forwarded to a web server; traffic delivered to the same router on port 25 is forwarded to an SMTP server

RIR
: Regional Internet Registry: AFRINIC - services Africa; ARIN - USA, Canada; APNIC - Asia and Australisia; LACNIC - Central and South America; RIPE - Europe, Russia, Middle East. 

RIRs are responsible for assigning address blocks within that area. Most have already run out. IANA assigned the last /8 blocks on 3rd Feb 2011. In April 2011, APNIC ran out of addresses. RIPE ran out in September 2012. LACNIC ran out in June 2014. ARIN ran out in September 2015. Only AFRINIC has some IP addresses left, predicted to be depleted by 2018. 

NAT and non-routable address space is required to get round this while IPv6 is being fully rolled out.

https://en.wikipedia.org/wiki/IPv4_address_exhaustion

## VPNs

VPN
: Technology that allows for the extension of a private or local network, to a host that might not work on that same local network.

* It is a tunnelling protocol. Uses encrypted tunnels.
* VPNs require strict authentication e.g. 2fa

## Proxy services

Proxy service
: a server that acts on behalf of a client in order to access another service. Provides: anonymity, security, content filtering, increased performance, etc

Web proxy
Proxy specifically built for web traffic. Used for increased performance by using caching. Not used commonly for this purpose today. More commonly proxies are used to prevent access to sites. 

Reverse proxy
: a server that might appear to be a single server to external clients, but actually represents many servers living behind it. A single server which hands of traffic to a number of actual web servers. Can also be used for encryption / decryption by having hardware specifically built for cryptography - the web servers are then free to just serve content.


## Introduction to Connecting to the Internet

* PPP: https://en.wikipedia.org/wiki/Point-to-Point_Protocol
* PPPoE: https://en.wikipedia.org/wiki/Point-to-point_protocol_over_Ethernet

## WAN Technology

WAN technologies are used to connect two or more LANs in different physical locations. Different technology is used to ethernet, and this technology is also often used at the core of the internet.

* Frame Relay: https://en.wikipedia.org/wiki/Frame_Relay
* High-Level Data Link Control: https://en.wikipedia.org/wiki/High-Level_Data_Link_Control
* ATM (Asynchronous Transfer Mode): https://en.wikipedia.org/wiki/Asynchronous_Transfer_Mode

## Point to Point (Site to Site) VPNs

WAN technologies are expensive and designed for transmitting large quantities of data. Since services are moving more and more into the cloud, point to point VPNs can more easily and cheaply service two offices needing to communicate securely with each other.

## Verifying Connectivity

### Ping

ICMP is usually used by a router or a remote host to trasmit back why transmission has failed to the origin of the transmission. An ICMP packet has a header with a type e.g. Destination Unreachable, Time Exceeded; code e.g. if the network or just the port is unreachable; checksum; rest of header for further information on the type and code; payload. Not usually used by humans.

However a tool called Ping and a couple of message types are useful for humans. It lets you send an Echo Request message and receive Echo Reply messages. 

### Traceroute

Traceroute
: A utility that lets you discover the path between two nodes, and gives you information about each hop along the way. 

It works via clever maniplulation of the TTL field at the IP level - first setting TTL to 1, then 2 etc. A Time Exceeded ICMP packet is sent back when a packet is discarded due to the TTL field being 0. It sends 3 identical packets.
* On *nix `traceroute` sends UDP packets to high port numbers
* On Windows `tracert` defaults to ICMP packets

### mtr (*nix) / pathping (win)

Real time traceroute - `mtr` outputs realtime, `pathping` works for 50 seconds then outputs data all at once.

### netcat (*nix) / Test-NetConnection

These tools allow testing at the transport layer rather than the network layer. 
`nc -z -v google.co.uk 80` where the -z flag simply checks for possible connection rather than allowing sending data

* netcat and how to use it: https://en.wikipedia.org/wiki/Netcat
* Test-NetConnection Microsoft documentation: https://technet.microsoft.com/itpro/powershell/windows/nettcpip/test-netconnection

## DNS

Use nslookup to get DNS information e.g. `nslookup twitter.com`. Can also be used in interactive mode. Use `server` to specify a different DNS server e.g. `server 8.8.8.8`. Use `set type=MX` to set a different DNS record type (by default is set to check for `A` records). Use `set debug` for loads of debug information.

An ISP almost always give you access to a recursive name server as part of the service it provides. Most businesses run DNS servers - this allows resolution of internal machines. Can also use DNS as a service provider.

Public DNS Server
: Name servers specifically set up so that anyone can use them, for free. Useful for troubleshooting name resolution problems - or sometimes just used for all DNS requirements.

Level 3 communications is one of the biggest ISPs - so big they only sell services to other ISPs, not consumers. Their Public DNS servers are: 4.2.2.1; 4.2.2.2; 4.2.2.3; 4.2.2.4; 4.2.2.5; 4.2.2.6 (undocumented, who knows why?)

Google similarly host Public DNS servers at: 8.8.8.8 and 8.8.4.4 (publicly documented)

DNS servers also generally respond to ping, so handy to test general network recovery

Registrar
: An organisation responsible for assigning individual domain names to other organisations or individuals.

Loopback Address
: A way of sending traffic to yourself. Traffic bypasses all network infrastructure and never leaves the node. For IPv4 the loopback address is 127.0.0.1 which is still configured on nearly every modern operating system via an entry in a Hosts File. ::1 is the loopback address for IPv6

## The Cloud

Cloud Computing
: A technological approach where computing resources are provisioned in a shareable way, so that lots of users get what they need when they need it

Virtualisation
: A single physical machine, called a host, could run many individual virtual instances, called guests. At the heart of the concept of cloud computing

Hypervisor
: A piece of software that runs and manages virtual machines, while also offering these guests a virtual operating platform that's indistinguishable from actual hardware

Public cloud
: A large cluster of machines run by another company

Private cloud
: Used by a single large corporation and gernally phyically hosted on its own premises

Hybrid cloud
: A company uses public cloud for some services and private cloud for other services

## IPv6

* 8 groups of 4 hexidecimal numbers
* Can be shorted in 2 ways to make more readable
    - leading zeros are removed - if whole set of 4 are zeros, replaced by a single 0
    - replace consecutive sections of just 0s with two colons (hence ::1 for the IPv6 loopback address)
* Reserved addresses include
    - FF00:: reserved for multicast groups
    - FE80:: reserved for link-local unicast addresses - used by IPv6 hosts to receive network configuration information (a la DHCP)
* In IPv6 addresses - first 64 bits are Network ID - second 64 bits are the Host ID
* Subnetting uses the same CIDR notation to defined a subnet mask against the Network ID portion
* The IPv6 header is much simpler that an IPv4 field: first the version field; next traffic class field (8 bits) - defines the type of traffic within the IP datagram; next flow label field (20 bits); payload length (16 bits); next header; hop limit - idential in purpose to the TTL field; source address; destination address; if anything was specified in the "next header" field, this would now follow...
* There are some ways in which IPv4 and IPv6 have been defined to work together - it is necessary for IPv4 and IPv6 traffic to co-exist at the same time so that networks can gradually be switched from one to the other
    - IPv4 mapped address space - any IPv6 address which is starts with 0:0:0:0:0:ffff e.g. 0:0:0:0:0:ffff:d1ad:35a7 is part of this space - the remaining 32 bits ARE the actual IPv4 address e.g. 192.168.1.1 in this case
    - IPv6 traffic can travel over IPv4 networks using IPv6 tunnels - basically a tunnel server on either end of a connection - encapsulates IPv6 packets into IPv4 packets which are then unencapsulated at the other end

Competing protocols to be used for these kinds of IPv6 tunnels
* 6in4: https://en.wikipedia.org/wiki/6in4
* Tunnel Setup Protocol: https://en.wikipedia.org/wiki/Tunnel_Setup_Protocol
* AYIYA: https://en.wikipedia.org/wiki/Anything_In_Anything



