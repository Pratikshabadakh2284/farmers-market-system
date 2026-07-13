## B9IS123 - Programming for Information Systems

Student Name: Pratiksha Sanjay Badakh
Student Number: 20095160
Module: B9IS123 - Programming for Information Systems  
Lecturer: Paul Laird
Submission Date: July 14, 2026

# Farmers Market Management System

## Project Overview

The Farmers Market Management System is a database-driven web
application developed to manage vendors, market stalls, and stall
allocations. The system provides a central interface for an
administrator to maintain vendor and stall records, assign available
stalls to vendors, view allocation details, generate reports, and
monitor market information from a dashboard.

## Problem Statement

Managing farmers market information manually can lead to duplicate
records, invalid data, unclear stall availability, and difficulty
tracking vendor allocations. This project provides a simple management
system that stores related information in a SQL Server database and
exposes the required operations through a Node.js and Express API.

## Stakeholders

-   **Market Administrator** - manages vendors, stalls, allocations, and
    reports.
-   **Vendors** - vendor details are stored and vendors are assigned to
    stalls.
-   **Market Management** - uses system information and reports to
    monitor market activity.

## Functional Requirements

### Vendor Management

-   Add vendors.
-   View all vendors.
-   Search vendors by name.
-   Edit vendor details.
-   Delete vendors.
-   Validate vendor name, phone number, email, and product category.
-   Prevent deletion of a vendor who is referenced by an allocation.

### Stall Management

-   Add stalls.
-   View all stalls.
-   Search stalls.
-   Edit stall details.
-   Delete stalls.
-   Validate stall details and rental fee.
-   Maintain Available and Occupied status.
-   Prevent deletion of an allocated stall.

### Allocation Management

-   Load vendors into the allocation form.
-   Display available stalls.
-   Allocate a stall to a vendor for a market date.
-   View and search allocations.
-   Delete allocations.
-   Display vendor and stall details using relational SQL joins.

### Other Features

-   Login page.
-   Dashboard.
-   Reports.
-   Shared navigation sidebar.
-   Logout confirmation.
-   User-friendly validation and error messages.

## Non-Functional Requirements

-   Simple and understandable user interface.
-   Clear validation messages.
-   Reusable code where practical.
-   Parameterised SQL queries.
-   Relational data integrity.
-   Organised project structure.
-   Automated unit and integration testing.

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  HTML5                               Page structure

  CSS3                                Styling

  JavaScript                          Frontend logic and DOM manipulation

  Node.js                             Backend runtime

  Express.js                          Server and API routing

  Microsoft SQL Server                Relational database

  mssql / msnodesqlv8                 SQL Server connectivity in the
                                      current development setup

  dotenv                              Environment configuration


  Node.js Test Runner                 Unit and integration tests

  Git and GitHub                      Version control and development
                                      history
  -----------------------------------------------------------------------

## System Architecture

Browser / Frontend
        |
        | Fetch API / HTTP
        v
Node.js + Express API
        |
        | Parameterised SQL queries
        v
Microsoft SQL Server
```

The frontend is built with HTML, CSS, and JavaScript. Express routes
process HTTP requests and communicate with SQL Server. SQL Server stores
vendors, stalls, and allocation relationships.

## Project Structure

project/
|-- css/
|   `-- style.css
|-- db/
|   `-- database.js
|-- html/
|   |-- index.html
|   |-- login.html
|   |-- vendors.html
|   |-- stalls.html
|   |-- allocations.html
|   `-- reports.html
|-- js/
|   |-- common.js
|   |-- vendors.js
|   |-- stalls.js
|   `-- allocations.js
|-- routes/
|   |-- auth.js
|   |-- vendors.js
|   |-- stalls.js
|   |-- allocations.js
|   `-- dashboard.js
|-- utils/
|   `-- validation.js
|-- test/
|   `-- automated test files
|-- server.js
|-- package.json
`-- README.md
```

## Database Design

### Vendors

-   `VendorID` - Primary Key
-   `VendorName`
-   `Phone`
-   `Email`
-   `ProductCategory`

### Stalls

-   `StallID` - Primary Key
-   `StallNumber`
-   `LocationZone`
-   `RentalFee`
-   `Status`

### Allocations

-   `AllocationID` - Primary Key
-   `VendorID` - Foreign Key referencing Vendors
-   `StallID` - Foreign Key referencing Stalls
-   `MarketDate`

### Relationships

Vendors                         Stalls
PK VendorID                     PK StallID
     |                               |
     | FK VendorID                   | FK StallID
     v                               v
              Allocations
              PK AllocationID
              FK VendorID
              FK StallID
```

IDs are used internally to identify exact records. Names are displayed
to users, but names may not be unique and therefore are not used as
primary keys.

## Allocation SQL Join

The Allocations table stores foreign keys. To display meaningful
information, the application joins Vendors and Stalls:

``` sql
SELECT
    A.AllocationID,
    V.VendorName,
    S.StallNumber,
    S.LocationZone,
    A.MarketDate
FROM Allocations A
INNER JOIN Vendors V
    ON A.VendorID = V.VendorID
INNER JOIN Stalls S
    ON A.StallID = S.StallID
ORDER BY A.AllocationID DESC;
```

This returns vendor names and stall details while maintaining a normal
relational database structure.

## Main API Routes

### Vendors

GET    /api/vendors/getAllVendors
GET    /api/vendors/getVendor/:id
GET    /api/vendors/searchVendor/:name
POST   /api/vendors/addVendor
PUT    /api/vendors/updateVendor/:id
DELETE /api/vendors/deleteVendor/:id
```

### Stalls

GET    /api/stalls/getAllStalls
GET    /api/stalls/getStall/:id
GET    /api/stalls/searchStall/:stall
POST   /api/stalls/addStall
PUT    /api/stalls/updateStall/:id
DELETE /api/stalls/deleteStall/:id
```

### Allocations

GET    /api/allocations/vendors
GET    /api/allocations/availableStalls
GET    /api/allocations/getAllAllocations
POST   /api/allocations/addAllocation
DELETE /api/allocations/deleteAllocation/:id
```

## Validation

### Vendor Validation

-   Vendor name is required.
-   Phone number must contain exactly 10 digits.
-   Email must have a valid format.
-   Product category is required.

### Stall Validation

-   Stall number is required.
-   Rental fee must be numeric and within the configured limit.
-   Location and status use predefined options.

### Business Rules

-   An allocated stall cannot be deleted.
-   A vendor referenced by an allocation cannot be deleted.
-   SQL Server foreign keys provide database-level referential
    integrity.

## Error Handling

Asynchronous route operations use `try...catch`. API errors are logged
on the server and user-friendly messages are returned to the frontend.

The application also checks business rules before deletion. For example,
the vendor delete route checks the Allocations table before deleting a
vendor. This avoids showing a raw SQL Server foreign key error to the
user.

## DRY and Code Readability

The project was refactored to reduce repeated code.

-   Repeated sidebar markup was replaced with shared sidebar logic.
-   Shared table-message rendering was introduced for empty result
    tables.
-   Validation logic was extracted into `utils/validation.js` for
    testability.
-   Common logic was reused where practical.

These changes follow the DRY principle: **Don't Repeat Yourself**.

## Testing

### Unit Tests

Unit tests verify validation logic independently from the database and
UI. Vendor and stall validation scenarios are tested with the built-in
Node.js Test Runner.

### Integration Tests

Integration tests verify vendor CRUD API behaviour through the Express
application. The Express `app` is exported from `server.js` so tests can
access the application without always starting the normal server
listener.

Run all automated tests with:

``` bash
npm test
```

## Installation and Setup

### Prerequisites

-   Node.js
-   npm
-   Microsoft SQL Server
-   ODBC Driver 17 for SQL Server
-   Git

### Clone and Install

``` bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Environment Variables

Create a `.env` file in the project root.

For the current Windows-authenticated development configuration:

``` env
DB_SERVER=YOUR_SQL_SERVER
DB_DATABASE=FarmersMarketDB
```

Do not commit `.env`.

### Run the Project

``` bash
npm run dev
```

If required:

``` bash
node server.js
```

Open:

http://localhost:3000
```

### Run Tests

``` bash
npm test
```

## Commit Reference Traceability

A reference in this table identifies documentation or learning material
used to understand a technical concept.

  -----------------------------------------------------------------------
  Commit                  Work                    Reference / Basis
  ----------------------- ----------------------- -----------------------
  `35ac810`               Initial project setup   npm documentation -
                                                  Creating a package.json
                                                  file

  `2062570`               Vendor endpoints and    Express Routing Guide;
                          database connection     node-mssql
                                                  documentation

  `086c724`               API endpoints           Express Routing Guide

  `e025e26`               Vendor HTML changes     MDN Web Docs - HTML
                                                  forms

  `f4c5d9c`               Endpoint naming changes Self - API naming
                                                  cleanup

  `0be4ce6`               Management tabs         Self - UI organisation
                                                  from project
                                                  requirements

  `920ca2f`               Login page changes      MDN Web Docs - Using
                                                  the Fetch API; HTML
                                                  forms

  `b7a9635`               Report functionality    MDN Web Docs - Blob;
                          and CRUD fixes          Express Routing Guide;
                                                  self-debugging

  `6cb094d`               User input validations  MDN Web Docs -
                                                  Client-side form
                                                  validation

  `cf0a4e4`               Reusable validation     Self - extraction of
                          utility                 existing validation
                                                  rules

  `f1e5b9b`               Vendor and stall        Node.js Test Runner
                          validation tests        documentation

  `a05ef05`               Export Express app for  Node.js CommonJS
                          integration tests       Modules documentation

  `a82f6d5`               Missing vendor GET      Express Routing Guide
                          route handling          

  `1cb9946`               Vendor CRUD integration Node.js Test Runner
                          tests                   documentation

  `7bda734`               Project overview and    Self - project
                          problem statement       requirements

  `280c66b`               Stakeholders and        Self - requirements
                          requirements            analysis

  `92251c7`               Technology stack and    Self - implemented
                          architecture            project architecture

  `a36dd9f`               Testing strategy        Node.js Test Runner
                          documentation           documentation; self

  `442d387`               Installation and        npm documentation;
                          testing instructions    self - repository setup

  `acc9e4b`               Reusable shared sidebar MDN Web Docs - Using
                                                  the Fetch API; self -
                                                  DRY refactoring

  `7a01a66`               Logout confirmation     MDN Web Docs -
                                                  Window.confirm()

  `7e46d1c`               DRY code refactoring    Self - removal of
                                                  duplicated code
  -----------------------------------------------------------------------

## References

1.  Express.js, **Routing Guide** -
    https://expressjs.com/en/guide/routing.html
2.  Node.js, **Test Runner** - https://nodejs.org/api/test.html
3.  Node.js, **CommonJS Modules** - https://nodejs.org/api/modules.html
4.  MDN Web Docs, **Using the Fetch API** -
    https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
5.  MDN Web Docs, **Client-side Form Validation** -
    https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
6.  MDN Web Docs, **HTML Forms** -
    https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms
7.  MDN Web Docs, **Window.confirm()** -
    https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
8.  MDN Web Docs, **Blob** -
    https://developer.mozilla.org/en-US/docs/Web/API/Blob
9.  node-mssql, **Documentation** -
    https://github.com/tediousjs/node-mssql
10. npm, **Creating a package.json file** -
    https://docs.npmjs.com/creating-a-package-json-file

## Known Limitations

-   The current database connection is intended for the local Windows
    SQL Server development environment.
-   Cloud deployment requires a remotely accessible SQL Server database.
-   Authentication is basic and could be strengthened for real time use.
-   Additional API integration tests can be added for stalls and
    allocations.
-   Additional server-side validation can be added.

## Future Improvements

-   Role-based authentication.
-   Stronger password security.
-   Cloud database deployment.
-   Pagination.
-   Additional report filters.
-   Stall and allocation API integration tests.
-   GitHub Actions for automated test execution.
-   Accessibility and responsive UI improvements.

## Conclusion

The Farmers Market Management System demonstrates CRUD operations,
REST-style Express routes, SQL Server relationships, parameterised
queries, validation, business rules, error handling, reusable code, unit
testing, integration testing, and incremental Git-based development.

The application provides a practical solution for managing vendors,
stalls, and market allocations while keeping the project structure and
implementation understandable and maintainable.