# Acme SDK quickstart

<!-- Fictional candidate docs for the review mock-up. The wrong package name is intentional. -->

Install the SDK:

```sh
npm install acme
```

Create a client:

```ts
import { Acme } from "@acme/sdk";

const client = new Acme({ apiKey: process.env.ACME_API_KEY });
```
