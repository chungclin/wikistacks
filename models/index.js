const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost:5432/wikistack", {
  logging: false
});

const Page = db.define("page", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM("open", "closed"),
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  route: {
    type: Sequelize.VIRTUAL,
    get() {
      return "/wiki/" + this.getDataValue("urlTitle");
    }
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    set: function(value) {
      let arrayOfTags;
      if (typeof value === "string") {
        arrayOfTags = value.split(",").map(tag => {
          return tag.trim();
        });
        this.setDataValue("tags", arrayOfTags);
      } else {
        this.setDataValue("tags", value);
      }
    }
  }
});

//class method
Page.findByTag = function(tag) {
  return Page.findAll({
    where: {
      tags: {
        $overlap: [tag]
      }
    }
  });
};

Page.beforeValidate(function(page) {
  if (page.title) {
    page.urlTitle = page.title.replace(/\s+/g, "_").replace(/\W/g, "");
  }
});

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    // unique: true,
    validate: {
      // isEmail: true
    },
    allowNull: false
  }
});

Page.belongsTo(User, { as: "author" });

module.exports = {
  db,
  Page,
  User
};
