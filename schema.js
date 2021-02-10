// require('dotenv').config();

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLOutput,
  GraphQLInputObjectType,
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

const SizeObjectType = new GraphQLObjectType({
  name: 'SizeObject',
  fields: {
    h: { type: GraphQLInt },
    w: { type: GraphQLInt },
    resize: { type: GraphQLString },
  },
});

const SizesType = new GraphQLObjectType({
  name: 'Sizes',
  fields: {
    medium: { type: SizeObjectType },
    small: { type: SizeObjectType },
    thumb: { type: SizeObjectType },
    large: { type: SizeObjectType },
  },
});

const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: {
    // id: { type: GraphQLInt },
    id_str: { type: GraphQLString },
    media_url: { type: GraphQLString },
    media_url_https: { type: GraphQLString },
    type: { type: GraphQLString },
    sizes: { type: SizesType },
  },
});

const EntitiesType = new GraphQLObjectType({
  name: 'Entities',
  fields: {
    media: { type: new GraphQLList(MediaType) },
    // sizes: { type: SizesType },
  },
});

const ExtendedEntitiesType = new GraphQLObjectType({
  name: 'Extended_Entities',
  fields: {
    media: { type: new GraphQLList(MediaType) },
  },
});

const TweetData = new GraphQLObjectType({
  name: 'Tweets',
  fields: () => ({
    id_str: { type: GraphQLString },
    created_at: { type: GraphQLString },
    // text: { type: GraphQLString },
    full_text: { type: GraphQLString },
    entities: { type: EntitiesType },
    extended_entities: { type: ExtendedEntitiesType },
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
          tweet_mode: 'extended',
        }).then(function (result) {
          console.log(result.data);
          result.data.forEach((tweet, i) => {
            console.log(i, tweet.entities.media);
          });
          return result.data;
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
