# Hello World Sequence Diagram

This diagram illustrates a basic interaction between a user and a system where the user sends a "Hello" message and the system responds with "World".

```mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: Send "Hello"
    System-->>User: Respond "World"
```
Seocnd diagram
```mermaid
 sequenceDiagram
    participant Developer
    participant Workflow
    participant DevOpsScan
    participant SnykScan
    participant SonarScan

    Developer->>Workflow: Start Workflow
    Workflow->>DevOpsScan: Run Scan Job
    alt Snyk Config Present
        DevOpsScan->>SnykScan: Run Snyk Scan
        SnykScan-->>DevOpsScan: Snyk Results
    else Sonar Config Present
        DevOpsScan->>SonarScan: Run Sonar Scan
        SonarScan-->>DevOpsScan: Sonar Results
    end
    DevOpsScan-->>Workflow: Return Scan Results
    Workflow-->>Developer: Workflow Complete 
```
