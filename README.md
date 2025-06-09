# Demo Document Systen

```mermaid
graph TD;
    A[Web Front End] -->|Upload Document| B[Cloud Storage];
    B -->|Document| C[OCR/Document Reader Service];
    C -->|Text| D[AI Analysis Service];
    D -->|Metadata, Tags, Summary| E[SQL Database];
    D -->|Content Reference Links| F[Graph Database];
    E -->|Metadata, Tags, Summary| A;
    F -->|Content References| A;
    A -->|Display Table: Actions, Name, Link, Tags, Subject| G[User Interface];
    G -->|NLP Questions| D;
    D -->|Answers from Documents| G;
```