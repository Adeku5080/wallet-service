# Wallet Service

## Overview

The Wallet Service is a RESTful API that allows users to manage their wallet accounts. Users can create accounts and perform various wallet-related operations. This service is built with Node.js and Express, and it follows best practices for a scalable and maintainable codebase.

## Features

- **Create Account**: Users can create a new wallet account.
- **fund**: Deposit funds into a wallet account.
- **Withdraw**: Withdraw funds from a wallet account.
- **Transfer**: Transfer funds between accounts.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript.
- **Mocha & Chai**: Testing framework and assertion library.
- **Sinon**: Test spies, stubs, and mocks.
- **bcryptjs**: Library for hashing passwords.
- **SQL**: Relational database.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Adeku5080/wallet-service.git
   cd wallet-service

2. **Install depedencies**

   ```bash
   npm install

3. **Run database migrations**

    ```bash
    npm run migrate

4. **Start the server**

   ```bash
   npm run dev
   
