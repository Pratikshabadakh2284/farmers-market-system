## B9IS123 - Programming for Information Systems

Student Name: Pratiksha Sanjay Badakh
Student Number: 20095160
Module: B9IS123 - Programming for Information Systems  
Lecturer: Paul Laird
Submission Date: July 14, 2026

# Farmers Market Management System

## Live Application

**Live Application:**\
https://farmers-market-system-production.up.railway.app/html/login.html

The Farmers Market Management System is deployed on Railway. The final
application uses Node.js, Express, SQLite, `better-sqlite3`, and Railway
persistent volume storage.

------------------------------------------------------------------------

## Project Overview

The Farmers Market Management System is a database-driven web
application developed to manage vendors, market stalls, and stall
allocations.

The system provides a central interface for a market administrator to
maintain vendor and stall records, assign available stalls to vendors,
view allocation information, generate reports, and monitor market
activity through a dashboard.

The project is a proof-of-concept information system demonstrating CRUD
operations, API-based frontend and backend communication, validation,
relational data management, automated testing, and cloud deployment.

## Problem Statement

Managing farmers market information manually can result in duplicate
records, invalid information, unclear stall availability, and difficulty
tracking vendor allocations.

This system provides a simple web interface where vendor, stall, and
allocation data can be managed. The frontend communicates with a Node.js
and Express backend through API calls. The backend applies business
rules and stores data in a SQLite relational database.

## Selected Organisation

The selected organisation is a small farmers market. A farmers market
was selected because administrators regularly manage vendor information,
product categories, stalls, rental fees, stall availability,
allocations, and market dates.

These requirements provide a suitable scenario for demonstrating CRUD
operations and relational database relationships.

## Stakeholders

-   **Market Administrator** - manages vendors, stalls, allocations,
    reports, and market information.
-   **Vendors** - vendor details are stored and vendors can be assigned
    to available stalls.
-   **Market Management** - uses dashboard information and reports to
    monitor market activity.

## Functional Requirements

### Vendor Management

-   Add vendors.
-   View all vendors.
-   Search vendors by name.
-   Edit vendor information.
-   Delete vendors.
-   Validate vendor name, phone number, email, and product category.
-   Prevent deletion of vendors referenced by an allocation.

### Stall Management

-   Add market stalls.
-   View all stalls.
-   Search stalls.
-   Edit stall information.
-   Delete stalls.
-   Validate stall details and rental fees.
-   Maintain Available and Occupied stall status.
-   Prevent deletion of allocated stalls.

### Allocation Management

-   Load vendors into the allocation form.
-   Display available stalls.
-   Show an empty-state message when records are unavailable.
-   Allocate an available stall to a vendor.
-   Store the market date.
-   View and search allocations.
-   Delete allocations.
-   Automatically update stall availability.
-   Display vendor and stall information using relational joins.

### Other Features

-   Login page.
-   Dashboard.
-   Reports.
-   Shared navigation sidebar.
-   Logout confirmation.
-   User-friendly validation and API error messages.
-   Empty table and dropdown messages.

## Non-Functional Requirements

-   Simple and understandable user interface.
-   Clear validation messages.
-   Reusable code where practical.
-   Parameterised database queries.
-   Relational data integrity.
-   Organised project structure.
-   Automated unit and integration testing.
-   Public GitHub development history.
-   Cloud-accessible live application.

## Technology Stack

  Technology            Purpose
  --------------------- -----------------------------------------
  HTML5                 Page structure
  CSS3                  Styling
  JavaScript            Frontend logic and DOM manipulation
  Fetch API             Frontend API communication
  Node.js               Backend JavaScript runtime
  Express.js            Server and API routing
  SQLite                Relational data storage
  better-sqlite3        SQLite integration with Node.js
  dotenv                Environment configuration
  Node.js Test Runner   Unit and integration testing
  Git and GitHub        Version control and development history
  Railway               Cloud application deployment
  Railway Volume        Persistent SQLite storage

## System Architecture

``` text
User Browser
     |
     | HTTPS
     v
HTML + CSS + JavaScript Frontend
     |
     | Fetch API
     v
Node.js + Express API
     |
     | Parameterised SQLite Queries
     v
SQLite Relational Database
     |
     v
Railway Persistent Volume
```

The frontend does not directly access the database. JavaScript uses the
Fetch API to communicate with Express API routes. Express processes HTTP
requests, applies business rules, and performs SQLite database
operations.

## Project Structure

``` text
farmers-market-system/
|-- css/
|   `-- style.css
|-- db/
|   |-- database.js
|   `-- initDatabase.js
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
|-- tests/
|   |-- validation test files
|   `-- vendorIntegration.test.js
|-- .gitignore
|-- server.js
|-- package.json
|-- package-lock.json
`-- README.md
```

## Database Design

The final application uses SQLite. The required tables are automatically
initialised when the application starts.

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

### Users

-   `UserID` - Primary Key
-   `Username`
-   `Password`
-   `Role`
-   `VendorID`

### Relationships

``` text
Vendors                         Stalls
PK VendorID                     PK StallID
     |                               |
     | FK VendorID                   | FK StallID
     +------------+   +--------------+
                  |   |
                  v   v
              Allocations
              PK AllocationID
              FK VendorID
              FK StallID
              MarketDate
```

IDs identify exact records internally. Names are displayed to users but
are not used as primary keys because names may not be unique.

SQLite foreign key enforcement is enabled with:

``` javascript
db.pragma("foreign_keys = ON");
```

## Allocation Database Join

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

The join maintains relational IDs while displaying meaningful vendor and
stall information.

## Main API Routes

### Vendors

``` text
GET    /api/vendors/getAllVendors
GET    /api/vendors/getVendor/:id
GET    /api/vendors/searchVendor/:name
POST   /api/vendors/addVendor
PUT    /api/vendors/updateVendor/:id
DELETE /api/vendors/deleteVendor/:id
```

### Stalls

``` text
GET    /api/stalls/getAllStalls
GET    /api/stalls/getStall/:id
GET    /api/stalls/searchStall/:stall
POST   /api/stalls/addStall
PUT    /api/stalls/updateStall/:id
DELETE /api/stalls/deleteStall/:id
```

### Allocations

``` text
GET    /api/allocations/vendors
GET    /api/allocations/availableStalls
GET    /api/allocations/getAllAllocations
GET    /api/allocations/searchAllocation/:text
POST   /api/allocations/addAllocation
DELETE /api/allocations/deleteAllocation/:id
```

### Authentication

``` text
POST   /api/auth/login
```

### Dashboard

``` text
GET    /api/dashboard
```

## CRUD Operations

  CRUD Operation   HTTP Method   Example
  ---------------- ------------- -------------------------------------
  Create           POST          Add vendor, stall, or allocation
  Read             GET           View and search records
  Update           PUT           Edit vendor or stall
  Delete           DELETE        Delete vendor, stall, or allocation

The frontend performs these operations using API requests rather than
post-and-refresh form submission.

## Validation

### Vendor Validation

-   Vendor name is required.
-   Phone number must contain exactly 10 digits.
-   Email must have a valid format.
-   Product category is required.

### Stall Validation

-   Stall number is required.
-   Rental fee must be numeric and within configured limits.
-   Location and status use predefined values.

### Allocation Validation

-   A vendor must be selected.
-   A stall must be selected.
-   A market date is required.
-   Only available stalls are displayed.
-   A vendor cannot receive multiple allocations for the same market
    date.

## Business Rules and Data Integrity

-   A vendor with an allocation cannot be deleted.
-   An allocated stall cannot be deleted.
-   Allocating a stall changes its status to `Occupied`.
-   Deleting an allocation changes the stall status to `Available`.
-   SQLite foreign keys support relational integrity.
-   Allocation creation uses a transaction so the allocation insert and
    stall-status update are treated as one logical operation.

## Error Handling

API routes use `try...catch` blocks. Errors are logged on the server for
debugging and user-friendly messages are returned to the frontend.

Example:

``` json
{
    "message": "Unable to load vendors."
}
```

Business rule checks are performed before deletion and allocation
operations to avoid exposing raw database errors.

## DRY and Code Readability

-   Repeated sidebar markup was replaced with shared sidebar logic.
-   Shared table-message rendering was introduced for empty result
    tables.
-   Validation rules were extracted into `utils/validation.js`.
-   Allocation dropdowns show messages when no records are available.
-   Common logic is reused where practical.

These changes follow the DRY principle: **Don't Repeat Yourself**.

## Testing

### Unit Tests

Unit tests verify vendor and stall validation logic independently from
the database and user interface. The built-in Node.js Test Runner is
used.

### Integration Tests

Vendor CRUD integration tests verify interaction between the Express API
and SQLite database.

The integration test covers:

1.  Creating a vendor through POST.
2.  Retrieving the created vendor through GET.
3.  Updating the vendor through PUT.
4.  Deleting the test vendor through DELETE.

The Express `app` is exported from `server.js` so tests can access the
application without always starting the normal server listener.

Run all tests with:

``` bash
npm test
```

All current automated tests pass with the final SQLite implementation.

## Installation and Local Setup

### Prerequisites

-   Node.js
-   npm
-   Git

A separate database server is not required.

### Clone and Install

``` bash
git clone <repository-url>
cd farmers-market-system
npm install
```

### Run the Project

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

Production start command:

``` bash
npm start
```

### Run Tests

``` bash
npm test
```

## SQLite Database Initialisation

The application automatically creates the required SQLite tables when
the server starts.

Database initialisation logic is located in:

``` text
db/initDatabase.js
```

Local database files are excluded from Git using:

``` text
*.db
```

## Cloud Deployment

The application is deployed using Railway.

### Deployment Process

1.  Source code is stored in GitHub.
2.  Railway is connected to the GitHub repository.
3.  Railway installs Node.js dependencies.
4.  Railway starts the application using `npm start`.
5.  Express listens on the port provided by the deployment environment.
6.  SQLite data is stored using a persistent Railway volume.
7.  Railway provides a public HTTPS domain.

The server supports local and cloud environments with:

``` javascript
const PORT = process.env.PORT || 3000;
```

### Persistent Database Storage

The SQLite database path is configured through `DB_PATH`. The deployed
database file is stored on Railway persistent volume storage.

## Git Development Process

The project was developed incrementally using Git and GitHub. The
repository history shows project setup, API development, frontend
development, validation, testing, documentation, DRY refactoring, SQLite
integration, Railway deployment preparation, and deployment
troubleshooting.

## Commit Reference Traceability

  -----------------------------------------------------------------------
  Commit                  Work                    Reference / Basis
  ----------------------- ----------------------- -----------------------
  `4e994f4`               Initial repository      Self
                          commit                  

  `47a63f2`               Initial project setup   Self

  `35ac810`               Initial project setup   npm documentation -
                                                  package setup

  `2062570`               Initial vendor          Express Routing Guide;
                          endpoints and database  database connectivity
                          connectivity            learning and
                                                  self-implementation

  `086c724`               Additional API          Express Routing Guide
                          endpoints               

  `e025e26`               Vendor HTML changes     MDN Web Docs - HTML
                                                  Forms

  `f4c5d9c`               Endpoint naming changes Self - API naming
                                                  cleanup

  `0be4ce6`               Management tabs         Self - UI organisation

  `920ca2f`               Login page changes      MDN Fetch API and HTML
                                                  Forms

  `b7a9635`               Report functionality    MDN Blob; Express
                          and CRUD fixes          Routing Guide;
                                                  self-debugging

  `6cb094d`               Input validation        MDN Client-side Form
                                                  Validation

  `cf0a4e4`               Reusable validation     Self - extraction of
                          utility                 validation rules

  `f1e5b9b`               Automated validation    Node.js Test Runner
                          tests                   documentation

  `a05ef05`               Export Express app for  Node.js CommonJS
                          integration testing     Modules

  `a82f6d5`               Handle missing vendor   Express Routing Guide
                          GET record              

  `1cb9946`               Vendor CRUD integration Node.js Test Runner
                          tests                   documentation

  `7bda734`               Project overview and    Self - project
                          problem statement       requirements analysis

  `280c66b`               Stakeholders and        Self - requirements
                          requirements            analysis

  `92251c7`               Technology stack and    Self - implemented
                          architecture            architecture

  `a36dd9f`               Testing strategy        Node.js Test Runner
                                                  documentation and
                                                  self-analysis

  `442d387`               Installation and test   npm documentation and
                          instructions            repository setup

  `acc9e4b`               Reusable shared sidebar MDN Fetch API; self -
                                                  DRY refactoring

  `7a01a66`               Logout confirmation     MDN Window.confirm()

  `7e46d1c`               DRY code refactoring    Self - removal of
                                                  duplicated code

  `970c627`               README documentation    Self - project
                                                  documentation

  `0e6efb3`               Install SQLite package  Self - dependency
                          and remove unused       cleanup
                          database packages       

  `d5b77e1`               Refactor application    better-sqlite3 API;
                          data storage to SQLite  SQLite documentation;
                                                  GenAI-assisted guidance
                                                  reviewed and tested by
                                                  the student

  `bcf481d`               Prepare SQLite          Railway deployment and
                          application for Railway volume documentation;
                          deployment              GenAI-assisted guidance
                                                  reviewed by the student

  `73219e5`               Exclude local           npm dependency
                          dependencies from       practices; deployment
                          deployment              debugging;
                                                  GenAI-assisted
                                                  troubleshooting
                                                  reviewed by the student

  `b921d24`               Add `.gitignore` file   Git documentation;
                                                  deployment cleanup
  -----------------------------------------------------------------------

## Attribution and Assistance Summary

The application was developed incrementally by the student using Git and
GitHub.

External documentation was used to understand JavaScript, Express
routing, Fetch API communication, Node.js testing, SQLite integration,
and Railway deployment.

Generative AI assistance was used as a development support tool for:

-   Brainstorming project improvements.
-   Explaining API and database concepts.
-   Explaining primary and foreign keys.
-   Suggesting testing approaches.
-   Explaining API error handling.
-   Supporting SQLite database integration and data-layer refactoring.
-   Supporting Railway deployment configuration.
-   Troubleshooting the native `better-sqlite3` deployment issue.
-   Supporting README structure and documentation review.

AI-assisted suggestions were reviewed, integrated, modified, manually
tested, and evaluated against the project requirements by the student.

The student remains responsible for understanding the implemented system
and evaluating integrated resources and assistance.

## References

1.  Express.js, **Routing Guide**\
    https://expressjs.com/en/guide/routing.html
2.  Node.js, **Test Runner**\
    https://nodejs.org/api/test.html
3.  Node.js, **CommonJS Modules**\
    https://nodejs.org/api/modules.html
4.  MDN Web Docs, **Using the Fetch API**\
    https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
5.  MDN Web Docs, **Client-side Form Validation**\
    https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
6.  MDN Web Docs, **HTML Forms**\
    https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms
7.  MDN Web Docs, **Window.confirm()**\
    https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
8.  MDN Web Docs, **Blob**\
    https://developer.mozilla.org/en-US/docs/Web/API/Blob
9.  npm, **Creating a package.json File**\
    https://docs.npmjs.com/creating-a-package-json-file
10. SQLite, **Documentation**\
    https://sqlite.org/docs.html
11. SQLite, **Foreign Key Support**\
    https://sqlite.org/foreignkeys.html
12. better-sqlite3, **API Documentation**\
    https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
13. Railway, **Volumes Documentation**\
    https://docs.railway.com/volumes
14. Railway, **Volume Reference**\
    https://docs.railway.com/volumes/reference
15. Git, **gitignore Documentation**\
    https://git-scm.com/docs/gitignore

## Known Limitations

-   Authentication is basic and intended for a proof-of-concept.
-   Passwords should use secure hashing in a production system.
-   The application mainly focuses on administrator operations.
-   Integration testing currently focuses on vendor CRUD.
-   Additional stall and allocation integration tests could be added.
-   SQLite is suitable for this proof-of-concept, but a larger system
    may require a dedicated database service.
-   Accessibility and responsive design could be improved.

## Future Improvements

-   Password hashing.
-   Role-based access control.
-   Vendor-specific user accounts.
-   Stall and allocation integration tests.
-   Pagination.
-   Additional report filters.
-   GitHub Actions for automated testing.
-   Accessibility improvements.
-   Responsive mobile interface.
-   Additional external service API integration.

## Conclusion

The Farmers Market Management System demonstrates a proof-of-concept
information system developed using JavaScript.

The application demonstrates CRUD operations, API-based frontend and
backend communication, Express routing, SQLite relational data storage,
validation, business rules, database integrity, reusable code, automated
unit testing, integration testing, Git-based incremental development,
and cloud deployment.

The final application is publicly accessible through Railway and
demonstrates interaction between the frontend, Express API, and
persistent SQLite database.

