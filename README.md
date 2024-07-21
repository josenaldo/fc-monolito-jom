# Full Cycle - Monólito - Project

This project is a comprehensive backend system designed to manage clients, products, invoices, and checkout processes. It is built using Typescript, Node.js, Express and Sequelize, with a structured approach to organizing code into modules for better maintainability and scalability.

## Project Structure

The project is organized into several key directories:

- `.vscode/`: Contains settings for Visual Studio Code.
- `requests/`: Contains HTTP request files for testing endpoints.
- `src/`: The source code of the application.
  - `infrastructure/`: Infrastructure-related code including API routes and server configuration.
  - `migrations/`: Database migration files.
  - `modules/`: Business logic separated by domain areas such as client administration, invoice management, and product administration.
- `jest.config.ts`: Configuration file for Jest testing framework.
- `package.json`: Defines npm behaviors and scripts, as well as project dependencies.

## How to Use

To get started with this project, follow these steps:

### Install dependencies

```sh
npm install
```

or using Yarn:

```sh
yarn install
```

### Run the application

```sh
npm dev
```

or using Yarn:

```sh
yarn dev
```

This will start the application on `<http://localhost:4000>`.

## Testing

Testing can also be performed in two ways: using the built-in test runner or using the HTTP request files located in the requests/ directory. These files are designed to be used with Visual Studio Code's REST Client plugin but can be adapted for use with other tools like Postman or curl.

### Testing Endpoints

- Clients: To test client-related operations, use the files in requests/clients.http.
  - To retrieve a client by ID: GET <http://localhost:4000/clients/{clientId}>
  - To add a new client: POST <http://localhost:4000/clients> with JSON body.
- Products: For product operations, refer to requests/products.http.
  - To fetch a product by ID: GET <http://localhost:4000/products/{productId}>
  - To create a new product: POST <http://localhost:4000/products> with JSON body.
- Invoices: Use requests/invoices.http for testing invoice retrieval.
  - To get an invoice by ID: GET <http://localhost:4000/invoices/{invoiceId}>
- Checkout: To test the checkout process, see requests/checkout.http.
  - To create a new order: POST <http://localhost:4000/checkout> with JSON body containing client ID and items.
  - To get an order by ID: GET <http://localhost:4000/checkout/{orderId}>

### Run tests

To test using the built-in test runner, run:

```sh
npm test
```

or using Yarn:

```sh
yarn test
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to discuss proposed changes or enhancements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
