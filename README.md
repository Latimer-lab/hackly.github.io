# Latimer Lab Website

This repository contains the source code for the Latimer Lab website.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Latimer-lab/Latimer-lab.github.io.git
cd Latimer-lab.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```bash
cp .env.example .env
```
Then fill in your Firebase configuration values in the `.env` file.

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

These variables are stored as GitHub repository secrets and are automatically injected during deployment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 