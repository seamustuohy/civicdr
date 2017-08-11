export const languages = [
  'Farsi',
  'English',
  'Arabic',
  'Azerbaijani',
  'Bengali',
  'Dutch',
  'French',
  'German',
  'Hindi',
  'Italian',
  'Japanese',
  'Javanese',
  'Kurdish',
  'Malay',
  'Mandarin Chinese',
  'Portuguese',
  'Punjabi',
  'Russian',
  'Spanish',
  'Swahili',
  'Tamil',
  'Telugu',
  'Urdu',
  'Other'
];

export const serviceTypes = [
  {name: `Alerts and Warnings`, description: `This service involves disseminating information that describes an intruder attack, security vulnerability, intrusion alert, computer virus, or hoax, and providing any short-term recommended course of action for dealing with the resulting problem.`},
  {name: `Incident Analysis`, description: `The service provider conducts examination of all available information and supporting evidence or artifacts related to an incident or event.`},
  {name: `Incident Response Support`, description: `The service provider assists and guides the victim(s) of the attack in recovering from an incident via phone, email, fax, or documentation.`},
  {name: `Incident Response Coordination`, description: `The service provider coordinates the response effort among parties involved in the incident.`},
  {name: `Incident Response On Site`, description: `The service provider provides direct, on-site assistance to help constituents recover from an incident.`},
  {name: `Vulnerability Analysis`, description: `The service provider performs technical analysis and examination of vulnerabilities in hardware or software.`},
  {name: `Vulnerability Response`, description: `The service provider determines the appropriate response to mitigate or repair a vulnerability.`},
  {name: `Vulnerability Response Coordination`, description: `The service provider notifies the various parts of the enterprise or constituency about the vulnerability and shares information about how to fix or mitigate the vulnerability.`},
  {name: `Announcements`, description: `The service provider informs constitutants about new development with medium to long-term impact through intrusion alerts, vulnerability warnings, and security advisories.`},
  {name: `Technology Watch`, description: `The service provider monitors and observes new technical developments, intruder activities, and related trends to help identify future threats.`},
  {name: `Infrastructure Review`, description: `The service provider provides manual review of the hardware and software configurations, routers, firewalls, servers, and desktop devices to ensure that they match the organizational or industry best practice security policies and standard configurations.`},
  {name: `Best-Practice Review`, description: `The service provider will interview employees and system and network administrators to determine if their security practices match the defined organizational security policy or some specific industry standards.`},
  {name: `Scanning`, description: `The service provider will use vulnerability or virus scanners to determine which systems and networks are vulnerable.`},
  {name: `Penetration Testing`, description: `The service provider will test the security of a site by purposefully attacking its systems and networks.`},
  {name: `Configuration and Maintenance of Security`, description: `The service provider will identfy or provide appropriate guidance on how to securely configure and maintain tools, applications, and the general computing infrastructure.`},
  {name: `Development of Security Tools`, description: `The service provider will develop new, constituent-specific tools that are required or desired by the constituency.`},
  {name: `Intrusion Detection Services`, description: `The service provider will review existing IDS logs, analyze and initiate a response for any events that meet their defined threshold, or forward any alerts according to a pre-defined service level agreement or escalation strategy.`},
  {name: `Security-Related Information Dissemination`, description: `The service provider will provide constituents with a comprehensive and easy-to-find collection of useful information that aids in improving security.`},
  {name: `Secure Hosting`, description: `The service provider will detect and mitigate attacks attempting to exploit application and server vulnerabilities.`},
  {name: `DOS-Protection Services`, description: `The service provider acts as a proxy for their constituents web services and will detect and mitigate traffic spikes, hit-and-run DOS events, and large botnets through site caching, appliction firewalls, rate limiting and other traffic filtering.`},
  {name: `Artifact Analysis`, description: `The service provider will perform technical examination and analysis of any artifact found on a system.`},
  {name: `Artifact Response`, description: `The service provider will determine the appropriate actions to detect and removeartifacts from a system, as well as actions to prevent artifacts from beinginstalled.`},
  {name: `Artifact Response Coordination`, description: `The service provider will coordinate sharing and synthesizing analysis results and response strategies pertaining to an artifact with other researchers, CSIRTs, vendors, and other security experts.`},
  {name: `Risk Analysis`, description: `The service provider will conduct or assist with information security risk analysis activities for new systems and business processes or evaluate threats and attacks against constituent assets and systems.`},
  {name: `Business Continuity and Disaster Recovery`, description: `The service provider will engage in business continuity and disaster recovery planning for events related to computer security threats and attacks.`},
  {name: `Security Consulting`, description: `The service provider will work with their consituants in preparing recommendations or identifying requirements for purchasing, installing, or securing new systems, network devices, software applications, or enterprise-wide business processes.`},
  {name: `Awareness-Building`, description: `The service provider will provide information and guidance to better conform to accepted security practices and organizational security policies.`},
  {name: `Education/Training`, description: `The service provider will provide information to constituents about computer security issues through seminars, workshops, courses, and tutorials.`},
  {name: `Product Evaluation or Certification`, description: `The service provider will conduct product evaluations on tools, applications, or other services to ensure the security of the products and their conformance to acceptable CSIRT or organizational security practices.`}
];

export const ticketStatusLUT = {
  'unassigned': 'Unassigned',
  'assigned': 'Assigned',
  'in-progress': 'In Progress',
  'resolved': 'Resolved',
  'reviewed': 'Reviewed'
};

export const incidentTypes = [
  {name: 'Account Compromise', description: 'The client has lost access to, suspects or has confirmed malicious activity might be taking place through their account.'},
  {name: 'Denial-of-Service', description: 'The case relates to webiste or server unavailability due to massive requests for services.'},
  {name: 'Destruction/Loss', description: 'The case relates to the loss of destruction of devices, storage media, and/or documents.'},
  {name: 'Disruption of Communications Applications and Platforms', description: 'This case relates to the malfunction or disruption of the clients existing communications applications or platforms. If this case includes wider-scale censorship or outages please also include "Internet/Network Outage."'},
  {name: 'Information Leak', description: 'The case relates to the recovery of leaked, accessed, or posted data, reported by the client.'},
  {name: 'Internet/Network Outage', description: 'Disruption of internet or communication networks'},
  {name: 'Intrusion Attempt', description: 'This case involves an unauthorised attempt to access the clients network or servers. If this case includes possible successful intrusion please also include "Website/Server Compromise."'},
  {name: 'Known Vulnerability', description: 'The case relates to a discovered system weakness, or an attacker who can exploit, or has access to, a system flaw.'},
  {name: 'Malfunction/Failure of Devices or Systems', description: 'This case involves the failure/malfunction of the clients IT supporting infrastructure.'},
  {name: 'Malicious Website', description: 'Client has discovered a malicious domain impersonating a website owned by the client, or one which a client often uses.'},
  {name: 'Malware', description: 'The case relates to attempted malware infection on a client device.'},
  {name: 'Social Engineering', description: 'This case relates to phishing, spam or spoofing. If the suspicious email includes possible malware or links to a site where malware might be downloaded, please also use the "Malware" category.'},
  {name: 'Targeted Censorship', description: `The case relates to the censorship of the client's web presence, whether this is by technical means, takedown notice, seizure of the web content, etc.`},
  {name: 'Theft/Confiscation', description: 'The case related to the theft or confiscation of devices, storage media, and/or documents. If this case includes possible compromise of critical data on devices please also include "Information Leak."'},
  {name: 'User-Device Compromise', description: 'The case relates to a possible compromise on the clients device. This includes both laptops, desktops, and phones.'},
  {name: 'Website/Server Compromise', description: 'The case relates to the possible compromise of the clients websites, servers, or network devices.'}
];

export const startTime = [
  'within hours',
  'within days',
  'within a week',
  'within weeks',
  'not accepting new cases'
];

export const perWeekAvailability = [
  'less than an hour a week',
  '2-4 hours a week',
  '5-10 hours a week',
  '10-20 hours a week',
  'more than 20 hours a week'
];

export const secureChannels = [
  'PGP',
  'Signal',
  'Off-the-Record Messaging (OTR)',
  'Other'
];

export const notificationPrefs = [
  {name: 'Guidance', description: 'Best-Practices and Forecasting/Preparatory Guidance (e.g. Elections Coming up)'},
  {name: 'Alerts', description: 'Community wide notifications about threat actor behavior.'},
  {name: 'Incident Notifications', description: 'Notifications about recent or ongoing incidents which include remediation guidance.'}
];

export const notificationLang = [
  'English',
  'Farsi'
];

export const typesOfWork = [
  {name: 'Anti-Corruption and Transparency', description: 'The organization campaigns, or takes other actions against corruption and transparency.'},
  {name: 'Anti-War/Anti-Violence', description: 'The organization campaigns, or takes other actions against war.'},
  {name: 'Culture', description: 'The organization campaigns or acts to promote cultural events.'},
  {name: 'Economic Change', description: 'Issues of economic policy, wealth distribution, etc.'},
  {name: 'Education', description: 'The organization is concerned with some form of education.'},
  {name: 'Election Monitoring', description: 'The organization is an election monitor, or involved in election monitoring.'},
  {name: 'Environment', description: 'The organization campaigns or acts to protect the environment.'},
  {name: 'Freedom of Expression', description: 'The organization is concerned with freedom of speech issues.'},
  {name: 'Freedom Tool Development', description: 'The organization develops tools for use in defending or extending digital rights.'},
  {name: 'Funding', description: 'The organization is a funder of organizations or projects working with at risk users.'},
  {name: 'Health Issues', description: 'The organization prevents epidemic illness or acts on curing them.'},
  {name: 'Human Rights Issues', description: 'relating to the detection, recording, exposure, or challenging of abuses of human rights.'},
  {name: 'Internet and Telecoms', description: 'Issues of digital rights in electronic communications.'},
  {name: 'LGBT/Gender/Sexuality', description: 'Issues relating to the Lesbian, Gay, Bi, Transgender community.'},
  {name: 'Policy', description: 'The organization is a policy think-tank, or policy advocate.'},
  {name: 'Politics', description: 'The organization takes a strong political view or is a political entity.'},
  {name: 'Privacy', description: "Issues relating to the individual's reasonable right to privacy."},
  {name: 'Rapid Response', description: 'The organization provides rapid response type capability for civil society.'},
  {name: 'Refugees', description: 'Issues relating to displaced people.'},
  {name: 'Security', description: 'Issues relating to physical or information security.'},
  {name: "Women's Rights", description: 'Issues pertaining to inequality between men and women, or issues of particular relevance to women.'},
  {name: 'Youth Rights', description: 'Issues of particular relevance to youth.'}
];
