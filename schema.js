// require('dotenv').config();

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = require('graphql');

var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const TweetData = new GraphQLObjectType({
  name: 'Tweets',
  fields: () => ({
    id_str: { type: GraphQLString },
    created_at: { type: GraphQLString },
    text: { type: GraphQLString },
    // mission_name: { type: GraphQLString },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tweets: {
      type: new GraphQLList(TweetData),
      resolve(parent, args) {
        return T.get('statuses/user_timeline', {
          screen_name: 'frieslandschool',
          count: 5,
        }).then(function (result) {
          console.log(result.data);
          return result.data;
        });
        // return axios
        //   .get('https://api.spacexdata.com/v3/launches')
        //   .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
