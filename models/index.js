const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});


const Page = db.define('page', {
  title: {
      type: Sequelize.STRING,
      allowNull: false
  },
  urlTitle: {
      type: Sequelize.STRING,
      allowNull: false,
        //virtual getter, not a permanent property that exists
        // getRoute(){
        //     const urlTitle = this.getDataValue('urlTitle');
        //     return '/wiki/' + this.getDataValue(title);
        // }
  },
  content: {
      type: Sequelize.TEXT,
      allowNull: false
  },
  status: {
      type: Sequelize.ENUM('open', 'closed')
  },
  date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
  }
});

//outside the instance so URL's are not stored in the database
Page.hook('beforeValidate', (page, options)=>{
    page.urlTitle = generateUrlTitle(page.title);
})

function generateUrlTitle (title) {
    if (title) {
      // Removes all non-alphanumeric characters from title
      // And make whitespace underscore
        let url = '/wiki/' + title.replace(/\s+/g, '_').replace(/\W/g, '');
      return url;
    } else {
      // Generates random 5 letter string
      return Math.random().toString(36).substring(2, 7);
    }
  }

const User = db.define('user', {
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          isEmail: true
      }
  }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
};
