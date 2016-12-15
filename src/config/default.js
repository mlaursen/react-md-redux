module.exports = {
  host: process.env.NODE_HOST || 'localhost',
  port: process.env.NODE_PORT || 3000,
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'React-MD Starter',
    titleTemplate: '%s - React-MD Starter',
    meta: [{
      name: 'description',
      content: 'Wowza! Look at this stuff!',
    }],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://unpkg.com/react-md@1.0.0/dist/react-md.teal-pink.min.css' },
    ],
  },
};
