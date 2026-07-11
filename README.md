# Farmers Market Stall Management Information System

## Project Overview

The Farmers Market Stall Management Information System is a web-based application designed to support the management of vendors, market stalls and stall allocations.

The system provides a centralised interface for managing vendor information, stall availability and market-date allocations.

## Problem Statement

Managing farmers market stalls manually can lead to duplicate allocations, inaccurate stall availability information and difficulty maintaining vendor records.

The purpose of this system is to provide a structured digital solution for managing vendors, stalls and allocations using a central SQL Server database.

## Stakeholders

- Market Administrator

## Functional Requirements

- Manage vendor records using CRUD operations.
- Manage market stall records.
- Search vendors and stalls.
- Allocate available stalls to vendors.
- Prevent invalid stall allocations.
- Update stall availability during allocation.
- Display dashboard information.
- Generate report data.

## Non-Functional Requirements

- The system should provide a simple and responsive interface.
- User input should be validated.
- SQL queries should use parameterised inputs.
- The application should provide clear success and error messages.
- The system should maintain consistent data between stalls and allocations.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- Microsoft SQL Server
- mssql/msnodesqlv8

## System Architecture

The application uses a client-server architecture.

1. The frontend is developed using HTML, CSS and JavaScript.
2. JavaScript uses the Fetch API to send HTTP requests.
3. Express.js provides REST API endpoints.
4. API routes execute parameterised SQL queries.
5. Microsoft SQL Server stores application data.
6. JSON responses are returned to the frontend.
7. JavaScript dynamically updates the user interface.

Frontend → Fetch API → Express Routes → SQL Server

## Testing

The project includes automated unit and integration testing.

### Unit Testing

Unit tests are used to test vendor and stall validation logic independently.

The tests verify:

- Vendor name validation
- Ten-digit phone number validation
- Email validation
- Product category validation
- Stall number validation
- Rental fee limits
- Location zone validation
- Stall status validation

The built-in Node.js test runner is used to execute the tests.

### Integration Testing

Vendor CRUD API integration tests verify communication between the HTTP API, Express routes and SQL Server database.

The integration tests cover:

- Creating a vendor
- Retrieving the created vendor
- Updating the vendor
- Deleting the test vendor

Test data is removed after successful execution.