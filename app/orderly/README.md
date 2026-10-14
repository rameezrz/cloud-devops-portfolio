# Orderly [homepage](https://orderly-three.vercel.app/)

![Dashboard](https://ovq37ygrsuppsjg2.public.blob.vercel-storage.com/orderly-first)
![Landing Page](https://ovq37ygrsuppsjg2.public.blob.vercel-storage.com/orderly-second)

**Orderly** is a full-stack application designed to manage various functionalities effectively. It features a robust backend built with TypeScript, Express, and MongoDB, alongside a responsive frontend using React, Vite, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### Backend

- **Data Management**: CRUD operations for managing various resources.
- **File Upload**: Integration with Cloudinary for media storage.
- **API Documentation**: Auto-generated API docs using Swagger.
- **Excel Export**: Ability to export data to Excel files.

### Frontend

- **Responsive Design**: Optimized for desktop and mobile views using Tailwind CSS.
- **Dynamic Data Visualization**: Charts and graphs for real-time data insights.
- **Form Handling**: Robust forms with validation using React Hook Form and Zod.
- **User Notifications**: Toast notifications for user feedback.

## Technologies

### Backend

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for flexible data storage.
- **TypeScript**: Typed superset of JavaScript that enhances code quality.
- **Swagger**: API documentation and testing tool.

**Dependencies**:

- `cloudinary`: For image and media management.
- `cors`: Middleware for enabling CORS.
- `dotenv`: For loading environment variables.
- `exceljs`: For handling Excel file operations.
- `joi`: For data validation.
- `mongoose`: ODM for MongoDB.
- `multer`: Middleware for handling file uploads.
- `winston`: For logging.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Ant Design**: UI library for building beautiful interfaces.
- **React Query**: Data-fetching and state management library.

**Dependencies**:

- `@heroicons/react`: Icon library for React.
- `axios`: Promise-based HTTP client for the browser.
- `react-router-dom`: Declarative routing for React.
- `react-toastify`: Notification library for React.

##### Installation

1. Clone the Repository

```sh
git clone https://github.com/rameezrz/orderly.git
cd server
```

2. Install Dependencies

```sh
npm install
```

3. Environment Variables
   Create a .env file in the root directory and add the following environment variables:

```sh
PORT=5000
NODE_ENV="development"
BASE_URL="https://api.yourdomain.com"
DATABASE_URL="db_uri"
CLOUDINARY_CLOUD_NAME="cloud-name"
CLOUDINARY_API_KEY="api-key"
CLOUDINARY_API_SECRET="api-secret"
```

4. Run the Application

```sh
npm run dev
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[Ace Editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[Twitter Bootstrap]: http://twitter.github.com/bootstrap/
[jQuery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[AngularJS]: http://angularjs.org
[Gulp]: http://gulpjs.com
[PlDb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[PlGh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[PlGd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[PlOd]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[PlMe]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[PlGa]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
