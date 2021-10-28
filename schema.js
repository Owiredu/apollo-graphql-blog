const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        name: String
        posts: [Post]
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        image: String
        createDate: String
        author: User!
        comments: [Comment]
    }

    type PostResponse {
        status: Int
        message: String!
    }

    input CreatePostContent {
        title: String!
        body: String!
        image: String
        author_id: Int!
        createDate: String!
    }

    input UpdatePostContent {
        id: Int!
        title: String!
        body: String!
        image: String!
        author_id: Int!
    }

    type Comment {
        id: ID!
        body: String!
        user: User!
        post: Post!
    }

    type Query {
        getUser(email: String!): User
        getPost(title: String!): Post
        getComment(id: ID!): Comment
        getAllUsers: [User]
        getAllPosts: [Post]
        getAllComments: [Comment]
    }

    type Mutation {
        createPost(content: CreatePostContent!): PostResponse!
        updatePost(content: UpdatePostContent!): PostResponse!
        deletePost: Post
        likePost: Post
        unlikePost: Post
        createComment: Comment
        deleteComment: Comment
        replyComment: Comment
    }
`;

module.exports = typeDefs;